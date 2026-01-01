/**
 * Controller Laporan
 * Menangani request HTTP untuk pembuatan laporan
 */

const ExcelJS = require('exceljs');
const laporanService = require('../services/laporan.service');
const { success, badRequest, serverError, notFound } = require('../utils/response');

/**
 * Ambil daftar ringkasan laporan
 * GET /api/laporan/list
 */
const getLaporanList = async (req, res) => {
  try {
    const filters = {
      jenis_layanan: req.query.jenis_layanan,
      periode: req.query.periode,
      search: req.query.search,
      limit: req.query.limit
    };

    const laporanList = await laporanService.getLaporanList(filters);

    return success(res, 'Data laporan berhasil diambil', laporanList);
  } catch (error) {
    console.error('Error fetching laporan list:', error);
    return serverError(res, 'Gagal mengambil data laporan', error);
  }
};

/**
 * Ambil laporan berdasarkan ID
 * GET /api/laporan/:id
 */
const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    const laporan = await laporanService.getLaporanById(id);

    if (!laporan) {
      return notFound(res, 'Laporan tidak ditemukan');
    }

    return success(res, 'Data laporan berhasil diambil', laporan);
  } catch (error) {
    console.error('Error fetching laporan by ID:', error);
    return serverError(res, 'Gagal mengambil data laporan', error);
  }
};

/**
 * Buat ringkasan laporan baru
 * POST /api/laporan
 */
const createLaporan = async (req, res) => {
  try {
    const { jenis_layanan, periode, tanggal_dibuat, jumlah_pasien, jumlah_kunjungan, label } = req.body;

    // Validasi
    if (!jenis_layanan || !periode) {
      return badRequest(res, 'Jenis layanan dan periode harus diisi');
    }

    const data = {
      jenis_layanan,
      periode,
      tanggal_dibuat,
      jumlah_pasien: 0, // Default, akan dihitung ulang di bawah ini
      jumlah_kunjungan: 0, // Default, akan dihitung ulang di bawah ini
      label
    };

    // Perbaikan Bug #5: Hitung statistik secara otomatis agar data akurat
    // Format periode diharapkan "MM/YYYY" (misal: "01/2025")
    if (periode && periode.includes('/')) {
      const [bulanStr, tahunStr] = periode.split('/');
      const bulan = parseInt(bulanStr, 10);
      const tahun = parseInt(tahunStr, 10);

      if (!isNaN(bulan) && !isNaN(tahun)) {
        const stats = await laporanService.calculateLaporanSummary(jenis_layanan, bulan, tahun);
        data.jumlah_pasien = stats.jumlah_pasien;
        data.jumlah_kunjungan = stats.jumlah_kunjungan;
      }
    }

    // Fallback jika format periode berbeda (misal hanya tahun), biarkan 0 atau gunakan input pengguna (opsional, tapi lebih aman 0 agar tidak menyesatkan)

    const newLaporan = await laporanService.createLaporan(data);

    return success(res, 'Laporan berhasil dibuat', newLaporan, 201);
  } catch (error) {
    console.error('Error creating laporan:', error);
    return serverError(res, 'Gagal membuat laporan', error);
  }
};

/**
 * Update laporan
 * PUT /api/laporan/:id
 */
const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Cek apakah laporan ada
    const existingLaporan = await laporanService.getLaporanById(id);
    if (!existingLaporan) {
      return notFound(res, 'Laporan tidak ditemukan');
    }

    const updatedLaporan = await laporanService.updateLaporan(id, updateData);

    return success(res, 'Laporan berhasil diupdate', updatedLaporan);
  } catch (error) {
    console.error('Error updating laporan:', error);
    return serverError(res, 'Gagal mengupdate laporan', error);
  }
};

/**
 * Hapus laporan
 * DELETE /api/laporan/:id
 */
const deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah laporan ada
    const existingLaporan = await laporanService.getLaporanById(id);
    if (!existingLaporan) {
      return notFound(res, 'Laporan tidak ditemukan');
    }

    const deleted = await laporanService.deleteLaporan(id);

    if (!deleted) {
      return serverError(res, 'Gagal menghapus laporan');
    }

    return success(res, 'Laporan berhasil dihapus');
  } catch (error) {
    console.error('Error deleting laporan:', error);
    return serverError(res, 'Gagal menghapus laporan', error);
  }
};

/**
 * Generate laporan bulanan (Format Excel)
 * GET /api/laporan?format=excel&bulan=1&tahun=2025&jenis_layanan=ANC
 */
/**
 * Helper: Generate Single Sheet
 */
