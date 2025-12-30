import { useState, useEffect } from 'react';
import './LayananPersalinan.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import filterIcon from '../../assets/images/icons/icons8-filter-100.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function LayananPersalinan({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [showForm, setShowForm] = useState(false);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const [formData, setFormData] = useState({
    jenis_layanan: 'Persalinan',
    tanggal: '',
    no_reg_lama: '',
    no_reg_baru: '',
    penolong: '',
    nama_istri: '',
    nik_istri: '',
    umur_istri: '',
    td_ibu: '',
    bb_ibu: '',
    lila_ibu: '',
    lida_ibu: '',
    nama_suami: '',
    nik_suami: '',
    umur_suami: '',
    alamat: '',
    no_hp: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    anak_ke: '',
    jenis_partus: '',
    imd_dilakukan: false,
    as_bayi: '',
    bb_bayi: '',
    pb_bayi: '',
    lika_bayi: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await layananService.getAllPersalinan(search);
      if (response.success && response.data) {
        const mappedData = response.data.map(item => ({
          id: item.id_pemeriksaan,
          nama_pasien: item.nama_pasien || 'Pasien',
          tanggal: item.tanggal,
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
    // Validate required fields
    if (!formData.tanggal || !formData.jenis_partus || !formData.nama_istri || !formData.nik_istri || !formData.umur_istri) {
      showNotifikasi({
        type: 'error',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
      return;
    }

    // Validasi NIK
    if (formData.nik_istri && formData.nik_istri.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Istri harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      return;
    }

    if (formData.nik_suami && formData.nik_suami.length > 0 && formData.nik_suami.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Suami harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      return;
    }

    showNotifikasi({
      type: editingId ? 'confirm-edit' : 'confirm-save',
      onConfirm: async () => {
        hideNotifikasi();
        setIsLoading(true);

        try {
          let response;
          if (editingId) {
            response = await layananService.updatePersalinan(editingId, formData);
          } else {
            response = await layananService.createPersalinan(formData);
          }

          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: editingId ? 'Data berhasil diupdate!' : 'Data registrasi persalinan berhasil disimpan!',
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
      },
      onCancel: hideNotifikasi
    });
  };

  const handleBatal = () => {
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      jenis_layanan: 'Persalinan',
      tanggal: '',
      no_reg_lama: '',
      no_reg_baru: '',
      penolong: '',
      nama_istri: '',
      nik_istri: '',
      umur_istri: '',
      td_ibu: '',
      bb_ibu: '',
      lila_ibu: '',
      lida_ibu: '',
      nama_suami: '',
      nik_suami: '',
      umur_suami: '',
      alamat: '',
      no_hp: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      anak_ke: '',
      jenis_partus: '',
      imd_dilakukan: false,
      as_bayi: '',
      bb_bayi: '',
      pb_bayi: '',
      lika_bayi: ''
    });
    setError('');
  };

  const handleEdit = async (id) => {
    try {
      const response = await layananService.getPersalinanById(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          tanggal: data.tanggal || '',
          no_reg_lama: data.no_reg_lama || '',
          no_reg_baru: data.no_reg_baru || '',
          penolong: data.penolong || '',
          nama_istri: data.nama_istri || '',
          nik_istri: data.nik_istri || '',
          umur_istri: data.umur_istri || '',
          td_ibu: data.td_ibu || '',
          bb_ibu: data.bb_ibu || '',
          lila_ibu: data.lila_ibu || '',
          lida_ibu: data.lida_ibu || '',
          nama_suami: data.nama_suami || '',
          nik_suami: data.nik_suami || '',
          umur_suami: data.umur_suami || '',
          alamat: data.alamat || '',
          no_hp: data.no_hp || '',
          tanggal_lahir: data.tanggal_lahir || '',
          jenis_kelamin: data.jenis_kelamin || '',
          anak_ke: data.anak_ke || '',
          jenis_partus: data.jenis_partus || '',
          imd_dilakukan: data.imd_dilakukan || false,
          as_bayi: data.as_bayi || '',
          bb_bayi: data.bb_bayi || '',
          pb_bayi: data.pb_bayi || '',
          lika_bayi: data.lika_bayi || ''
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
          const response = await layananService.deletePersalinan(id);
          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dihapus!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            fetchRiwayatPelayanan();
          } else {
            showNotifikasi({
              type: 'error',
              message: response.message || 'Gagal menghapus data',
              onConfirm: hideNotifikasi,
              onCancel: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('Error deleting:', error);
          showNotifikasi({
            type: 'error',
            message: error.message || 'Gagal menghapus data',
            onConfirm: hideNotifikasi,
            onCancel: hideNotifikasi
          });
        }
      },
      onCancel: hideNotifikasi
    });
  };

  const handleHeaderBack = () => {
    if (showForm) {
      handleBatal();
    } else {
      onBack();
    }
  };

  return (
    <div className="layanan-persalinan-page">
      {/* Header */}
      <div className="persalinan-header">
        <div className="persalinan-header-left">
          <div className="persalinan-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="persalinan-header-logo-img" />
          </div>
          <h1 className="persalinan-header-title">
            {showForm ? (editingId ? 'Edit Registrasi Layanan Persalinan' : 'Formulir Registrasi Layanan Persalinan') : 'Layanan Persalinan'}
          </h1>
        </div>
        <button className="btn-kembali-persalinan" onClick={handleHeaderBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="persalinan-content">
        {/* Sidebar */}
        <Sidebar
          activePage="persalinan"
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
        <main className="persalinan-main-area">
          {!showForm ? (
            <>
              {/* Welcome Message & Action Buttons */}
              <div className="persalinan-welcome-section">
                <p className="persalinan-welcome-text">Selamat datang, {userData?.username || 'username'}!</p>

                <div className="persalinan-action-buttons">
                  <button className="persalinan-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z" />
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z" />
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>

                  <button className="persalinan-action-btn" onClick={onToJadwal}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <rect x="8" y="8" width="24" height="24" rx="2" stroke="white" strokeWidth="2" fill="none" />
                      <line x1="8" y1="15" x2="32" y2="15" stroke="white" strokeWidth="2" />
                      <circle cx="14" cy="11.5" r="1" fill="white" />
                      <circle cx="18" cy="11.5" r="1" fill="white" />
                      <circle cx="22" cy="11.5" r="1" fill="white" />
                    </svg>
                    <span>Buat Jadwal</span>
                  </button>
                </div>
              </div>

              {/* Riwayat Pelayanan */}
              <div className="persalinan-riwayat-section">
                <h2 className="persalinan-section-title">Riwayat Pelayanan</h2>

                <div className="persalinan-search-bar">
                  <input
                    type="text"
                    placeholder="Cari Data"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="persalinan-search-input"
                  />
                  <div className="persalinan-filter-wrapper">
                    <button
                      className="persalinan-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <img src={filterIcon} alt="Filter" style={{ width: '20px', height: '20px' }} />
                    </button>
                    {showFilterDropdown && (
                      <div className="persalinan-filter-dropdown">
                        <div className="persalinan-filter-option">Semua Data</div>
                        <div className="persalinan-filter-option">Hari Ini</div>
                        <div className="persalinan-filter-option">Minggu Ini</div>
                        <div className="persalinan-filter-option">Bulan Ini</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="persalinan-riwayat-list">
                  {isLoading ? (
                    <div className="persalinan-riwayat-loading">Memuat data...</div>
                  ) : riwayatPelayanan.length > 0 ? (
                    riwayatPelayanan.map((item) => (
                      <div key={item.id} className="persalinan-riwayat-item">
                        <span className="persalinan-riwayat-text">
                          {item.nama_pasien} - {item.tanggal}
                        </span>
                        <div className="persalinan-riwayat-actions">
                          <button className="persalinan-btn-edit" onClick={() => handleEdit(item.id)}>
                            <img src={editIcon} alt="Edit" style={{ width: '18px', height: '18px' }} />
                          </button>
                          <button className="persalinan-btn-delete" onClick={() => handleDelete(item.id)}>
                            <img src={trashIcon} alt="Delete" style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="persalinan-riwayat-empty">Belum ada data pelayanan</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form Registrasi */
            <div className="persalinan-form-container">
              <form onSubmit={handleSubmit} className="persalinan-form" noValidate>
                {/* Informasi Layanan */}
                <div className="persalinan-form-section">
                  <h3 className="persalinan-form-section-title">Informasi Layanan</h3>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group">
                      <label>Jenis Layanan</label>
                      <input
                        type="text"
                        name="jenis_layanan"
                        value={formData.jenis_layanan || 'Persalinan'}
                        onChange={handleInputChange}
                        placeholder="Pilih Jenis Layanan"
                        required
                        readOnly
                        style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                    </div>

                    <div className="persalinan-form-group">
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

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group">
                      <label>Nomor Registrasi Lama</label>
                      <input
                        type="text"
                        name="no_reg_lama"
                        value={formData.no_reg_lama}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="persalinan-form-group">
                      <label>Nomor Registrasi Baru</label>
                      <input
                        type="text"
                        name="no_reg_baru"
                        value={formData.no_reg_baru}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="persalinan-form-group">
                      <label>Jenis Partus</label>
                      <select
                        name="jenis_partus"
                        value={formData.jenis_partus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Jenis Partus</option>
                        <option value="Spontan Normal">Spontan Normal</option>
                        <option value="Caesar">Caesar</option>
                        <option value="Vacuum">Vacuum</option>
                        <option value="Forceps">Forceps</option>
                      </select>
                    </div>

                    <div className="persalinan-form-group">
                      <label>Anak Ke</label>
                      <input
                        type="number"
                        name="anak_ke"
                        value={formData.anak_ke}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group">
                      <label>Penolong</label>
                      <input
                        type="text"
                        name="penolong"
                        value={formData.penolong}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama penolong"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="persalinan-form-section">
                  <h3 className="persalinan-form-section-title">Data Ibu</h3>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group full-width">
                      <label>Nama Istri</label>
                      <input
                        type="text"
                        name="nama_istri"
                        value={formData.nama_istri}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                  </div>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_istri"
                        value={formData.nik_istri}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        maxLength="16"
                        required
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_istri"
                        value={formData.umur_istri}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        required
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>TD</label>
                      <input
                        type="text"
                        name="td_ibu"
                        value={formData.td_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>BB</label>
                      <input
                        type="text"
                        name="bb_ibu"
                        value={formData.bb_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ayah */}
                <div className="persalinan-form-section">
                  <h3 className="persalinan-form-section-title">Data Ayah</h3>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group full-width">
                      <label>Nama Suami</label>
                      <input
                        type="text"
                        name="nama_suami"
                        value={formData.nama_suami}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_suami"
                        value={formData.nik_suami}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        maxLength="16"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_suami"
                        value={formData.umur_suami}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="persalinan-form-section">
                  <h3 className="persalinan-form-section-title">Informasi Tambahan</h3>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group small" style={{ flex: '0 0 295px', minWidth: '295px' }}>
                      <label>Tanggal Lahir</label>
                      <input
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                      />
                    </div>

                    <div className="persalinan-form-group small" style={{ flex: '0 0 180px', minWidth: '180px' }}>
                      <label>L/P</label>
                      <select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onChange={handleInputChange}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div className="persalinan-form-group small">
                      <label>AS</label>
                      <input
                        type="text"
                        name="as_bayi"
                        value={formData.as_bayi}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>BB (gram)</label>
                      <input
                        type="text"
                        name="bb_bayi"
                        value={formData.bb_bayi}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>PB (cm)</label>
                      <input
                        type="text"
                        name="pb_bayi"
                        value={formData.pb_bayi}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>LIKA (cm)</label>
                      <input
                        type="text"
                        name="lika_bayi"
                        value={formData.lika_bayi}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>LIDA (cm)</label>
                      <input
                        type="text"
                        name="lida_ibu"
                        value={formData.lida_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>

                  <div className="persalinan-form-row">
                    <div className="persalinan-form-group small">
                      <label>LILA (cm)</label>
                      <input
                        type="text"
                        name="lila_ibu"
                        value={formData.lila_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label>Alamat</label>
                      <input
                        type="text"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>

                    <div className="persalinan-form-group small">
                      <label style={{ marginBottom: '8px', display: 'block' }}>IMD</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                          <input
                            type="radio"
                            name="imd_dilakukan"
                            checked={formData.imd_dilakukan === true || formData.imd_dilakukan === 'true' || formData.imd_dilakukan === 1}
                            onChange={() => setFormData(prev => ({ ...prev, imd_dilakukan: true }))}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: '14px' }}>Dilakukan</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                          <input
                            type="radio"
                            name="imd_dilakukan"
                            checked={formData.imd_dilakukan === false || formData.imd_dilakukan === 'false' || formData.imd_dilakukan === 0}
                            onChange={() => setFormData(prev => ({ ...prev, imd_dilakukan: false }))}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: '14px' }}>Tidak Dilakukan</span>
                        </label>
                      </div>
                    </div>

                    <div className="persalinan-form-group" style={{ flex: '1 1 auto', minWidth: '200px' }}>
                      <label>Nomor HP</label>
                      <input
                        type="tel"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor HP"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="persalinan-form-actions">
                  <button type="button" className="persalinan-btn-batal" onClick={handleBatal}>
                    Batal
                  </button>
                  <button type="submit" className="persalinan-btn-simpan" disabled={isLoading}>
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

export default LayananPersalinan;
