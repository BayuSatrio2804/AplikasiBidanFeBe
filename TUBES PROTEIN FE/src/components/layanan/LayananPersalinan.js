import { useState, useEffect } from 'react';
import './LayananPersalinan.css';
import '../jadwal/Jadwal.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import filterIcon from '../../assets/images/icons/icons8-filter-100.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import layananService from '../../services/layanan.service';
import jadwalService from '../../services/jadwal.service';
import pasienService from '../../services/pasien.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import PilihPasienModal from '../shared/PilihPasienModal';

function LayananPersalinan({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [showForm, setShowForm] = useState(false);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  const [showPasienModal, setShowPasienModal] = useState(false);

  // State untuk popup jadwal
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [pasienListForJadwal, setPasienListForJadwal] = useState([]);
  const [jadwalFormData, setJadwalFormData] = useState({
    id_pasien: '',
    jenis_layanan: 'Persalinan',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });

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

  const handlePasienSelect = async (pasien) => {
    try {
      // Ambil detail pasien lengkap (termasuk data suami terakhir)
      const response = await pasienService.getPasienById(pasien.id_pasien);
      if (response.success && response.data) {
        const fullPasien = response.data;
        const husband = fullPasien.latest_husband_data || {};

        setFormData(prev => ({
          ...prev,
          nama_istri: fullPasien.nama,
          nik_istri: fullPasien.nik,
          umur_istri: fullPasien.umur,
          alamat: fullPasien.alamat,
          no_hp: fullPasien.no_hp,
          // Auto-fill Suami
          nama_suami: husband.nama_suami || '',
          nik_suami: husband.nik_suami || '',
          umur_suami: husband.umur_suami || ''
        }));
      }
    } catch (error) {
      console.error('Error auto-filling patient data:', error);
      // Fallback manual jika gagal fetch detail
      setFormData(prev => ({
        ...prev,
        nama_istri: pasien.nama,
        nik_istri: pasien.nik,
        umur_istri: pasien.umur,
        alamat: pasien.alamat,
        no_hp: pasien.no_hp
      }));
    }

    setShowPasienModal(false);
    showNotifikasi({
      type: 'success',
      message: 'Data Pasien Berhasil Dipilih!',
      autoClose: true,
      autoCloseDuration: 1500,
      onConfirm: hideNotifikasi
    });
  };

  // Fungsi untuk popup jadwal
  const fetchPasienForJadwal = async () => {
    try {
      const response = await pasienService.getAllPasien();
      if (response.success) {
        setPasienListForJadwal(response.data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleOpenJadwalModal = () => {
    fetchPasienForJadwal();
    setJadwalFormData({
      id_pasien: '',
      jenis_layanan: 'Persalinan',
      tanggal: '',
      jam_mulai: '',
      jam_selesai: ''
    });
    setShowJadwalModal(true);
  };

  const handleJadwalInputChange = (e) => {
    const { name, value } = e.target;
    setJadwalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJadwalSubmit = async (e) => {
    e.preventDefault();

    if (!jadwalFormData.id_pasien || !jadwalFormData.tanggal || !jadwalFormData.jam_mulai) {
      showNotifikasi({
        type: 'error',
        message: 'Mohon lengkapi: Pasien, Tanggal, Jam Mulai',
        onConfirm: hideNotifikasi
      });
      return;
    }

    try {
      const payload = {
        id_pasien: jadwalFormData.id_pasien,
        jenis_layanan: jadwalFormData.jenis_layanan,
        tanggal: jadwalFormData.tanggal,
        jam_mulai: jadwalFormData.jam_mulai,
        jam_selesai: jadwalFormData.jam_selesai || null
      };

      await jadwalService.createJadwal(payload);
      showNotifikasi({
        type: 'success',
        message: 'Jadwal berhasil ditambahkan!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: hideNotifikasi
      });

      setShowJadwalModal(false);
      setJadwalFormData({
        id_pasien: '',
        jenis_layanan: 'Persalinan',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: ''
      });
    } catch (error) {
      console.error('Error saving jadwal:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal menyimpan jadwal',
        onConfirm: hideNotifikasi
      });
    }
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

                  <button className="persalinan-action-btn" onClick={handleOpenJadwalModal}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 className="persalinan-form-section-title" style={{ margin: 0 }}>Data Ibu</h3>
                    <button
                      type="button"
                      onClick={() => setShowPasienModal(true)}
                      style={{
                        backgroundColor: '#e91e63',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '14px'
                      }}
                    >
                      <span>🔍</span> Cari Pasien
                    </button>
                  </div>

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

      <PilihPasienModal
        show={showPasienModal}
        onClose={() => setShowPasienModal(false)}
        onSelect={handlePasienSelect}
      />

      {/* Modal Popup Jadwal */}
      {showJadwalModal && (
        <div className="jadwal-modal-overlay" onClick={() => setShowJadwalModal(false)}>
          <div className="jadwal-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="jadwal-modal-title">Buat Jadwal Persalinan</h2>
            <form onSubmit={handleJadwalSubmit}>
              <div className="jadwal-modal-grid">
                <div className="jadwal-modal-form-group full-width">
                  <label>Jenis Layanan *</label>
                  <input
                    type="text"
                    value={jadwalFormData.jenis_layanan}
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Tanggal *</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={jadwalFormData.tanggal}
                    onChange={handleJadwalInputChange}
                    required
                  />
                </div>

                <div className="jadwal-modal-form-group">
                  <label>Jam Mulai *</label>
                  <input
                    type="time"
                    name="jam_mulai"
                    value={jadwalFormData.jam_mulai}
                    onChange={handleJadwalInputChange}
                    required
                  />
                </div>

                <div className="jadwal-modal-form-group">
                  <label>Jam Selesai</label>
                  <input
                    type="time"
                    name="jam_selesai"
                    value={jadwalFormData.jam_selesai}
                    onChange={handleJadwalInputChange}
                  />
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Nama Pasien *</label>
                  <select
                    name="id_pasien"
                    value={jadwalFormData.id_pasien}
                    onChange={handleJadwalInputChange}
                    required
                  >
                    <option value="">Pilih Pasien</option>
                    {pasienListForJadwal.map(pasien => (
                      <option key={pasien.id_pasien} value={pasien.id_pasien}>
                        {pasien.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Penanggung Jawab</label>
                  <input
                    type="text"
                    value={userData?.nama_lengkap || 'Tidak diketahui'}
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="jadwal-modal-actions">
                <button
                  type="button"
                  className="jadwal-btn-modal-batal"
                  onClick={() => setShowJadwalModal(false)}
                >
                  ✕
                </button>
                <button type="submit" className="jadwal-btn-modal-simpan">
                  ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LayananPersalinan;