const generateSheet = async (workbook, sheetName, jenis_layanan, bulanInt, tahunInt) => {
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][bulanInt - 1];

  // Truncate sheet name if needed
  if (sheetName.length > 31) {
    sheetName = sheetName.substring(0, 31);
  }

  // Handle duplicate sheet names (ExcelJS throws error)
  let finalSheetName = sheetName;
  let counter = 1;
  while (workbook.getWorksheet(finalSheetName)) {
    finalSheetName = `${sheetName.substring(0, 28)}(${counter})`;
    counter++;
  }

  const worksheet = workbook.addWorksheet(finalSheetName);

  // ==========================================
  // 1. SETUP KOP SURAT (LETTERHEAD)
  // ==========================================

  worksheet.mergeCells('A1:K1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `PRAKTIK MANDIRI BIDAN (PMB) YEYE FAHRINA`;
  titleCell.font = { bold: true, size: 16, name: 'Times New Roman' };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A2:K2');
  const addressCell = worksheet.getCell('A2');
  addressCell.value = 'Jl. Cijawura Hilir No. 129, Kec. Buahbatu, Kota Bandung';
  addressCell.font = { size: 11, name: 'Times New Roman' };
  addressCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A3:K3');
  const reportTitleCell = worksheet.getCell('A3');
  // Judul Laporan
  let judulLaporan = '';
  if (jenis_layanan === 'Semua' || jenis_layanan === 'Rekap') {
    judulLaporan = 'REGISTER SEMUA LAYANAN (REKAP)';
  } else {
    judulLaporan = `REGISTER ${jenis_layanan.toUpperCase()}`;
  }

  reportTitleCell.value = judulLaporan;
  reportTitleCell.font = { bold: true, size: 14, name: 'Calibri', underline: true };
  reportTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A4:K4');
  const periodCell = worksheet.getCell('A4');
  periodCell.value = `Periode: ${namaBulan} ${tahunInt}`;
  periodCell.font = { bold: true, size: 11, name: 'Calibri' };
  periodCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.getRow(5).height = 10;

  // ==========================================
  // 2. DEFINISI KOLOM & DATA
  // ==========================================

  let columns = [];
  let reportData = [];

  if (jenis_layanan === 'ANC') {
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 12 },
      { header: 'No. Reg', key: 'no_reg', width: 15 },
      { header: 'Nama Ibu', key: 'nama_ibu', width: 25 },
      { header: 'Nama Suami', key: 'nama_suami', width: 20 },
      { header: 'NIK', key: 'nik', width: 18 },
      { header: 'Umur', key: 'umur', width: 8 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'HPHT', key: 'hpht', width: 12 },
      { header: 'HPL', key: 'hpl', width: 12 },
      { header: 'Hasil Pemeriksaan', key: 'hasil', width: 40 },
      { header: 'Tindakan', key: 'tindakan', width: 30 },
      { header: 'Keterangan', key: 'keterangan', width: 25 }
    ];

    const rawData = await laporanService.getLaporanANC(bulanInt, tahunInt);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID'),
      no_reg: item.no_reg_baru ? `Baru: ${item.no_reg_baru}` : (item.no_reg_lama ? `Lama: ${item.no_reg_lama}` : '-'),
      nama_ibu: item.nama_istri,
      nama_suami: item.nama_suami || '-',
      nik: item.nik_istri || '-',
      umur: item.umur_istri || '-',
      alamat: item.alamat || '-',
      hpht: item.hpht ? new Date(item.hpht).toLocaleDateString('id-ID') : '-',
      hpl: item.hpl ? new Date(item.hpl).toLocaleDateString('id-ID') : '-',
      hasil: item.hasil_pemeriksaan || '-',
      tindakan: item.tindakan || '-',
      keterangan: item.keterangan || '-'
    }));

  } else if (jenis_layanan === 'KB') {
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 12 },
      { header: 'No. Reg', key: 'no_reg', width: 15 },
      { header: 'Nama Istri', key: 'nama_istri', width: 25 },
      { header: 'Nama Suami', key: 'nama_suami', width: 20 },
      { header: 'NIK', key: 'nik', width: 18 },
      { header: 'Umur Istri', key: 'umur_istri', width: 8 },
      { header: 'Umur Suami', key: 'umur_suami', width: 8 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'TD Istri', key: 'td_istri', width: 12 },
      { header: 'BB Istri', key: 'bb_istri', width: 8 },
      { header: 'TD Suami', key: 'td_suami', width: 12 },
      { header: 'BB Suami', key: 'bb_suami', width: 8 },
      { header: 'Metode', key: 'metode', width: 15 },
      { header: 'Kunjungan Ulang', key: 'kunjungan_ulang', width: 15 },
      { header: 'Ket/Efek Samping', key: 'ket', width: 25 }
    ];

    const rawData = await laporanService.getLaporanKB(bulanInt, tahunInt);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID'),
      no_reg: item.nomor_registrasi_baru ? `Baru: ${item.nomor_registrasi_baru}` : (item.nomor_registrasi_lama ? `Lama: ${item.nomor_registrasi_lama}` : '-'),
      nama_istri: item.nama_istri,
      nama_suami: item.nama_suami || '-',
      nik: item.nik_istri || '-',
      umur_istri: item.umur_istri || '-',
      umur_suami: item.umur_suami || '-',
      alamat: item.alamat || '-',
      td_istri: item.td_ibu || '-',
      bb_istri: item.bb_ibu || '-',
      td_suami: item.td_ayah || '-',
      bb_suami: item.bb_ayah || '-',
      metode: item.metode || '-',
      kunjungan_ulang: item.kunjungan_ulang ? new Date(item.kunjungan_ulang).toLocaleDateString('id-ID') : '-',
      ket: item.catatan || '-'
    }));

  } else if (jenis_layanan === 'Imunisasi') {
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 12 },
      { header: 'No. Reg', key: 'no_reg', width: 15 },
      { header: 'Nama Bayi', key: 'nama_bayi', width: 25 },
      { header: 'Tgl Lahir', key: 'tgl_lahir', width: 12 },
      { header: 'Nama Orangtua', key: 'nama_ortu', width: 25 },
      { header: 'NIK', key: 'nik', width: 18 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'TB (cm)', key: 'tb', width: 8 },
      { header: 'BB (kg)', key: 'bb', width: 8 },
      { header: 'Jenis Imunisasi', key: 'jenis', width: 20 },
      { header: 'Jadwal Berikutnya', key: 'jadwal', width: 15 }
    ];

    const rawData = await laporanService.getLaporanImunisasi(bulanInt, tahunInt);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID'),
      no_reg: item.no_reg || '-',
      nama_bayi: item.nama_bayi_balita || '-',
      tgl_lahir: item.tanggal_lahir_bayi ? new Date(item.tanggal_lahir_bayi).toLocaleDateString('id-ID') : '-',
      nama_ortu: `${item.nama_ibu || '-'}/${item.nama_ayah || '-'}`,
      nik: item.nik || '-',
      alamat: item.alamat || '-',
      tb: item.tb_bayi || '-',
      bb: item.bb_bayi || '-',
      jenis: item.jenis_imunisasi || '-',
      jadwal: item.jadwal_selanjutnya ? new Date(item.jadwal_selanjutnya).toLocaleDateString('id-ID') : '-'
    }));

  } else if (jenis_layanan === 'Persalinan') {
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 12 },
      { header: 'No. Reg', key: 'no_reg', width: 15 },
      { header: 'Nama Ibu', key: 'nama_ibu', width: 25 },
      { header: 'Nama Suami', key: 'nama_suami', width: 20 },
      { header: 'NIK', key: 'nik', width: 18 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'Tgl Lahir Bayi', key: 'tgl_lahir_bayi', width: 12 },
      { header: 'JK', key: 'jk', width: 5 },
      { header: 'BB/PB', key: 'bb_pb', width: 15 },
      { header: 'Penolong', key: 'penolong', width: 15 },
      { header: 'Cara Partus', key: 'cara', width: 15 },
      { header: 'Ket', key: 'ket', width: 20 }
    ];

    const rawData = await laporanService.getLaporanPersalinan(bulanInt, tahunInt);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID'),
      no_reg: item.no_reg_baru ? `Baru: ${item.no_reg_baru}` : (item.no_reg_lama ? `Lama: ${item.no_reg_lama}` : '-'),
      nama_ibu: item.nama_istri,
      nama_suami: item.nama_suami || '-',
      nik: item.nik_istri || '-',
      alamat: item.alamat || '-',
      tgl_lahir_bayi: item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID') : '-',
      jk: (item.jenis_kelamin === 'L' || item.jenis_kelamin === 'Laki-laki') ? 'L' : ((item.jenis_kelamin === 'P' || item.jenis_kelamin === 'Perempuan') ? 'P' : '-'),
      bb_pb: `${item.bb_bayi || '-'}g / ${item.pb_bayi || '-'}cm`,
      penolong: item.penolong || '-',
      cara: item.jenis_partus || '-',
      ket: item.imd_dilakukan ? 'IMD: Ya' : '-'
    }));

  } else if (jenis_layanan === 'Kunjungan Pasien') {
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 12 },
      { header: 'No. Reg', key: 'no_reg', width: 15 },
      { header: 'Nama Pasien', key: 'nama', width: 25 },
      { header: 'Nama Suami / Orang Tua', key: 'nama_wali', width: 25 },
      { header: 'NIK', key: 'nik', width: 18 },
      { header: 'Umur', key: 'umur', width: 8 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'TD (mmHg)', key: 'td', width: 12 },
      { header: 'BB (kg)', key: 'bb', width: 8 },
      { header: 'Jenis Kunjungan', key: 'jenis_kunjungan', width: 15 },
      { header: 'Keluhan', key: 'keluhan', width: 25 },
      { header: 'Diagnosa', key: 'diagnosa', width: 25 },
      { header: 'Terapi Obat', key: 'terapi', width: 25 },
      { header: 'Ket', key: 'ket', width: 20 }
    ];

    const rawData = await laporanService.getLaporanKunjunganPasien(bulanInt, tahunInt);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID'),
      no_reg: item.no_reg || '-',
      nama: item.nama_pasien || '-',
      nama_wali: item.nama_wali || '-',
      nik: item.nik_pasien || '-',
      umur: item.umur_pasien || '-',
      alamat: item.alamat || '-',
      td: item.td_pasien || '-',
      bb: item.bb_pasien || '-',
      jenis_kunjungan: item.jenis_kunjungan || '-',
      keluhan: item.keluhan || '-',
      diagnosa: item.diagnosa || '-',
      terapi: item.terapi_obat || '-',
      ket: item.keterangan || '-'
    }));

  } else {
    // REKAP SEMUA / DEFAULT
    columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Nama Pasien', key: 'nama_pasien', width: 25 },
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'Layanan', key: 'jenis_layanan', width: 15 },
      { header: 'Subjektif', key: 'subjektif', width: 40 },
      { header: 'Objektif', key: 'objektif', width: 40 },
      { header: 'Analisa', key: 'analisa', width: 40 },
      { header: 'Tatalaksana', key: 'tatalaksana', width: 40 }
    ];

    // Gunakan 'Semua' sebagai filter jika jenis_layanan adalah 'Rekap' atau 'Semua'
    const filterLayanan = (jenis_layanan === 'Rekap' || jenis_layanan === 'Semua') ? 'Semua' : jenis_layanan;
    const rawData = await laporanService.getLaporanData(bulanInt, tahunInt, filterLayanan);
    reportData = rawData.map((item, index) => ({
      no: index + 1,
      nama_pasien: item.nama_pasien,
      tanggal: new Date(item.tanggal).toLocaleDateString('id-ID'),
      jenis_layanan: item.jenis_layanan,
      subjektif: item.subjektif || '-',
      objektif: item.objektif || '-',
      analisa: item.analisa || '-',
      tatalaksana: item.tatalaksana || '-'
    }));
  }

  // ==========================================
  // 3. RENDER TABEL
  // ==========================================

  // Header Table (Row 6)
  const headerRow = worksheet.getRow(6);
  columns.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width;
    const cell = headerRow.getCell(index + 1);
    cell.value = col.header;
    cell.font = { bold: true, size: 11, name: 'Calibri' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  headerRow.height = 30;

  // Rows Data (From Row 7)
  let currentRow = 7;
  reportData.forEach((rowValues) => {
    const row = worksheet.getRow(currentRow);
    columns.forEach((col, index) => {
      const cell = row.getCell(index + 1);
      cell.value = rowValues[col.key];
      cell.font = { name: 'Calibri', size: 11 };
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Zebra Striping
    if ((currentRow - 6) % 2 === 0) { // Genap (karena index mulai 1 di excel)
      // row.fill = ... (Opsional)
    } else {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
    }

    currentRow++;
  });

  const lastRowIndex = currentRow - 1;

  // ==========================================
  // 4. TANDA TANGAN
  // ==========================================
  const signRowStart = lastRowIndex + 3;
  const colIndex = columns.length > 8 ? 9 : columns.length; // Kolom tanda tangan (biasanya agak kanan)
  const colLetter = worksheet.getColumn(colIndex).letter;

  const dateCell = worksheet.getCell(`${colLetter}${signRowStart}`);
  dateCell.value = `Bandung, ${new Date(tahunInt, bulanInt, 0).getDate()} ${namaBulan} ${tahunInt}`;
  dateCell.alignment = { horizontal: 'center' };

  const roleCell = worksheet.getCell(`${colLetter}${signRowStart + 1}`);
  roleCell.value = 'Bidan';
  roleCell.alignment = { horizontal: 'center' };

  const nameCell = worksheet.getCell(`${colLetter}${signRowStart + 5}`);
  nameCell.value = 'Bdn. Yeye Fahrina, S.Tr.Keb';
  nameCell.font = { bold: true, underline: true };
  nameCell.alignment = { horizontal: 'center' };
};

/**
 * Generate laporan bulanan (Format Excel)
 * GET /api/laporan?format=excel&bulan=1&tahun=2025&jenis_layanan=ANC
 */
const generateLaporanBulanan = async (req, res) => {
  const { format, bulan, tahun, jenis_layanan } = req.query;

  // Validasi
  if (!format || format.toLowerCase() !== 'excel') return badRequest(res, 'Format harus "excel"');
  if (!bulan || !tahun) return badRequest(res, 'Bulan dan tahun harus diisi');

  const bulanInt = parseInt(bulan, 10);
  const tahunInt = parseInt(tahun, 10);

  if (isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12) return badRequest(res, 'Bulan harus angka 1-12');
  if (isNaN(tahunInt) || tahunInt < 2020) return badRequest(res, 'Tahun harus valid (minimal 2020)');

  try {
    const workbook = new ExcelJS.Workbook();

    if (jenis_layanan && jenis_layanan !== 'Semua') {
      // === Single Sheet (Specific Service) ===
      await generateSheet(workbook, `Laporan ${jenis_layanan}`, jenis_layanan, bulanInt, tahunInt);
    } else {
      // === Multi Sheet (All Services) ===

      // 1. Rekap Semua
      await generateSheet(workbook, 'Rekap Semua', 'Rekap', bulanInt, tahunInt);

      // 2. ANC
      await generateSheet(workbook, 'Register ANC', 'ANC', bulanInt, tahunInt);

      // 3. KB
      await generateSheet(workbook, 'Register KB', 'KB', bulanInt, tahunInt);

      // 4. Imunisasi
      await generateSheet(workbook, 'Register Imunisasi', 'Imunisasi', bulanInt, tahunInt);

      // 5. Persalinan
      await generateSheet(workbook, 'Register Persalinan', 'Persalinan', bulanInt, tahunInt);

      // 6. Kunjungan Pasien
      await generateSheet(workbook, 'Register Kunjungan', 'Kunjungan Pasien', bulanInt, tahunInt);
    }

    // Set Response
    const serviceName = (jenis_layanan && jenis_layanan !== 'Semua') ? jenis_layanan.replace(/\s+/g, '_') : 'Lengkap_All_Service';
    const filename = `Laporan_${serviceName}_${String(bulanInt).padStart(2, '0')}_${tahunInt}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generating laporan:', error);
    return serverError(res, 'Gagal membuat laporan', error);
  }
};

/**
 * Ambil statistik ringkasan laporan (JSON)
 * GET /api/laporan/summary?bulan=1&tahun=2025&jenis_layanan=Semua
 */
const getSummary = async (req, res) => {
  try {
    const { bulan, tahun, jenis_layanan } = req.query;

    // Default ke bulan saat ini jika tidak ditentukan
    const now = new Date();
    const currentBulan = bulan ? parseInt(bulan) : now.getMonth() + 1;
    const currentTahun = tahun ? parseInt(tahun) : now.getFullYear();
    const layanan = jenis_layanan || 'Semua';

    const stats = await laporanService.calculateLaporanSummary(layanan, currentBulan, currentTahun);

    // Ambil juga daftar record untuk tabel
    const data = await laporanService.getLaporanData(currentBulan, currentTahun, layanan);

    // Hitung statistik umum untuk kartu dashboard
    // 1. Total Pasien (unik)
    // 2. Total Kunjungan
    // 3. Layanan terpopuler (kalkulasi sederhana dari data)

    const serviceCounts = {};
    data.forEach(item => {
      const svc = item.jenis_layanan;
      serviceCounts[svc] = (serviceCounts[svc] || 0) + 1;
    });

    let topService = '-';
    let maxCount = 0;
    Object.entries(serviceCounts).forEach(([svc, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topService = svc;
      }
    });

    return success(res, 'Summary berhasil diambil', {
      stats: {
        total_pasien: stats.jumlah_pasien,
        total_kunjungan: stats.jumlah_kunjungan,
        layanan_terbanyak: topService
      },
      data: data, // Kembalikan juga daftar mentah untuk tabel
      filter: {
        bulan: currentBulan,
        tahun: currentTahun,
        layanan: layanan
      }
    });

  } catch (error) {
    console.error('Error getting summary:', error);
    return serverError(res, 'Gagal mengambil summary laporan', error);
  }
};

module.exports = {
  getLaporanList,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  generateLaporanBulanan,
  getSummary
};