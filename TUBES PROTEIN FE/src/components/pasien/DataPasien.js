import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './DataPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasien.service';

function DataPasien({ 
  onBack, 
  onToRiwayatDataMasuk, 
  onToRiwayatMasukAkun, 
  onToProfil, 
  onToEditPasien,
  onToTambahPasien,
  onToTambahPengunjung,
  onToBuatLaporan,
  onToPersalinan,
  onToANC,
  onToKB,
  onToImunisasi
}) {
  const [pasienList, setPasienList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('semua');

  useEffect(() => {
    fetchPasienList();
  }, []);

  const fetchPasienList = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await pasienService.getAllPasien(search);
      if (response.success) {
        setPasienList(response.data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchPasienList(value);
  };

  const handleEdit = (pasienId) => {
    if (onToEditPasien) {
      onToEditPasien(pasienId);
    }
  };

  const handleDelete = async (pasienId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
      try {
        const response = await pasienService.deletePasien(pasienId);
        if (response.success) {
          alert('Data pasien berhasil dihapus');
          fetchPasienList(searchQuery);
        }
      } catch (error) {
        console.error('Error deleting pasien:', error);
        alert('Gagal menghapus data pasien');
      }
    }
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
    // Implement filter logic here based on layanan
  };

  return (
    <div className="data-pasien-page">
      {/* Header */}
      <div className="data-pasien-header">
        <div className="dp-header-left">
          <div className="dp-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="dp-header-logo-img" />
          </div>
          <h1 className="dp-header-title">Data Pasien (Keseluruhan)</h1>
        </div>
        <button className="btn-kembali-dp" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="data-pasien-content">
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
        <main className="dp-main-area">
          <div className="dp-card">
            <div className="dp-card-header">
              <h2 className="dp-card-title">Data Pasien</h2>
            </div>
            
            <div className="dp-card-body">
              {/* Search Box */}
              <div className="dp-search-container">
                <input
                  type="text"
                  className="dp-search-input"
                  placeholder="Cari Data Pasien"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="dp-filter-wrapper">
                  <button 
                    className="dp-filter-btn"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M2 4h16M5 9h10M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {showFilterDropdown && (
                    <div className="dp-filter-dropdown">
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'semua' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('semua')}
                      >
                        Semua Layanan
                      </div>
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'kb' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('kb')}
                      >
                        Layanan KB
                      </div>
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'persalinan' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('persalinan')}
                      >
                        Layanan Persalinan
                      </div>
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'anc' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('anc')}
                      >
                        Layanan ANC
                      </div>
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'imunisasi' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('imunisasi')}
                      >
                        Layanan Imunisasi
                      </div>
                      <div 
                        className={`dp-filter-option ${selectedFilter === 'kunjungan' ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('kunjungan')}
                      >
                        Kunjungan Pasien
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient List */}
              <div className="dp-patient-list">
                {isLoading ? (
                  <div className="dp-loading">Memuat data...</div>
                ) : pasienList.length > 0 ? (
                  pasienList.map((pasien) => (
                    <div key={pasien.id_pasien} className="dp-patient-item">
                      <span className="dp-patient-name">{pasien.nama}</span>
                      <div className="dp-patient-actions">
                        <button 
                          className="dp-btn-edit"
                          onClick={() => handleEdit(pasien.id_pasien)}
                          title="Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                            <path d="M12.5 2.5L15.5 5.5M1 17L4.5 16.5L16 5C16.5 4.5 16.5 3.5 16 3L15 2C14.5 1.5 13.5 1.5 13 2L1.5 13.5L1 17Z" stroke="white" strokeWidth="1.5" fill="none"/>
                          </svg>
                        </button>
                        <button 
                          className="dp-btn-delete"
                          onClick={() => handleDelete(pasien.id_pasien)}
                          title="Hapus"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                            <path d="M3 5h12M7 3h4M7 8v6M11 8v6M5 5l1 11h6l1-11" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dp-empty">Tidak ada data pasien</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DataPasien;
