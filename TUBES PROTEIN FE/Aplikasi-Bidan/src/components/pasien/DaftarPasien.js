import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './DaftarPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasienService';

function DaftarPasien({ 
  onBack, 
  onToDetailPasien,
  onToRiwayatDataMasuk, 
  onToRiwayatMasukAkun, 
  onToProfil, 
  onToTambahPasien, 
  onToTambahPengunjung, 
  onToBuatLaporan, 
  onToPersalinan, 
  onToANC, 
  onToKB, 
  onToImunisasi 
}) {
  const [pasienList, setPasienList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllPasien();
  }, []);

  const fetchAllPasien = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError('');
      
      const result = await pasienService.getAllPasien(searchQuery);
      
      if (result.success) {
        setPasienList(result.data);
      } else {
        setError(result.message || 'Gagal mengambil data pasien');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(search);
    fetchAllPasien(search);
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pasien "${nama}"?`)) {
      try {
        const result = await pasienService.deletePasien(id);
        
        if (result.success) {
          alert('Data pasien berhasil dihapus');
          // Refresh data
          fetchAllPasien(searchTerm);
        } else {
          alert(result.message || 'Gagal menghapus data pasien');
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus data');
        console.error('Error deleting pasien:', error);
      }
    }
  };

  const handleViewDetail = (pasien) => {
    // Simpan data pasien ke localStorage untuk diakses di halaman detail
    localStorage.setItem('selectedPasien', JSON.stringify(pasien));
    onToDetailPasien();
  };

  return (
    <div className="daftar-pasien-page">
      {/* Header */}
      <div className="daftar-pasien-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="header-logo-img" />
          </div>
          <h1 className="header-title">Daftar Pasien</h1>
        </div>
        <button className="btn-kembali" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="daftar-pasien-content">
        {/* Sidebar */}
        <Sidebar
          activePage="data-pasien"
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
        <main className="main-area">
          {/* Search & Add Button */}
          <div className="action-bar">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Cari nama atau NIK pasien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn-search">
                🔍 Cari
              </button>
            </form>
            <button className="btn-tambah" onClick={onToTambahPasien}>
              ➕ Tambah Pasien
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="loading-state">
              <p>Memuat data pasien...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p style={{ color: '#E91E8C' }}>{error}</p>
              <button onClick={() => fetchAllPasien(searchTerm)} className="btn-retry">
                Coba Lagi
              </button>
            </div>
          ) : pasienList.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada data pasien</p>
              <button className="btn-tambah-empty" onClick={onToTambahPasien}>
                Tambah Pasien Pertama
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="pasien-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pasien</th>
                    <th>NIK</th>
                    <th>Umur</th>
                    <th>No. HP</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pasienList.map((pasien, index) => (
                    <tr key={pasien.id_pasien}>
                      <td>{index + 1}</td>
                      <td>{pasien.nama}</td>
                      <td>{pasien.nik}</td>
                      <td>{pasien.umur} th</td>
                      <td>{pasien.no_hp}</td>
                      <td>{pasien.alamat}</td>
                      <td className="action-buttons">
                        <button 
                          className="btn-detail"
                          onClick={() => handleViewDetail(pasien)}
                          title="Lihat Detail"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(pasien.id_pasien, pasien.nama)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="table-info">
                Total: <strong>{pasienList.length}</strong> pasien
                {searchTerm && ` (hasil pencarian: "${searchTerm}")`}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DaftarPasien;
