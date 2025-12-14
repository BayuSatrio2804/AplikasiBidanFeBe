/**
 * Laporan (Report) Controller
 * Handles HTTP requests for report generation
 */

const ExcelJS = require('exceljs');
const laporanService = require('../services/laporan.service');
const { success, badRequest, serverError } = require('../utils/response');

/**
 * Generate monthly report (Excel format)
 * GET /api/laporan/bulanan
 */
const generateLaporanBulanan = async (req, res) => {
  const { format, bulan, tahun } = req.query;
  const userId = req.user?.id || 'SYSTEM';

  const bulanInt = parseInt(bulan, 10);
  const tahunInt = parseInt(tahun, 10);

  // Validate parameters
  if (!format || format.toLowerCase() !== 'excel') {
    return badRequest(res, 'Format harus "excel"');
  }

  if (isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12) {
    return badRequest(res, 'Bulan harus angka 1-12');
  }

  if (isNaN(tahunInt) || tahunInt < 2020) {
    return badRequest(res, 'Tahun harus valid (minimal 2020)');
  }

  try {
    const reportData = await laporanService.getLaporanData(bulanInt, tahunInt);

    if (reportData.length === 0) {
      return success(res, `Tidak ada data untuk periode ${bulanInt}/${tahunInt}`, []);
    }

    // Log report generation
    await laporanService.recordLaporanLog(userId, bulanInt, tahunInt, format.toLowerCase());

    // Generate Excel file
    const filename = `Laporan_Detil_${bulanInt}_${tahunInt}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Laporan ${bulanInt}-${tahunInt}`);

    // Define columns
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Nama Pasien', key: 'nama_pasien', width: 25 },
      { header: 'Tanggal Periksa', key: 'tanggal', width: 15 },
      { header: 'Jenis Layanan', key: 'jenis_layanan', width: 15 },
      { header: 'Subjektif', key: 'subjektif', width: 40 },
      { header: 'Objektif', key: 'objektif', width: 40 },
      { header: 'Analisa', key: 'analisa', width: 40 },
      { header: 'Tatalaksana', key: 'tatalaksana', width: 40 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };

    // Add data rows
    reportData.forEach((data, index) => {
      worksheet.addRow({
        no: index + 1,
        nama_pasien: data.nama_pasien,
        tanggal: new Date(data.tanggal).toLocaleDateString('id-ID'),
        jenis_layanan: data.jenis_layanan,
        subjektif: data.subjektif,
        objektif: data.objektif,
        analisa: data.analisa,
        tatalaksana: data.tatalaksana
      });
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return serverError(res, 'Gagal membuat laporan', error);
  }
};

module.exports = {
  generateLaporanBulanan
};