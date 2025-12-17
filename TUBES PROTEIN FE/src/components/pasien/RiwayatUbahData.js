import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './RiwayatUbahData.css';

function RiwayatUbahData({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [riwayatList, setRiwayatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchRiwayatList();
  }, []);

  const fetchRiwayatList = async () => {
    try {
      setRiwayatList([
        { 
          id: '1', 
          tanggal: 'DD/MM/YY', 
          nama: 'Nama Pasien', 
          nomor_registrasi: 'Nomor Registrasi',
          kategori: 'Layanan ANC',
          keterangan: 'Diubah',
          diubah_oleh: 'Username'
        },
        { 
          id: '2', 
          tanggal: 'DD/MM/YY', 
          nama: 'Nama Pasien', 
          nomor_registrasi: 'Nomor Registrasi',
          kategori: 'Jadwal',
          keterangan: 'Dihapus',
          diubah_oleh: 'Username'
        },
        { 
          id: '3', 
          tanggal: 'DD/MM/YY', 
          nama: 'Nama Pasien', 
          nomor_registrasi: 'Nomor Registrasi',
          kategori: 'Layanan Persalinan',
          keterangan: 'Dihapus',
          diubah_oleh: 'Username'
        },
        { 
          id: '4', 
          tanggal: 'DD/MM/YY', 
          nama: 'Nama Pasien', 
          nomor_registrasi: 'Nomor Registrasi',
          kategori: 'Layanan Imunisasi',
          keterangan: 'Diubah',
          diubah_oleh: 'Username'
        }
      ]);
    } catch (error) {
      console.error('Error fetching riwayat:', error);
    }
  };

  return (
    <div className="riwayat-ubah-data-page">
      {/* Header */}
      <div className="rud-header">
        <div className="rud-header-left">
          {/* SVG Logo */}
          <svg className="rud-header-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#E89AC7"/>
            <path d="M50 35 C45 35, 40 40, 40 45 C40 55, 50 65, 50 70 C50 65, 60 55, 60 45 C60 40, 55 35, 50 35 Z" fill="white"/>
            <circle cx="35" cy="65" r="8" fill="white" opacity="0.8"/>
            <circle cx="65" cy="65" r="8" fill="white" opacity="0.8"/>
          </svg>
          <h1 className="rud-header-title">Riwayat Ubah Data</h1>
        </div>
        <button className="btn-kembali-rud" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="rud-content">
        {/* Sidebar */}
        <Sidebar
          activePage="riwayat-ubah-data"
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
        <main className="rud-main-area">
          {/* Search Section */}
          <div className="rud-search-section">
            <div className="rud-search-bar">
              <input
                type="text"
                className="rud-search-input"
                placeholder="Cari nama pasien, no registrasi, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="rud-filter-btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M3 6h14M6 10h8M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rud-table-container">
            <table className="rud-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pasien</th>
                  <th>Nomor Registrasi</th>
                  <th>Kategori</th>
                  <th>Keterangan</th>
                  <th>Diubah Oleh</th>
                </tr>
              </thead>
              <tbody>
                {riwayatList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tanggal}</td>
                    <td>{item.nama}</td>
                    <td>{item.nomor_registrasi}</td>
                    <td>{item.kategori}</td>
                    <td>
                      <span className={`rud-status ${item.keterangan === 'Diubah' ? 'status-diubah' : 'status-dihapus'}`}>
                        {item.keterangan}
                      </span>
                    </td>
                    <td>
                      <div className="rud-user">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#E5E5E5"/>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999"/>
                        </svg>
                        <span>{item.diubah_oleh}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RiwayatUbahData;
