const dashboardService = require('../services/dashboard.service');

const getRekapLayanan = async (req, res) => {
    const { tahun } = req.query; 

    try {
        const rekap = await dashboardService.getRekapLayanan(tahun);

        res.status(200).json({
            message: 'Data rekap pasien per kategori layanan berhasil diambil',
            total: rekap.total,
            data: rekap.data
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Gagal mengambil data dashboard.', error: error.message });
    }
};

module.exports = {
    getRekapLayanan
};