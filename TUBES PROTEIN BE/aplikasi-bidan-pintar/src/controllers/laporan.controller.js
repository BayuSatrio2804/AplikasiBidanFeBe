/**
 * Laporan (Report) Controller
 * Handles HTTP requests for report generation
 */

const ExcelJS = require('exceljs');
const laporanService = require('../services/laporan.service');
const { success, badRequest, serverError, notFound } = require('../utils/response');

/**
 * Get list of laporan summaries
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
 * Get laporan by ID
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
 * Create new laporan summary
 * POST /api/laporan
 */
const createLaporan = async (req, res) => {
  try {
    const { jenis_layanan, periode, tanggal_dibuat, jumlah_pasien, jumlah_kunjungan, label } = req.body;
    
    // Validation
    if (!jenis_layanan || !periode) {
      return badRequest(res, 'Jenis layanan dan periode harus diisi');
    }
    
    const data = {
      jenis_layanan,
      periode,
      tanggal_dibuat,
      jumlah_pasien,
      jumlah_kunjungan,
      label
    };
    
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
    
    // Check if laporan exists
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
 * Delete laporan
 * DELETE /api/laporan/:id
 */
const deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if laporan exists
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
 * Generate monthly report (Excel format)
 * GET /api/laporan?format=excel&bulan=1&tahun=2025
 */
const generateLaporanBulanan = async (req, res) => {
  const { format, bulan, tahun } = req.query;
  const userId = req.user?.id || 'SYSTEM';

  // Validate parameters
  if (!format || format.toLowerCase() !== 'excel') {
    return badRequest(res, 'Format harus "excel"');
  }

  if (!bulan || !tahun) {
    return badRequest(res, 'Bulan dan tahun harus diisi');
  }

  const bulanInt = parseInt(bulan, 10);
  const tahunInt = parseInt(tahun, 10);

  if (isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12) {
    return badRequest(res, 'Bulan harus angka 1-12');
  }

  if (isNaN(tahunInt) || tahunInt < 2020) {
    return badRequest(res, 'Tahun harus valid (minimal 2020)');
  }

  try {
    const reportData = await laporanService.getLaporanData(bulanInt, tahunInt);

    if (reportData.length === 0) {
      // Jika tidak ada data, tetap generate file Excel kosong dengan header
      const filename = `Laporan_Detil_${String(bulanInt).padStart(2, '0')}_${tahunInt}.xlsx`;
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
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add no data message
      worksheet.addRow({
        no: '',
        nama_pasien: `Tidak ada data untuk periode ${bulanInt}/${tahunInt}`,
        tanggal: '',
        jenis_layanan: '',
        subjektif: '',
        objektif: '',
        analisa: '',
        tatalaksana: ''
      });

      // Set response headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    // Generate Excel file
    const filename = `Laporan_Detil_${String(bulanInt).padStart(2, '0')}_${tahunInt}.xlsx`;
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
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    reportData.forEach((data, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        nama_pasien: data.nama_pasien,
        tanggal: new Date(data.tanggal).toLocaleDateString('id-ID'),
        jenis_layanan: data.jenis_layanan,
        subjektif: data.subjektif || '-',
        objektif: data.objektif || '-',
        analisa: data.analisa || '-',
        tatalaksana: data.tatalaksana || '-'
      });
      
      // Alternate row colors
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9F9F9' }
        };
      }
    });

    // Auto-fit columns
    worksheet.eachRow((row) => {
      row.alignment = { vertical: 'middle', wrapText: true };
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating laporan:', error);
    return serverError(res, 'Gagal membuat laporan', error);
  }
};

module.exports = {
  getLaporanList,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  generateLaporanBulanan
};