import { useState, useEffect } from 'react';
import './LayananANC.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import filterIcon from '../../assets/images/icons/icons8-filter-100.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function LayananANC({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
      let response;
      if (editingId) {
        response = await layananService.updateANC(editingId, formData);
      } else {
        response = await layananService.createANC(formData);
      }
      
      if (response.success) {
        showNotifikasi({
          type: 'success',
          message: editingId ? 'Data berhasil diupdate!' : 'Data registrasi ANC berhasil disimpan!',
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
    setEditingId(null);
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

  const handleEdit = async (id) => {
    try {
      const response = await layananService.getANCById(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          tanggal: data.tanggal || '',
          no_reg_lama: data.no_reg_lama || '',
          no_reg_baru: data.no_reg_baru || '',
          tindakan: data.tindakan || '',
          nama_istri: data.nama_istri || '',
          nik_istri: data.nik_istri || '',
          umur_istri: data.umur_istri || '',
          nama_suami: data.nama_suami || '',
          nik_suami: data.nik_suami || '',
          umur_suami: data.umur_suami || '',
          alamat: data.alamat || '',
          no_hp: data.no_hp || '',
          hpht: data.hpht || '',
          hpl: data.hpl || '',
          hasil_pemeriksaan: data.hasil_pemeriksaan || '',
          keterangan: data.keterangan || ''
        });
        setEditingId(id);
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
            {showForm ? (editingId ? 'Edit Registrasi Layanan Antenatal Care (ANC)' : 'Formulir Registrasi Layanan Antenatal Care (ANC)') : 'Layanan Antenatal Care (ANC)'}
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
          onTambahPasien={() => setShowForm(true)}
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
                  <button className="anc-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z"/>
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z"/>
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  
                  <button className="anc-action-btn" onClick={onToJadwal}>
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
                  <div className="anc-filter-wrapper">
                    <button 
                      className="anc-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <img src={filterIcon} alt="Filter" style={{width: '20px', height: '20px'}} />
                    </button>
                    {showFilterDropdown && (
                      <div className="anc-filter-dropdown">
                        <div className="anc-filter-option">Semua Data</div>
                        <div className="anc-filter-option">Hari Ini</div>
                        <div className="anc-filter-option">Minggu Ini</div>
                        <div className="anc-filter-option">Bulan Ini</div>
                      </div>
                    )}
                  </div>
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
                          <button className="anc-btn-edit" onClick={() => handleEdit(item.id)}>
                            <img src={editIcon} alt="Edit" style={{width: '18px', height: '18px'}} />
                          </button>
                          <button className="anc-btn-delete" onClick={() => handleDelete(item.id)}>
                            <img src={trashIcon} alt="Delete" style={{width: '18px', height: '18px'}} />
                          </button>
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
