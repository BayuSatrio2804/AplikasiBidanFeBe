/**
 * Service Jadwal
 * Menangani semua operasi database terkait jadwal
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Ambil daftar jadwal dengan filter opsional
 * @param {number} bulan - Filter bulan
 * @param {number} tahun - Filter tahun
 * @param {string} layanan - Filter jenis layanan
 * @returns {Array} Daftar jadwal
 */
const listJadwal = async (bulan, tahun, layanan) => {
  console.log(`[DEBUG-JADWAL-SERVICE] Filters: bulan=${bulan}, tahun=${tahun}, layanan=${layanan}`);
  let query = `
    SELECT * FROM (
      -- 1. Jadwal Manual
      SELECT 
        j.id_jadwal, 
        j.id_pasien,
        j.tanggal, 
        j.jam_mulai, 
        j.jam_selesai, 
        j.jenis_layanan,
        p.nama AS nama_pasien,
        u.nama_lengkap AS nama_petugas,
        'Manual' as source
      FROM jadwal j
      JOIN pasien p ON j.id_pasien = p.id_pasien
      JOIN users u ON j.id_petugas = u.id_user

      UNION ALL

      -- 2. HPL dari ANC (Perkiraan Lahir) - Only latest per patient
      SELECT 
        anc.id_anc as id_jadwal,
        pem.id_pasien,
        anc.hpl as tanggal,
        COALESCE(anc.jam_hpl, '08:00:00') as jam_mulai,
        COALESCE(anc.jam_hpl_selesai, ADDTIME(COALESCE(anc.jam_hpl, '08:00:00'), '01:00:00')) as jam_selesai,
        'ANC' as jenis_layanan,
        p.nama as nama_pasien,
        'Sistem (HPL)' as nama_petugas,
        'Automatic' as source
      FROM layanan_anc anc
      JOIN pemeriksaan pem ON anc.id_pemeriksaan = pem.id_pemeriksaan
      JOIN pasien p ON pem.id_pasien = p.id_pasien
      WHERE anc.hpl IS NOT NULL
        AND pem.id_pemeriksaan = (
          SELECT pem2.id_pemeriksaan
          FROM pemeriksaan pem2
          JOIN layanan_anc anc2 ON pem2.id_pemeriksaan = anc2.id_pemeriksaan
          WHERE pem2.id_pasien = pem.id_pasien
            AND pem2.jenis_layanan = 'ANC'
            AND anc2.hpl IS NOT NULL
          ORDER BY pem2.tanggal_pemeriksaan DESC, pem2.created_at DESC
          LIMIT 1
        )

      UNION ALL

      -- 3. Jadwal Selanjutnya Imunisasi - Only latest per patient
      SELECT 
        im.id_imunisasi as id_jadwal,
        pem.id_pasien,
        im.jadwal_selanjutnya as tanggal,
        COALESCE(im.jam_jadwal_selanjutnya, '09:00:00') as jam_mulai,
        COALESCE(im.jam_jadwal_selanjutnya_selesai, ADDTIME(COALESCE(im.jam_jadwal_selanjutnya, '09:00:00'), '01:00:00')) as jam_selesai,
        'Imunisasi' as jenis_layanan,
        p.nama as nama_pasien,
        CONCAT('Sistem (', COALESCE(im.jenis_imunisasi, 'Imunisasi'), ')') as nama_petugas,
        'Automatic' as source
      FROM layanan_imunisasi im
      JOIN pemeriksaan pem ON im.id_pemeriksaan = pem.id_pemeriksaan
      JOIN pasien p ON pem.id_pasien = p.id_pasien
      WHERE im.jadwal_selanjutnya IS NOT NULL
        AND pem.id_pemeriksaan = (
          SELECT pem2.id_pemeriksaan
          FROM pemeriksaan pem2
          JOIN layanan_imunisasi im2 ON pem2.id_pemeriksaan = im2.id_pemeriksaan
          WHERE pem2.id_pasien = pem.id_pasien
            AND pem2.jenis_layanan = 'Imunisasi'
            AND im2.jadwal_selanjutnya IS NOT NULL
          ORDER BY pem2.tanggal_pemeriksaan DESC, pem2.created_at DESC
          LIMIT 1
        )

      UNION ALL

      -- 4. Kunjungan Ulang KB - Only latest per patient
      SELECT 
        kb.id_kb as id_jadwal,
        pem.id_pasien,
        kb.kunjungan_ulang as tanggal,
        COALESCE(kb.jam_kunjungan_ulang, '08:00:00') as jam_mulai,
        COALESCE(kb.jam_kunjungan_ulang_selesai, ADDTIME(COALESCE(kb.jam_kunjungan_ulang, '08:00:00'), '01:00:00')) as jam_selesai,
        'KB' as jenis_layanan,
        p.nama as nama_pasien,
        'Sistem (KB)' as nama_petugas,
        'Automatic' as source
      FROM layanan_kb kb
      JOIN pemeriksaan pem ON kb.id_pemeriksaan = pem.id_pemeriksaan
      JOIN pasien p ON pem.id_pasien = p.id_pasien
      WHERE kb.kunjungan_ulang IS NOT NULL
        AND pem.id_pemeriksaan = (
          SELECT pem2.id_pemeriksaan
          FROM pemeriksaan pem2
          JOIN layanan_kb kb2 ON pem2.id_pemeriksaan = kb2.id_pemeriksaan
          WHERE pem2.id_pasien = pem.id_pasien
            AND pem2.jenis_layanan = 'KB'
            AND kb2.kunjungan_ulang IS NOT NULL
          ORDER BY pem2.tanggal_pemeriksaan DESC, pem2.created_at DESC
          LIMIT 1
        )
    ) AS gabungan
    WHERE gabungan.tanggal >= CURDATE()  -- Filter: hanya tampilkan jadwal hari ini dan masa depan
  `;
  const params = [];

  if (bulan) {
    query += ' AND MONTH(gabungan.tanggal) = ?';
    params.push(bulan);
  }

  if (tahun) {
    query += ' AND YEAR(gabungan.tanggal) = ?';
    params.push(tahun);
  }

  if (layanan) {
    query += ' AND gabungan.jenis_layanan = ?';
    params.push(layanan);
  }

  query += ' ORDER BY gabungan.tanggal ASC, gabungan.jam_mulai ASC';

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Buat jadwal baru
 * @param {Object} data - Data jadwal
 * @returns {Object} Jadwal yang dibuat
 */
const createJadwal = async (data) => {
  const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;
  const id_jadwal = uuidv4();

  const query = `
    INSERT INTO jadwal (id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.query(query, [id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai]);

  return { id_jadwal, ...data };
};

/**
 * Ambil detail jadwal berdasarkan ID
 * @param {string} id_jadwal - ID Jadwal
 * @returns {Object|null} Detail jadwal
 */
const getDetailJadwal = async (id_jadwal) => {
  const query = `
    SELECT 
      j.id_jadwal, j.id_pasien, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
      p.nama AS nama_pasien,
      u.nama_lengkap AS nama_petugas
    FROM jadwal j
    JOIN pasien p ON j.id_pasien = p.id_pasien
    JOIN users u ON j.id_petugas = u.id_user
    WHERE j.id_jadwal = ?
  `;

  const [rows] = await db.query(query, [id_jadwal]);
  return rows[0] || null;
};

/**
 * Update jadwal
 * @param {string} id_jadwal - ID Jadwal
 * @param {Object} data - Data jadwal terbaru
 * @returns {Object} Jadwal terupdate
 */
const updateJadwal = async (id_jadwal, data) => {
  const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;

  const query = `
    UPDATE jadwal 
    SET id_pasien = ?, id_petugas = ?, jenis_layanan = ?, tanggal = ?, jam_mulai = ?, jam_selesai = ?
    WHERE id_jadwal = ?
  `;

  await db.query(query, [id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai, id_jadwal]);

  return { id_jadwal, ...data };
};

/**
 * Hapus jadwal
 * @param {string} id_jadwal - ID Jadwal
 * @returns {Object} Hasil penghapusan
 */
const deleteJadwal = async (id_jadwal) => {
  const [result] = await db.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id_jadwal]);

  if (result.affectedRows === 0) {
    // Cek apakah ini jadwal otomatis
    const [anc] = await db.query('SELECT 1 FROM layanan_anc WHERE id_anc = ?', [id_jadwal]);
    const [kb] = await db.query('SELECT 1 FROM layanan_kb WHERE id_kb = ?', [id_jadwal]);
    const [imunisasi] = await db.query('SELECT 1 FROM layanan_imunisasi WHERE id_imunisasi = ?', [id_jadwal]);

    if (anc.length > 0 || kb.length > 0 || imunisasi.length > 0) {
      throw new Error("Data yang tergenerate secara otomatis hanya bisa dihapus ketika data pada pemerikasaan layanan dihapus");
    }
  }

  return result;
};

module.exports = {
  listJadwal,
  createJadwal,
  getDetailJadwal,
  updateJadwal,
  deleteJadwal
};
