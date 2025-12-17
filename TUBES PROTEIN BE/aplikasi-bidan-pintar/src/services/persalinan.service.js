const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Helper function to convert date formats
 * Converts DD/MM/YYYY to YYYY-MM-DD for database
 */
const convertDate = (dateStr) => {
  if (!dateStr) return null;
  
  // Already in YYYY-MM-DD format
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    return dateStr;
  }
  
  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  
  return dateStr;
};

/**
 * Create new delivery registration
 */
const createRegistrasiPersalinan = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, lila_ibu, lida_ibu,
    tanggal, penolong, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,
    tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
    as_bayi, bb_bayi, pb_bayi, lika_bayi
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check if patient exists, create or update
    let id_pasien;
    const [existingPasien] = await connection.query(
      'SELECT id_pasien FROM pasien WHERE nik = ?',
      [nik_istri]
    );

    if (existingPasien.length > 0) {
      id_pasien = existingPasien[0].id_pasien;
      await connection.query(
        'UPDATE pasien SET nama = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
        [nama_istri, umur_istri, alamat, no_hp || null, id_pasien]
      );
    } else {
      id_pasien = uuidv4();
      await connection.query(
        'INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
        [id_pasien, nama_istri, nik_istri, umur_istri, alamat, no_hp || null]
      );
    }

    // 2. Create examination record
    const id_pemeriksaan = uuidv4();
    
    const subjektif_final = `Persalinan Anak Ke-${anak_ke || '-'}, Jenis Partus: ${jenis_partus || '-'}`;
    const objektif_final = `Ibu - TD: ${td_ibu || '-'}, BB: ${bb_ibu || '-'} kg, LILA: ${lila_ibu || '-'} cm, LIDA: ${lida_ibu || '-'} cm | Bayi - BB: ${bb_bayi || '-'} gram, PB: ${pb_bayi || '-'} cm, LIKA: ${lika_bayi || '-'} cm, AS: ${as_bayi || '-'}`;
    const tatalaksana_final = `Penolong: ${penolong || '-'}, IMD: ${imd_dilakukan ? 'Ya' : 'Tidak'}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, tanggal_pemeriksaan, subjektif, objektif, analisa, tatalaksana)
       VALUES (?, ?, 'Persalinan', ?, ?, ?, '', ?)`,
      [id_pemeriksaan, id_pasien, tanggalConverted, subjektif_final, objektif_final, tatalaksana_final]
    );

    // 3. Create persalinan record
    const id_persalinan = uuidv4();
    await connection.query(
      `INSERT INTO layanan_persalinan (
        id_persalinan, id_pemeriksaan, no_reg_lama, no_reg_baru, penolong,
        nama_suami, nik_suami, umur_suami,
        tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
        as_bayi, bb_bayi, pb_bayi, lila_ibu, lida_ibu, lika_bayi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_persalinan, id_pemeriksaan, no_reg_lama || null, no_reg_baru || null, penolong || null,
        nama_suami || null, nik_suami || null, umur_suami || null,
        tanggalLahirConverted || null, jenis_kelamin || null, anak_ke || null, jenis_partus || null,
        imd_dilakukan ? 1 : 0, as_bayi || null, bb_bayi || null, pb_bayi || null,
        lila_ibu || null, lida_ibu || null, lika_bayi || null
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_persalinan', id_persalinan);

    return {
      id_persalinan,
      id_pemeriksaan,
      id_pasien,
      message: 'Registrasi Persalinan berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get delivery record by ID
 */
const getPersalinanById = async (id_pemeriksaan) => {
  const query = `
    SELECT
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal,
      p.jenis_layanan,
      pers.id_persalinan,
      pers.no_reg_lama,
      pers.no_reg_baru,
      pers.penolong,
      pers.nama_suami,
      pers.nik_suami,
      pers.umur_suami,
      pers.lila_ibu,
      pers.lida_ibu,
      DATE_FORMAT(pers.tanggal_lahir, '%Y-%m-%d') as tanggal_lahir,
      pers.jenis_kelamin,
      pers.anak_ke,
      pers.jenis_partus,
      pers.imd_dilakukan,
      pers.as_bayi,
      pers.bb_bayi,
      pers.pb_bayi,
      pers.lika_bayi,
      pas.nama as nama_istri,
      pas.nik as nik_istri,
      pas.umur as umur_istri,
      pas.alamat,
      pas.no_hp,
      p.objektif
    FROM pemeriksaan p
    LEFT JOIN layanan_persalinan pers ON p.id_pemeriksaan = pers.id_pemeriksaan
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'Persalinan'
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  
  if (rows[0]) {
    // Parse objektif field to extract td_ibu and bb_ibu
    const objektif = rows[0].objektif || '';
    
    // Extract TD Ibu (format: "TD: 120/80 mmHg")
    const tdMatch = objektif.match(/TD:\s*([^\s,]+)/);
    rows[0].td_ibu = tdMatch ? tdMatch[1] : '';
    
    // Extract BB Ibu (format: "BB: 65 kg" or "BB: 65.5 kg")
    const bbMatch = objektif.match(/BB:\s*([\d.]+)/);
    rows[0].bb_ibu = bbMatch ? bbMatch[1] : '';
  }
  
  return rows[0] || null;
};

