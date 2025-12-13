const ExcelJS = require('exceljs'); 
const laporanService = require('../services/laporan.service');

// --- Controller: Generate Laporan Bulanan (Excel) ---
const generateLaporanBulanan = async (req, res) => {
    const { format, bulan, tahun } = req.query;
    // req.user.id didapatkan dari middleware verifyToken
    const id_user_bidan = req.user ? req.user.id : 'SIMULASI_USER_ID'; 

    const bulanInt = parseInt(bulan);
    const tahunInt = parseInt(tahun);

    // Validasi dasar
    if (!format || format.toLowerCase() !== 'excel' || isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12 || isNaN(tahunInt) || tahunInt < 2020) {
        return res.status(400).json({ 
            message: 'Input tidak valid. Pastikan format="excel", bulan (1-12), dan tahun terisi dengan benar.' 
        });
    }

    try {
        const reportData = await laporanService.getLaporanData(bulanInt, tahunInt);

        if (reportData.length === 0) {
            return res.status(200).json({
                message: `Tidak ada data pemeriksaan detil untuk periode ${bulanInt}/${tahunInt}.`,
                data: []
            });
        }

        // Catat ke log laporan (FR-05)
        await laporanService.recordLaporanLog(id_user_bidan, bulanInt, tahunInt, format.toLowerCase());
        
        // --- Implementasi ExcelJS ---
        const filename = `Laporan_Detil_Bulan_${bulanInt}_${tahunInt}.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Laporan Detil ${bulanInt}-${tahunInt}`);

        worksheet.columns = [
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Nama Pasien', key: 'nama_pasien', width: 25 },
            { header: 'Tanggal Periksa', key: 'tanggal', width: 15 },
            { header: 'Jenis Layanan', key: 'jenis_layanan', width: 15 },
            { header: 'SOAP (S: Subjektif)', key: 'subjektif', width: 40 },
            { header: 'SOAP (O: Objektif)', key: 'objektif', width: 40 },
            { header: 'SOAP (A: Analisa)', key: 'analisa', width: 40 },
            { header: 'SOAP (P: Tatalaksana)', key: 'tatalaksana', width: 40 },
        ];

        reportData.forEach((data, index) => {
            worksheet.addRow({
                no: index + 1,
                nama_pasien: data.nama_pasien,
                tanggal: new Date(data.tanggal).toLocaleDateString('id-ID'),
                jenis_layanan: data.jenis_layanan,
                subjektif: data.subjektif,
                objektif: data.objektif,
                analisa: data.analisa,
                tatalaksana: data.tatalaksana,
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Gagal membuat laporan.', error: error.message });
    }
};

module.exports = {
    generateLaporanBulanan
};