import { useState, useEffect } from 'react';
import './LayananANC.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function LayananANC({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [showForm, setShowForm] = useState(false);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  
  const [formData, setFormData] = useState({
    tanggal: '',
    no_reg_lama: '',
    no_reg_baru: '',
    tindakan: '',
    nama_istri: '',
    nik_istri: '',
    umur_istri: '',
    nama_suami: '',
    nik_suami: '',
    umur_suami: '',
    alamat: '',
    no_hp: '',
    hpht: '',
    hpl: '',
    hasil_pemeriksaan: '',
    keterangan: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await layananService.getAllANC(search);
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
      console.error('Error fetching riwayat:', error);
      setRiwayatPelayanan([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchRiwayatPelayanan(query);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await layananService.createANC(formData);
      
      if (response.success) {
        showNotifikasi({
          type: 'success',
          message: 'Data registrasi ANC berhasil disimpan!',
          autoClose: true,
          autoCloseDuration: 2000,
          onConfirm: hideNotifikasi
        });
        setShowForm(false);
        resetForm();
        fetchRiwayatPelayanan();
      } else {
        setError(response.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving registration:', error);
      setError(error.message || 'Gagal menyimpan data registrasi');
      showNotifikasi({
        type: 'error',
        message: error.message || 'Gagal menyimpan data registrasi',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      tanggal: '',
      no_reg_lama: '',
      no_reg_baru: '',
      tindakan: '',
      nama_istri: '',
      nik_istri: '',
      umur_istri: '',
      nama_suami: '',
      nik_suami: '',
      umur_suami: '',
      alamat: '',
      no_hp: '',
      hpht: '',
      hpl: '',
      hasil_pemeriksaan: '',
      keterangan: ''
    });
    setError('');
  };

  const handleEdit = (id) => {
    console.log('Edit:', id);
  };

  const handleDelete = async (id) => {
    showNotifikasi({
      type: 'confirm-delete',
      message: 'Yakin ingin menghapus data ini?',
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
          console.error('Error deleting:', error);
          showNotifikasi({
            type: 'error',
            message: 'Gagal menghapus data',
            onConfirm: hideNotifikasi,
            onCancel: hideNotifikasi
          });
        }
      },
      onCancel: hideNotifikasi
    });
  };

  return (
    <div className="layanan-anc-page">
      {/* Header */}
      <div className="anc-header">
        <div className="anc-header-left">
          <div className="anc-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="anc-header-logo-img" />
          </div>
          <h1 className="anc-header-title">
            {showForm ? 'Formulir Registrasi Layanan Antenatal Care (ANC)' : 'Layanan Antenatal Care (ANC)'}
          </h1>
        </div>
        <button className="btn-kembali-anc" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="anc-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="anc"
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
        <main className="anc-main-area">
          {!showForm ? (
            <>
              {/* Welcome Message & Action Buttons */}
              <div className="anc-welcome-section">
                <p className="anc-welcome-text">Selamat datang, {userData?.username || 'username'}!</p>
                
                <div className="anc-action-buttons">
                  <button className="anc-action-btn">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z"/>
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z"/>
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  
                  <button className="anc-action-btn" onClick={onToTambahPasien}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <rect x="8" y="8" width="24" height="24" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                      <line x1="8" y1="15" x2="32" y2="15" stroke="white" strokeWidth="2"/>
                      <circle cx="14" cy="11.5" r="1" fill="white"/>
                      <circle cx="18" cy="11.5" r="1" fill="white"/>
                      <circle cx="22" cy="11.5" r="1" fill="white"/>
                    </svg>
                    <span>Buat Jadwal</span>
                  </button>
                </div>
              </div>

              {/* Riwayat Pelayanan */}
              <div className="anc-riwayat-section">
                <h2 className="anc-section-title">Riwayat Pelayanan</h2>
                
                <div className="anc-search-bar">
                  <input
                    type="text"
                    placeholder="Cari Data"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="anc-search-input"
                  />
                  <button className="anc-search-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M9 3.5C5.686 3.5 3 6.186 3 9.5C3 12.814 5.686 15.5 9 15.5C10.386 15.5 11.678 15.013 12.707 14.207L16.293 17.793L17.707 16.379L14.121 12.793C14.957 11.754 15.5 10.437 15.5 9C15.5 5.686 12.814 3 9 3C9 3 9 3.5 9 3.5ZM9 5C11.761 5 14 7.239 14 10C14 12.761 11.761 15 9 15C6.239 15 4 12.761 4 10C4 7.239 6.239 5 9 5Z"/>
                    </svg>
                  </button>
                </div>

                <div className="anc-riwayat-list">
                  {isLoading ? (
                    <div className="anc-riwayat-loading">Memuat data...</div>
                  ) : riwayatPelayanan.length > 0 ? (
                    riwayatPelayanan.map((item) => (
                      <div key={item.id} className="anc-riwayat-item">
                        <span className="anc-riwayat-text">
                          {item.nama_pasien} - {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </span>
                        <div className="anc-riwayat-actions">
                          <button className="anc-btn-edit" onClick={() => handleEdit(item.id)}>✏️</button>
                          <button className="anc-btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="anc-riwayat-empty">Belum ada data pelayanan</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form Registrasi */
            <div className="anc-form-container">
              <form onSubmit={handleSubmit} className="anc-form">
                {/* Informasi Layanan */}
                <div className="anc-form-section">
                  <h3 className="anc-form-section-title">Informasi Layanan</h3>
                  
                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Jenis Layanan</label>
                      <input
                        type="text"
                        name="jenis_layanan"
                        value={formData.jenis_layanan}
                        onChange={handleInputChange}
                        placeholder="Pilih Jenis Layanan"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Tanggal</label>
                      <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                        required
                      />
                    </div>
                  </div>

                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Nomor Registrasi Lama</label>
                      <input
                        type="text"
                        name="nomor_registrasi_lama"
                        value={formData.nomor_registrasi_lama}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Nomor Registrasi Baru</label>
                      <input
                        type="text"
                        name="nomor_registrasi_baru"
                        value={formData.nomor_registrasi_baru}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Tindakan</label>
                      <input
                        type="text"
                        name="tindakan"
                        value={formData.tindakan}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="anc-form-section">
                  <h3 className="anc-form-section-title">Data Ibu</h3>
                  
                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Nama Istri</label>
                      <input
                        type="text"
                        name="nama_ibu"
                        value={formData.nama_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_ibu"
                        value={formData.nik_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        maxLength="16"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_ibu"
                        value={formData.umur_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ayah */}
                <div className="anc-form-section">
                  <h3 className="anc-form-section-title">Data Ayah</h3>
                  
                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Nama Suami</label>
                      <input
                        type="text"
                        name="nama_ayah"
                        value={formData.nama_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_ayah"
                        value={formData.nik_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        maxLength="16"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_ayah"
                        value={formData.umur_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="anc-form-section">
                  <h3 className="anc-form-section-title">Informasi Tambahan</h3>
                  
                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Alamat</label>
                      <input
                        type="text"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        placeholder="Masukkan detail alamat"
                        required
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>HPHT</label>
                      <input
                        type="date"
                        name="hpht"
                        value={formData.hpht}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>HPL</label>
                      <input
                        type="date"
                        name="hpl"
                        value={formData.hpl}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                      />
                    </div>
                  </div>

                  <div className="anc-form-row">
                    <div className="anc-form-group">
                      <label>Hasil Pemeriksaan</label>
                      <textarea
                        name="hasil_pemeriksaan"
                        value={formData.hasil_pemeriksaan}
                        onChange={handleInputChange}
                        placeholder="Tambahkan hasil pemeriksaan"
                        rows="3"
                      />
                    </div>
                    
                    <div className="anc-form-group">
                      <label>Keterangan</label>
                      <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleInputChange}
                        placeholder="Tambahkan keterangan"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="anc-form-actions">
                  <button type="button" className="anc-btn-batal" onClick={handleBatal}>
                    Batal
                  </button>
                  <button type="submit" className="anc-btn-simpan" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          )}
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

export default LayananANC;
