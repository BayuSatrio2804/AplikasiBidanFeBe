import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './DataPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasien.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

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
  onToImunisasi,
  onToDataSampah
}) {
  const [pasienList, setPasienList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('semua');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

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

  const handleDelete = (pasienId) => {
    showNotifikasi({
      type: 'confirm-delete',
      confirmText: 'Ya, hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        hideNotifikasi();
        try {
          const response = await pasienService.deletePasien(pasienId);
          if (response.success) {
            fetchPasienList(searchQuery);
            showNotifikasi({
              type: 'delete-success',
              autoClose: false,
              onConfirm: hideNotifikasi,
              onCancel: hideNotifikasi,
            });
          } else {
            showNotifikasi({
              type: 'error',
              message: 'Gagal menghapus data pasien',
              onConfirm: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('Error deleting pasien:', error);
          showNotifikasi({
            type: 'error',
            message: 'Terjadi kesalahan saat menghapus data',
            onConfirm: hideNotifikasi
          });
        }
      },
      onCancel: hideNotifikasi
    });
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
        <div className="dp-header-right" style={{ display: 'flex', gap: '10px' }}>

          <button className="btn-kembali-dp" onClick={onBack}>Kembali</button>
        </div>
      </div>

      {/* Konten Utama */}
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

        {/* Area Utama */}
        <main className="dp-main-area">
          <div className="dp-card">
            <div className="dp-card-header">
              <div className="dp-header-top">
                <h2 className="dp-card-title">Data Pasien</h2>
              </div>

              <div className="dp-header-bottom">
                <div className="dp-search-wrapper">
                  <input
                    type="text"
                    className="dp-search-input-header"
                    placeholder="Cari Data Pasien"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <div className="dp-filter-relative">
                    <button
                      className="dp-filter-btn-header"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                        <path d="M2 4h16M5 9h10M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
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

                <div className="dp-header-actions">
                  <button className="dp-btn-action" onClick={onToTambahPasien}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dp-btn-icon">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Tambah Data
                  </button>
                  <button className="dp-btn-action" onClick={onToDataSampah}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dp-btn-icon">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                    Pulihkan Data
                  </button>
                </div>
              </div>
            </div>

            <div className="dp-card-body">
              {/* Daftar Pasien */}
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
                            <path d="M12.5 2.5L15.5 5.5M1 17L4.5 16.5L16 5C16.5 4.5 16.5 3.5 16 3L15 2C14.5 1.5 13.5 1.5 13 2L1.5 13.5L1 17Z" stroke="white" strokeWidth="1.5" fill="none" />
                          </svg>
                        </button>
                        <button
                          className="dp-btn-delete"
                          onClick={() => handleDelete(pasien.id_pasien)}
                          title="Hapus"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                            <path d="M3 5h12M7 3h4M7 8v6M11 8v6M5 5l1 11h6l1-11" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
          </div >
        </main >
      </div >
      <Notifikasi
        show={notifikasi.show}
        type={notifikasi.type}
        message={notifikasi.message}
        detail={notifikasi.detail}
        onConfirm={notifikasi.onConfirm}
        onCancel={notifikasi.onCancel}
        confirmText={notifikasi.confirmText}
        cancelText={notifikasi.cancelText}
        autoClose={notifikasi.autoClose}
        autoCloseDuration={notifikasi.autoCloseDuration}
      />
    </div >
  );
}

export default DataPasien;
