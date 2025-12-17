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
 * Create new immunization registration
 */
const createRegistrasiImunisasi = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    tanggal, no_reg, jenis_imunisasi, pengobatan,
    nama_suami, nik_suami, umur_suami,
    nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi,
    jadwal_selanjutnya
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir_bayi);

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
    
    const subjektif_final = `Imunisasi ${jenis_imunisasi || ''} untuk ${nama_bayi_balita || 'bayi'}`;
    const objektif_final = `Bayi: ${nama_bayi_balita || '-'}, TB: ${tb_bayi || '-'} cm, BB: ${bb_bayi || '-'} kg`;
    const tatalaksana_final = `Jenis Imunisasi: ${jenis_imunisasi || '-'}, Pengobatan: ${pengobatan || '-'}, Jadwal Selanjutnya: ${jadwal_selanjutnya || '-'}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, tanggal_pemeriksaan, subjektif, objektif, analisa, tatalaksana, created_by)
       VALUES (?, ?, 'Imunisasi', ?, ?, ?, '', ?, ?)`,
      [id_pemeriksaan, id_pasien, tanggalConverted, subjektif_final, objektif_final, tatalaksana_final, userId]
    );

    // 3. Create immunization record
    const id_imunisasi = uuidv4();
    await connection.query(
      `INSERT INTO layanan_imunisasi (
        id_imunisasi, id_pemeriksaan, no_reg, nama_bayi_balita, tanggal_lahir_bayi,
        tb_bayi, bb_bayi, jenis_imunisasi, pengobatan, jadwal_selanjutnya, no_hp_kontak,
        nama_ibu, nik_ibu, umur_ibu, nama_ayah, nik_ayah, umur_ayah
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_imunisasi, id_pemeriksaan, no_reg || null,
        nama_bayi_balita || null, tanggalLahirConverted || null,
        tb_bayi || null, bb_bayi || null,
        jenis_imunisasi, pengobatan || null, jadwal_selanjutnya || null, no_hp || null,
        nama_istri, nik_istri, umur_istri,
        nama_suami || null, nik_suami || null, umur_suami || null
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_imunisasi', id_imunisasi);

    return {
      id_imunisasi,
      id_pemeriksaan,
      id_pasien,
      message: 'Registrasi Imunisasi berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get immunization record by ID
 */
const getImunisasiById = async (id_pemeriksaan) => {
  const query = `
    SELECT
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal,
      p.jenis_layanan,
      im.id_imunisasi,
      im.no_reg,
      im.jenis_imunisasi,
      im.nama_ibu as nama_istri,
      im.nik_ibu as nik_istri,
      im.umur_ibu as umur_istri,
      im.nama_ayah as nama_suami,
      im.nik_ayah as nik_suami,
      im.umur_ayah as umur_suami,
      im.nama_bayi_balita,
      DATE_FORMAT(im.tanggal_lahir_bayi, '%Y-%m-%d') as tanggal_lahir_bayi,
      im.tb_bayi,
      im.bb_bayi,
      im.pengobatan,
      im.jadwal_selanjutnya,
      im.no_hp_kontak as no_hp,
      pas.alamat
    FROM pemeriksaan p
    LEFT JOIN layanan_imunisasi im ON p.id_pemeriksaan = im.id_pemeriksaan
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'Imunisasi'
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Get all immunization records
 */
const getAllImunisasi = async (search = '') => {
  let query = `
    SELECT 
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%d/%m/%Y') as tanggal,
      p.jenis_layanan,
      pas.nama,
      pas.nik,
      im.nama_bayi_balita,
      im.jenis_imunisasi,
      im.no_reg
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_imunisasi im ON p.id_pemeriksaan = im.id_pemeriksaan
    WHERE p.jenis_layanan = 'Imunisasi'
  `;

  const params = [];
  if (search) {
    query += ` AND (pas.nama LIKE ? OR pas.nik LIKE ? OR im.nama_bayi_balita LIKE ? OR im.jenis_imunisasi LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Update immunization registration
 */
const updateRegistrasiImunisasi = async (id_pemeriksaan, data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    tanggal, no_reg, jenis_imunisasi, pengobatan,
    nama_suami, nik_suami, umur_suami,
    nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi,
    jadwal_selanjutnya
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir_bayi);

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
    const subjektif_final = `Imunisasi ${jenis_imunisasi || ''} untuk ${nama_bayi_balita || 'bayi'}`;
    const objektif_final = `Bayi: ${nama_bayi_balita || '-'}, TB: ${tb_bayi || '-'} cm, BB: ${bb_bayi || '-'} kg`;
    const tatalaksana_final = `Jenis Imunisasi: ${jenis_imunisasi || '-'}, Pengobatan: ${pengobatan || '-'}, Jadwal Selanjutnya: ${jadwal_selanjutnya || '-'}`;

    await connection.query(
      `UPDATE pemeriksaan SET 
        subjektif = ?, objektif = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, tatalaksana_final, tanggalConverted, id_pemeriksaan]
    );

    // Update layanan_imunisasi
    await connection.query(
      `UPDATE layanan_imunisasi SET
        no_reg = ?, 
        nama_bayi_balita = ?, 
        tanggal_lahir_bayi = ?,
        tb_bayi = ?, 
        bb_bayi = ?,
        jenis_imunisasi = ?, 
        pengobatan = ?, 
        jadwal_selanjutnya = ?, 
        no_hp_kontak = ?,
        nama_ibu = ?, 
        nik_ibu = ?, 
        umur_ibu = ?,
        nama_ayah = ?, 
        nik_ayah = ?, 
        umur_ayah = ?
       WHERE id_pemeriksaan = ?`,
      [
        no_reg || null,
        nama_bayi_balita || null, 
        tanggalLahirConverted || null,
        tb_bayi || null, 
        bb_bayi || null,
        jenis_imunisasi, 
        pengobatan || null, 
        jadwal_selanjutnya || null, 
        no_hp || null,
        nama_istri, 
        nik_istri, 
        umur_istri,
        nama_suami || null, 
        nik_suami || null, 
        umur_suami || null,
        id_pemeriksaan
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_imunisasi', id_pemeriksaan);

    return getImunisasiById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete immunization registration
 */
const deleteRegistrasiImunisasi = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [imunisasi] = await connection.query(
      'SELECT id_imunisasi FROM layanan_imunisasi WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (imunisasi.length === 0) {
      throw new Error('Data Imunisasi tidak ditemukan');
    }

    await connection.query(
      'DELETE FROM layanan_imunisasi WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    await connection.query(
      'DELETE FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'DELETE', 'layanan_imunisasi', imunisasi[0].id_imunisasi);

    return { message: 'Data Imunisasi berhasil dihapus' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiImunisasi,
  getImunisasiById,
  getAllImunisasi,
  updateRegistrasiImunisasi,
  deleteRegistrasiImunisasi
};