/**
 * Get all delivery records
 */
const getAllPersalinan = async (search = '') => {
  let query = `
    SELECT 
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%d/%m/%Y') as tanggal,
      p.jenis_layanan,
      pas.nama as nama_pasien,
      pas.nik,
      pers.anak_ke,
      pers.jenis_partus,
      pers.penolong,
      pers.no_reg_lama,
      pers.no_reg_baru
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_persalinan pers ON p.id_pemeriksaan = pers.id_pemeriksaan
    WHERE p.jenis_layanan = 'Persalinan'
  `;

  const params = [];
  if (search) {
    query += ` AND (pas.nama LIKE ? OR pas.nik LIKE ? OR pers.jenis_partus LIKE ? OR pers.penolong LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Update delivery registration
 */
const updateRegistrasiPersalinan = async (id_pemeriksaan, data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, lila_ibu, lida_ibu,
    tanggal, penolong, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,
    tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
    as_bayi, bb_bayi, pb_bayi, lika_bayi
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get existing pemeriksaan
    const [existingPemeriksaan] = await connection.query(
      'SELECT id_pasien FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (!existingPemeriksaan[0]) {
      throw new Error('Data pemeriksaan tidak ditemukan');
    }

    const id_pasien = existingPemeriksaan[0].id_pasien;

    // Update patient data
    await connection.query(
      'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
      [nama_istri, nik_istri, umur_istri, alamat, no_hp || null, id_pasien]
    );

    // Update pemeriksaan
    const subjektif_final = `Persalinan Anak Ke-${anak_ke || '-'}, Jenis Partus: ${jenis_partus || '-'}`;
    const objektif_final = `Ibu - TD: ${td_ibu || '-'}, BB: ${bb_ibu || '-'} kg, LILA: ${lila_ibu || '-'} cm, LIDA: ${lida_ibu || '-'} cm | Bayi - BB: ${bb_bayi || '-'} gram, PB: ${pb_bayi || '-'} cm, LIKA: ${lika_bayi || '-'} cm, AS: ${as_bayi || '-'}`;
    const tatalaksana_final = `Penolong: ${penolong || '-'}, IMD: ${imd_dilakukan ? 'Ya' : 'Tidak'}`;

    await connection.query(
      `UPDATE pemeriksaan SET 
        subjektif = ?, objektif = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, tatalaksana_final, tanggalConverted, id_pemeriksaan]
    );

    // Update layanan_persalinan
    await connection.query(
      `UPDATE layanan_persalinan SET
        no_reg_lama = ?,
        no_reg_baru = ?,
        penolong = ?,
        nama_suami = ?,
        nik_suami = ?,
        umur_suami = ?,
        lila_ibu = ?,
        lida_ibu = ?,
        tanggal_lahir = ?,
        jenis_kelamin = ?,
        anak_ke = ?,
        jenis_partus = ?,
        imd_dilakukan = ?,
        as_bayi = ?,
        bb_bayi = ?,
        pb_bayi = ?,
        lika_bayi = ?
       WHERE id_pemeriksaan = ?`,
      [
        no_reg_lama || null, no_reg_baru || null, penolong || null,
        nama_suami || null, nik_suami || null, umur_suami || null,
        lila_ibu || null, lida_ibu || null,
        tanggalLahirConverted || null, jenis_kelamin || null, anak_ke || null, jenis_partus || null,
        imd_dilakukan ? 1 : 0, as_bayi || null, bb_bayi || null, pb_bayi || null, lika_bayi || null,
        id_pemeriksaan
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_persalinan', id_pemeriksaan);

    return getPersalinanById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete delivery registration
 */
const deleteRegistrasiPersalinan = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [persalinan] = await connection.query(
      'SELECT id_persalinan FROM layanan_persalinan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (persalinan.length === 0) {
      throw new Error('Data Persalinan tidak ditemukan');
    }

    await connection.query(
      'DELETE FROM layanan_persalinan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    await connection.query(
      'DELETE FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'DELETE', 'layanan_persalinan', persalinan[0].id_persalinan);

    return { message: 'Data Persalinan berhasil dihapus' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiPersalinan,
  getPersalinanById,
  getAllPersalinan,
  updateRegistrasiPersalinan,
  deleteRegistrasiPersalinan
};
