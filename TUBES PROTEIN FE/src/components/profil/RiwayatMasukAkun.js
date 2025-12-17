import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './RiwayatMasukAkun.css';
import auditService from '../../services/audit.service';

function RiwayatMasukAkun({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [riwayatLogin, setRiwayatLogin] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
          username: item.username || '-',
          aktivitas: item.status === 'BERHASIL' ? 'Login Berhasil' : 'Login Gagal'
        }));
        setRiwayatLogin(formattedData);
      } else {
        setRiwayatLogin([]);
      }
    } catch (error) {
      console.error('Error fetching riwayat login:', error);
      setRiwayatLogin([]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="riwayat-masuk-akun-page">
      {/* Header */}
      <div className="rma-header">
        <div className="rma-header-left">
          {/* SVG Logo */}
          <svg className="rma-header-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#E89AC7"/>
            <path d="M50 35 C45 35, 40 40, 40 45 C40 55, 50 65, 50 70 C50 65, 60 55, 60 45 C60 40, 55 35, 50 35 Z" fill="white"/>
            <circle cx="35" cy="65" r="8" fill="white" opacity="0.8"/>
            <circle cx="65" cy="65" r="8" fill="white" opacity="0.8"/>
          </svg>
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
            <div className="rma-search-bar">
              <input
                type="text"
                className="rma-search-input"
                placeholder="Cari username......."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="rma-filter-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M3 6h14M6 10h8M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
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
