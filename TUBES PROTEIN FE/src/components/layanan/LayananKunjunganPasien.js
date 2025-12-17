import { useState, useEffect } from 'react';
import './LayananKunjunganPasien.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import filterIcon from '../../assets/images/icons/icons8-filter-100.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function LayananKunjunganPasien({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  
  const [formData, setFormData] = useState({
    tanggal: '',
    no_reg: '',
    jenis_kunjungan: '',
    nama_pasien: '',
    nik_pasien: '',
    umur_pasien: '',
    bb_pasien: '',
    td_pasien: '',
    nama_wali: '',
    nik_wali: '',
    umur_wali: '',
    keluhan: '',
    diagnosa: '',
    terapi_obat: '',
    keterangan: ''
  });

  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await layananService.getAllKunjunganPasien(search);
      if (response.success && response.data) {
        const mappedData = response.data.map(item => ({
          id: item.id_pemeriksaan,
          nama_pasien: item.nama_pasien || 'Pasien',
          tanggal: item.tanggal_pemeriksaan,
          jenis_layanan: item.jenis_layanan
        }));
        setRiwayatPelayanan(mappedData);
      } else {
        setRiwayatPelayanan([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRiwayatPelayanan([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchRiwayatPelayanan(query);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let response;
      if (editingId) {
        response = await layananService.updateKunjunganPasien(editingId, formData);
      } else {
        response = await layananService.createKunjunganPasien(formData);
      }
      if (response.success) {
        showNotifikasi({
          type: 'success',
          message: editingId ? 'Data berhasil diupdate!' : 'Data kunjungan pasien berhasil disimpan!',
          autoClose: true,
          autoCloseDuration: 2000,
          onConfirm: hideNotifikasi
        });
        resetForm();
        fetchRiwayatPelayanan();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Terjadi kesalahan saat menyimpan data');
      showNotifikasi({
        type: 'error',
        message: error.message || 'Terjadi kesalahan saat menyimpan data',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      tanggal: '',
      no_reg: '',
      jenis_kunjungan: '',
      nama_pasien: '',
      nik_pasien: '',
      umur_pasien: '',
      bb_pasien: '',
      td_pasien: '',
      nama_wali: '',
      nik_wali: '',
      umur_wali: '',
      keluhan: '',
      diagnosa: '',
      terapi_obat: '',
      keterangan: ''
    });
    setShowForm(false);
    setError('');
  };

  const handleEdit = async (item) => {
    try {
      const response = await layananService.getKunjunganPasienById(item.id);
      if (response.success) {
        const data = response.data;
        setFormData({
          tanggal: data.tanggal || '',
          no_reg: data.no_reg || '',
          jenis_kunjungan: data.jenis_kunjungan || '',
          nama_pasien: data.nama_pasien || '',
          nik_pasien: data.nik_pasien || '',
          umur_pasien: data.umur_pasien || '',
          bb_pasien: data.bb_pasien || '',
          td_pasien: data.td_pasien || '',
          nama_wali: data.nama_wali || '',
          nik_wali: data.nik_wali || '',
          umur_wali: data.umur_wali || '',
          keluhan: data.keluhan || '',
          diagnosa: data.diagnosa || '',
          terapi_obat: data.terapi_obat || '',
          keterangan: data.keterangan || ''
        });
        setEditingId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data untuk diedit');
    }
  };

  const handleDelete = async (id) => {
    showNotifikasi({
      type: 'confirm-delete',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      onConfirm: async () => {
        hideNotifikasi();
        try {
          showNotifikasi({
            type: 'success',
            message: 'Data berhasil dihapus!',
            autoClose: true,
            autoCloseDuration: 2000,
            onConfirm: hideNotifikasi
          });
          fetchRiwayatPelayanan();
        } catch (error) {
          console.error('Error:', error);
          showNotifikasi({
            type: 'error',
            message: 'Terjadi kesalahan saat menghapus data',
            onConfirm: hideNotifikasi,
            onCancel: hideNotifikasi
          });
        }
      },
      onCancel: hideNotifikasi
    });
  };

  return (
    <div className="layanan-kunjungan-page">
      {/* Header */}
      <div className="kunjungan-header">
        <div className="kunjungan-header-left">
          <div className="kunjungan-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="kunjungan-header-logo-img" />
          </div>
          <h1 className="kunjungan-header-title">Layanan Kunjungan Pasien</h1>
        </div>
        <button className="btn-kembali-kunjungan" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="kunjungan-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="kunjungan"
          onRiwayatDataMasuk={onToRiwayatDataMasuk}
          onRiwayatMasukAkun={onToRiwayatMasukAkun}
          onProfilSaya={onToProfil}
          onTambahPasien={() => setShowForm(true)}
          onTambahPengunjung={onToTambahPengunjung}
          onBuatLaporan={onToBuatLaporan}
          onToPersalinan={onToPersalinan}
          onToANC={onToANC}
          onToKB={onToKB}
          onToImunisasi={onToImunisasi}
        />

        {/* Main Area */}
        <main className="kunjungan-main-area">
          {!showForm ? (
            <>
              {/* Welcome Section */}
              <div className="kunjungan-welcome-section">
                <p className="kunjungan-welcome-text">Selamat datang, username!</p>
                <div className="kunjungan-action-buttons">
                  <button className="kunjungan-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="white" opacity="0.3"/>
                      <path d="M20 10V30M10 20H30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  <button className="kunjungan-action-btn" onClick={onToJadwal}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="white" opacity="0.3"/>
                      <rect x="12" y="12" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
                      <path d="M16 12V8M24 12V8M12 16H28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Buat Jadwal</span>
                  </button>
                </div>
              </div>

              {/* Riwayat Pelayanan */}
              <div className="kunjungan-riwayat-section">
                <h2 className="kunjungan-section-title">Riwayat Pelayanan</h2>
                <div className="kunjungan-search-bar">
                  <input
                    type="text"
                    className="kunjungan-search-input"
                    placeholder="Cari Nama Pasien..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <div className="kunjungan-filter-wrapper">
                    <button 
                      className="kunjungan-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <img src={filterIcon} alt="Filter" style={{width: '20px', height: '20px'}} />
                    </button>
                    {showFilterDropdown && (
                      <div className="kunjungan-filter-dropdown">
                        <div className="kunjungan-filter-option">Semua Data</div>
                        <div className="kunjungan-filter-option">Hari Ini</div>
                        <div className="kunjungan-filter-option">Minggu Ini</div>
                        <div className="kunjungan-filter-option">Bulan Ini</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="kunjungan-riwayat-list">
                  {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</div>
                  ) : riwayatPelayanan.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada data riwayat</div>
                  ) : (
                    riwayatPelayanan.map((item) => (
                      <div key={item.id} className="kunjungan-riwayat-item">
                        <span className="kunjungan-riwayat-text">
                          {item.nama_pasien} - {item.tanggal}
                        </span>
                        <div className="kunjungan-riwayat-actions">
                          <button 
                            className="kunjungan-btn-edit"
                            onClick={() => handleEdit(item)}
                          >
                            <img src={editIcon} alt="Edit" style={{width: '18px', height: '18px'}} />
                          </button>
                          <button 
                            className="kunjungan-btn-delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <img src={trashIcon} alt="Delete" style={{width: '18px', height: '18px'}} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form Registrasi */
            <div className="kunjungan-form-container">
              <form className="kunjungan-form" onSubmit={handleSubmit}>
                {/* Informasi Layanan */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Informasi Layanan</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Jenis Layanan</label>
                      <input
                        type="text"
                        name="jenis_layanan"
                        value={formData.jenis_layanan}
                        readOnly
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Tanggal Kunjungan</label>
                      <input
                        type="date"
                        name="tanggal_kunjungan"
                        value={formData.tanggal_kunjungan}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Keluhan</label>
                      <textarea
                        name="keluhan"
                        value={formData.keluhan}
                        onChange={handleInputChange}
                        placeholder="Masukkan keluhan pasien"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Data Diri Pasien */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Data Diri Pasien</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Nama Pasien</label>
                      <input
                        type="text"
                        name="nama_pasien"
                        value={formData.nama_pasien}
                        onChange={handleInputChange}
                        placeholder="Nama Lengkap"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        placeholder="Nomor Induk Kependudukan"
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Umur</label>
                      <input
                        type="number"
                        name="umur"
                        value={formData.umur}
                        onChange={handleInputChange}
                        placeholder="Umur (tahun)"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Alamat</label>
                      <input
                        type="text"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        placeholder="Alamat Lengkap"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Data Kesehatan */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Data Kesehatan</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Tekanan Darah</label>
                      <input
                        type="text"
                        name="tekanan_darah"
                        value={formData.tekanan_darah}
                        onChange={handleInputChange}
                        placeholder="Contoh: 120/80"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Suhu Tubuh (°C)</label>
                      <input
                        type="text"
                        name="suhu_tubuh"
                        value={formData.suhu_tubuh}
                        onChange={handleInputChange}
                        placeholder="Contoh: 36.5"
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Berat Badan (kg)</label>
                      <input
                        type="text"
                        name="berat_badan"
                        value={formData.berat_badan}
                        onChange={handleInputChange}
                        placeholder="Berat Badan"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Tinggi Badan (cm)</label>
                      <input
                        type="text"
                        name="tinggi_badan"
                        value={formData.tinggi_badan}
                        onChange={handleInputChange}
                        placeholder="Tinggi Badan"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Informasi Tambahan</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Diagnosis</label>
                      <textarea
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        placeholder="Diagnosis dokter"
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Tindakan</label>
                      <textarea
                        name="tindakan"
                        value={formData.tindakan}
                        onChange={handleInputChange}
                        placeholder="Tindakan yang diberikan"
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Catatan</label>
                      <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleInputChange}
                        placeholder="Catatan tambahan"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="kunjungan-form-actions">
                  <button type="button" className="kunjungan-btn-batal" onClick={handleBatal}>
                    Batal
                  </button>
                  <button type="submit" className="kunjungan-btn-simpan" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
      
      <Notifikasi
        type={notifikasi.type}
        message={notifikasi.message}
        isOpen={notifikasi.isOpen}
        onConfirm={notifikasi.onConfirm}
        onCancel={notifikasi.onCancel}
        autoClose={notifikasi.autoClose}
        autoCloseDuration={notifikasi.autoCloseDuration}
      />
    </div>
  );
}

export default LayananKunjunganPasien;
