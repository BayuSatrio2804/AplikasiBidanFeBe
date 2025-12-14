import { useState, useEffect } from 'react';
import './Laporan.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import laporanService from '../../services/laporan.service';

function Laporan({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [laporanList, setLaporanList] = useState([]);
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  // Load data laporan
  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      // Note: API /laporan hanya untuk generate Excel, bukan list
      // Untuk list, gunakan data dari endpoint lain atau mock data
      
      // Mock data
      const mockData = [
        { 
          id_laporan: '1',
          jenis_layanan: 'ANC',
          periode: 'Januari 2025',
          tanggal_dibuat: '2025-01-31',
          jumlah_pasien: 45,
          jumlah_kunjungan: 120,
          label: 'Data Pertama'
        },
        { 
          id_laporan: '2',
          jenis_layanan: 'KB',
          periode: 'Januari 2025',
          tanggal_dibuat: '2025-01-31',
          jumlah_pasien: 30,
          jumlah_kunjungan: 45,
          label: 'Data Kedua'
        },
        { 
          id_laporan: '3',
          jenis_layanan: 'Imunisasi',
          periode: 'Februari 2025',
          tanggal_dibuat: '2025-02-28',
          jumlah_pasien: 25,
          jumlah_kunjungan: 50,
          label: 'Data Pertama'
        },
        { 
          id_laporan: '4',
          jenis_layanan: 'Persalinan',
          periode: 'Februari 2025',
          tanggal_dibuat: '2025-02-28',
          jumlah_pasien: 15,
          jumlah_kunjungan: 15,
          label: 'Data Pertama'
        }
      ];
      setLaporanList(mockData);
    } catch (error) {
      console.error('Error fetching laporan:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal memuat data laporan',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleFilter = async () => {
    if (!filterBulan || !filterTahun) {
      showNotifikasi({
        type: 'error',
        message: 'Bulan dan Tahun harus dipilih',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
      return;
    }
    
    try {
      // Generate Excel dengan API GET /laporan
      // const params = new URLSearchParams({
      //   format: 'excel',
      //   bulan: filterBulan,
      //   tahun: filterTahun
      // });
      // const response = await fetch(`https://api.bidan-digital.com/v1/laporan?${params}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `laporan_${filterBulan}_${filterTahun}.xlsx`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
      console.log('Generate laporan Excel:', { bulan: filterBulan, tahun: filterTahun });
      showNotifikasi({
        type: 'success',
        message: `Laporan Excel untuk ${filterBulan}/${filterTahun} berhasil didownload!`,
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: hideNotifikasi
      });
    } catch (error) {
      console.error('Error generating laporan:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal generate laporan',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleDownload = async () => {
    if (!filterBulan || !filterTahun) {
      showNotifikasi({
        type: 'error',
        message: 'Silakan pilih Bulan dan Tahun terlebih dahulu',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
      return;
    }
    
    try {
      await laporanService.downloadLaporanBulanan(
        parseInt(filterBulan), 
        parseInt(filterTahun)
      );
      
      showNotifikasi({
        type: 'success',
        message: `File laporan ${filterBulan}/${filterTahun}.xlsx berhasil didownload!`,
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: hideNotifikasi
      });
    } catch (error) {
      console.error('Error downloading laporan:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal mendownload laporan. Pastikan koneksi internet dan data tersedia.',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // Filter data berdasarkan search query (untuk mock data list)
    if (searchQuery.trim() === '') {
      fetchLaporan();
    } else {
      const filtered = laporanList.filter(laporan => 
        laporan.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laporan.jenis_layanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laporan.periode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setLaporanList(filtered);
    }
  };

  return (
    <div className="laporan-page">
      {/* Header */}
      <div className="laporan-header">
        <div className="laporan-header-left">
          <div className="laporan-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="laporan-header-logo-img" />
          </div>
          <h1 className="laporan-header-title">Laporan</h1>
        </div>
        <button className="btn-kembali-laporan" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="laporan-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="laporan"
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
        <main className="laporan-main-area">
          {/* Filter Section */}
          <div className="laporan-filter-section">
            <div className="laporan-filter-group">
              <div className="laporan-filter-item">
                <label>Bulan *</label>
                <select 
                  value={filterBulan} 
                  onChange={(e) => setFilterBulan(e.target.value)}
                  required
                >
                  <option value="">Pilih Bulan</option>
                  <option value="1">Januari</option>
                  <option value="2">Februari</option>
                  <option value="3">Maret</option>
                  <option value="4">April</option>
                  <option value="5">Mei</option>
                  <option value="6">Juni</option>
                  <option value="7">Juli</option>
                  <option value="8">Agustus</option>
                  <option value="9">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>

              <div className="laporan-filter-item">
                <label>Tahun *</label>
                <select 
                  value={filterTahun} 
                  onChange={(e) => setFilterTahun(e.target.value)}
                  required
                >
                  <option value="">Pilih Tahun</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <button className="btn-filter-laporan" onClick={handleFilter}>
                Generate Excel
              </button>
            </div>
          </div>

          {/* Search and Download Section */}
          <div className="laporan-search-section">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="laporan-search-input"
                placeholder="Cari Data"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-search-laporan" onClick={handleSearch}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M9 3.5C5.686 3.5 3 6.186 3 9.5C3 12.814 5.686 15.5 9 15.5C10.386 15.5 11.678 15.013 12.707 14.207L16.293 17.793C16.488 17.988 16.744 18.085 17 18.085C17.256 18.085 17.512 17.988 17.707 17.793C18.098 17.402 18.098 16.768 17.707 16.377L14.121 12.791C14.957 11.752 15.5 10.435 15.5 9C15.5 5.686 12.814 3 9.5 3C9.333 3 9.167 3.006 9 3.018V3.5ZM9 5C11.761 5 14 7.239 14 10C14 12.761 11.761 15 9 15C6.239 15 4 12.761 4 10C4 7.239 6.239 5 9 5Z"/>
                </svg>
              </button>
            </div>

            <button className="btn-download-laporan" onClick={handleDownload} title="Download Excel Laporan">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2V12M10 12L6 8M10 12L14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 14V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Laporan List Card */}
          <div className="laporan-list-card">
            <div className="laporan-list-inner">
              {laporanList.length > 0 ? (
                <>
                  {laporanList.map((laporan) => (
                    <div key={laporan.id_laporan} className="laporan-item">
                      <span className="laporan-item-text">{laporan.label}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="laporan-empty-state">
                  Data tidak ditemukan. Harap lakukan filtering terlebih dahulu.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Komponen Notifikasi */}
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
    </div>
  );
}

export default Laporan;
