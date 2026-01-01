import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './RiwayatMasukAkun.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import auditService from '../../services/audit.service';

function RiwayatMasukAkun({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [riwayatLogin, setRiwayatLogin] = useState([]);
  const [allRiwayat, setAllRiwayat] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayatLogin();
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const fetchRiwayatLogin = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAccessLogs({ type: 'login' });

      // Extract data from response wrapper
      const logs = response && response.data ? response.data : response;

      if (logs && Array.isArray(logs)) {
        const formattedData = logs.map((item, idx) => ({
          id: item.id_akses || idx,
          tanggal: formatDate(item.tanggal_akses),
          tanggal_raw: item.tanggal_akses, // Untuk filtering
          username: item.username || '-',
          status: item.status || 'GAGAL', // BERHASIL atau GAGAL
          aktivitas: item.status === 'BERHASIL' ? 'Login Berhasil' : 'Login Gagal'
        }));
        setAllRiwayat(formattedData);
        setRiwayatLogin(formattedData);
      } else {
        setAllRiwayat([]);
        setRiwayatLogin([]);
      }
    } catch (error) {
      console.error('Error fetching riwayat login:', error);
      setAllRiwayat([]);
      setRiwayatLogin([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan search dan filter yang dipilih
  const applyFilter = () => {
    let filtered = allRiwayat;

    // Filter berdasarkan username
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Filter berdasarkan tanggal mulai
    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal_raw);
        return itemDate >= startDate;
      });
    }

    // Filter berdasarkan tanggal akhir
    if (filterEndDate) {
      const endDate = new Date(filterEndDate);
      endDate.setHours(23, 59, 59); // Termasuk seluruh hari
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal_raw);
        return itemDate <= endDate;
      });
    }

    setRiwayatLogin(filtered);
  };

  // Gunakan applyFilter ketika ada perubahan di filter atau search
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterStatus, filterStartDate, filterEndDate, allRiwayat]);



  return (
    <div className="riwayat-masuk-akun-page">
      {/* Header */}
      <div className="rma-header">
        <div className="rma-header-left">
          <div className="rma-header-icon">
            <img src={pinkLogo} alt="Pink Logo" className="rma-header-logo-img" />
          </div>
          <h1 className="rma-header-title">Riwayat Masuk Akun</h1>
        </div>
        <button className="btn-kembali-rma" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="rma-content">
        {/* Sidebar */}
        <Sidebar
          activePage="riwayat-masuk-akun"
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

        {/* Main Area */}
        <main className="rma-main-area">
          {/* Search Section */}
          <div className="rma-search-section">
            {/* Filter Panel (Now at Top) */}
            <div className="rma-filter-panel">
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="BERHASIL">Login Berhasil</option>
                  <option value="GAGAL">Login Gagal</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Dari Tanggal</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Sampai Tanggal</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>

              <button
                className="btn-reset-filter"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
              >
                Reset Filter
              </button>
            </div>

            {/* Search Bar (Now at Bottom) */}
            <div className="rma-search-bar">
              <input
                type="text"
                className="rma-search-input"
                placeholder="Cari username......."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="rma-table-container">
            <table className="rma-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Username</th>
                  <th>Aktivitas</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : riwayatLogin.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Belum ada riwayat login</td></tr>
                ) : (
                  riwayatLogin.map((item) => (
                    <tr key={item.id}>
                      <td>{item.tanggal}</td>
                      <td>{item.username}</td>
                      <td>
                        <span className={`rma-status ${item.aktivitas === 'Login Berhasil' ? 'status-berhasil' : 'status-gagal'}`}>
                          {item.aktivitas}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RiwayatMasukAkun;
