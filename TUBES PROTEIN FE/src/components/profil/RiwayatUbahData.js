import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './RiwayatUbahData.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import auditService from '../../services/audit.service';

function RiwayatUbahData({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
    const [riwayatData, setRiwayatData] = useState([]);
    const [allRiwayat, setAllRiwayat] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRiwayatData();
    }, []);

    const formatDate = (date) => {
        if (!date) return '-';
        // Mockup format: DD/MM/YY
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const fetchRiwayatData = async () => {
        try {
            setLoading(true);
            // Use detailed logs to get patient/category info
            const response = await auditService.getDetailedDataLogs();

            const logs = response && response.data ? response.data : response;

            if (logs && Array.isArray(logs)) {
                const formattedData = logs.map((item, idx) => ({
                    id: item.id_audit || idx,
                    tanggal: formatDate(item.tanggal_akses || item.createdAt),
                    tanggal_raw: item.tanggal_akses || item.createdAt,
                    nama_pasien: item.nama_pasien || '-', // Needed for mockup
                    no_reg: item.no_reg || '-',           // Needed for mockup
                    kategori: item.kategori || 'Umum',    // Needed for mockup
                    keterangan: item.aktivitas || '-',    // "Diubah", "Dihapus"
                    username: item.username || '-',
                    action: item.aktivitas || '-'
                }));
                setAllRiwayat(formattedData);
                setRiwayatData(formattedData);
            } else {
                setAllRiwayat([]);
                setRiwayatData([]);
            }
        } catch (error) {
            console.error('Error fetching riwayat data:', error);
            setAllRiwayat([]);
            setRiwayatData([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let filtered = allRiwayat;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.nama_pasien.toLowerCase().includes(q) ||
                item.no_reg.toLowerCase().includes(q) ||
                item.username.toLowerCase().includes(q)
            );
        }

        if (filterAction) {
            filtered = filtered.filter(item => item.action === filterAction);
        }

        if (filterKategori) {
            filtered = filtered.filter(item => item.kategori === filterKategori);
        }

        if (filterStartDate) {
            const startDate = new Date(filterStartDate);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.tanggal_raw);
                return itemDate >= startDate;
            });
        }

        if (filterEndDate) {
            const endDate = new Date(filterEndDate);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.tanggal_raw);
                return itemDate <= endDate;
            });
        }

        setRiwayatData(filtered);
    };

    useEffect(() => {
        if (searchQuery) {
            applyFilter();
        } else {
            applyFilter();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    return (
        <div className="riwayat-ubah-data-page">
            {/* Header */}
            <div className="rud-header">
                <div className="rud-header-left">
                    <div className="rud-header-icon">
                        <img src={pinkLogo} alt="Pink Logo" className="rud-header-logo-img" />
                    </div>
                    <h1 className="rud-header-title">Riwayat Data Masuk</h1>
                </div>
                <button className="btn-kembali-rud" onClick={onBack}>Kembali</button>
            </div>

            {/* Main Content */}
            <div className="rud-content">
                <Sidebar
                    activePage="riwayat-data-masuk"
                    onRiwayatDataMasuk={onToRiwayatDataMasuk}
                    onRiwayatMasukAkun={onToRiwayatMasukAkun}
                    onProfilSaya={onToProfil}
                    onTambahPasien={onToTambahPasien}
                    onTambahPengunjung={onToTambahPengunjung}
                    onBuatLaporan={onToBuatLaporan}
                    onToPersalinan={onToPersalinan}
                    onToANC={onToANC}
                    onToKB={onToKB}
                    onToImunisasi={onToImunisasi}
                />

                <main className="rud-main-area">

                    {/* Top Filter Card */}
                    <div className="rud-filter-card">

                        {/* Tipe Aksi */}
                        <div className="rud-filter-group">
                            <label className="rud-filter-label">Status</label>
                            <div className="rud-input-wrapper">
                                <select
                                    value={filterAction}
                                    onChange={(e) => setFilterAction(e.target.value)}
                                    className="rud-filter-select"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="UBAH">Diubah</option>
                                    <option value="HAPUS">Dihapus</option>
                                    <option value="TAMBAH">Ditambah</option>
                                    <option value="DIPULIHKAN">Dipulihkan</option>
                                </select>
                            </div>
                        </div>

                        {/* Kategori */}
                        <div className="rud-filter-group">
                            <label className="rud-filter-label">Kategori</label>
                            <div className="rud-input-wrapper">
                                <select
                                    value={filterKategori}
                                    onChange={(e) => setFilterKategori(e.target.value)}
                                    className="rud-filter-select"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="Layanan ANC">Layanan ANC</option>
                                    <option value="Layanan Persalinan">Layanan Persalinan</option>
                                    <option value="Layanan Imunisasi">Layanan Imunisasi</option>
                                    <option value="Jadwal">Jadwal</option>
                                </select>
                            </div>
                        </div>

                        {/* Mulai */}
                        <div className="rud-filter-group">
                            <label className="rud-filter-label">Dari Tanggal</label>
                            <div className="rud-input-wrapper">
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="rud-filter-date"
                                />
                            </div>
                        </div>

                        {/* Selesai */}
                        <div className="rud-filter-group">
                            <label className="rud-filter-label">Sampai Tanggal</label>
                            <div className="rud-input-wrapper">
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="rud-filter-date"
                                />
                            </div>
                        </div>

                        <button
                            className="rud-filter-action-btn"
                            onClick={() => {
                                setSearchQuery('');
                                setFilterAction('');
                                setFilterKategori('');
                                setFilterStartDate('');
                                setFilterEndDate('');
                            }}
                        >
                            Reset Filter
                        </button>
                    </div>

                    {/* Search Bar (Moved out of Data Card) */}
                    <div className="rud-search-wrapper" style={{ marginBottom: '0px' }}>
                        <input
                            type="text"
                            className="rud-search-input-new"
                            placeholder="Cari nama pasien, no registrasi, username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Bottom Data Card */}
                    <div className="rud-data-card">

                        <div className="rud-table-wrapper">
                            <table className="rud-table-new">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Pasien</th>
                                        <th>Nomor Registrasi</th>
                                        <th>Kategori</th>
                                        <th>Keterangan</th>
                                        <th>Username</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                                    ) : riwayatData.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data</td></tr>
                                    ) : (
                                        riwayatData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.tanggal}</td>
                                                <td>{item.nama_pasien}</td>
                                                <td>{item.no_reg}</td>
                                                <td>{item.kategori}</td>
                                                <td>{item.keterangan}</td>
                                                <td>
                                                    <div className="rud-user-cell">
                                                        <div className="rud-avatar-circle">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D49CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="12" cy="7" r="4"></circle>
                                                            </svg>
                                                        </div>
                                                        <span>{item.username}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default RiwayatUbahData;
