import { useState, useEffect } from 'react';
import './LayananKB.css';
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

function LayananKB({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  const [showPasienModal, setShowPasienModal] = useState(false);

  // State untuk popup jadwal
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [pasienListForJadwal, setPasienListForJadwal] = useState([]);
  const [jadwalFormData, setJadwalFormData] = useState({
    id_pasien: '',
    jenis_layanan: 'KB',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });
  const [filterType, setFilterType] = useState('Semua Data');

  const getFilteredData = () => {
    if (!riwayatPelayanan) return [];
    if (filterType === 'Semua Data') return riwayatPelayanan;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return riwayatPelayanan.filter(item => {
      let dateStr = item.tanggal; // item.tanggal is mapped from item.tanggal_pemeriksaan in fetch
      if (!dateStr) return false;

      // Handle potential DD/MM/YYYY format if any (standard is YYYY-MM-DD or ISO from backend)
      let itemDate = new Date(dateStr);
      if (isNaN(itemDate.getTime()) && typeof dateStr === 'string' && dateStr.includes('/')) {
        const parts = dateStr.split('/');
        itemDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }

      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      if (filterType === 'Hari Ini') {
        return itemDay.getTime() === today.getTime();
      }

      if (filterType === 'Minggu Ini') {
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay()); // Sunday
        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() + (6 - today.getDay())); // Saturday
        return itemDay >= firstDay && itemDay <= lastDay;
      }

      if (filterType === 'Bulan Ini') {
        return itemDay.getMonth() === today.getMonth() && itemDay.getFullYear() === today.getFullYear();
      }

      return true;
    });
  };

  const filteredRiwayat = getFilteredData();

  const [formData, setFormData] = useState({
    jenis_layanan: 'KB',
    tanggal: '',
    nomor_registrasi_lama: '',
    nomor_registrasi_baru: '',
    metode: '',
    nama_ibu: '',
    nik_ibu: '',
    umur_ibu: '',
    td_ibu: '',
    bb_ibu: '',
    nama_ayah: '',
    nik_ayah: '',
    umur_ayah: '',
    td_ayah: '',
    bb_ayah: '',
    alamat: '',
    nomor_hp: '',
    kunjungan_ulang: '',
    jam_kunjungan_ulang: '08:00',
    jam_kunjungan_ulang_selesai: '',
    catatan: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await layananService.getAllKB(search);
      if (response.success && response.data) {
        // Petakan respons API ke format tampilan
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

  const handlePasienSelect = async (pasien) => {
    try {
      const response = await pasienService.getPasienById(pasien.id_pasien);
      if (response.success && response.data) {
        const fullPasien = response.data;
        const husband = fullPasien.latest_husband_data || {};

        setFormData(prev => ({
          ...prev,
          nama_ibu: fullPasien.nama,
          nik_ibu: fullPasien.nik,
          umur_ibu: fullPasien.umur,
          alamat: fullPasien.alamat,
          nomor_hp: fullPasien.no_hp,
          // Auto-fill Suami (sebagai Ayah di form KB)
          nama_ayah: husband.nama_suami || '',
          nik_ayah: husband.nik_suami || '',
          umur_ayah: husband.umur_suami || ''
        }));
      }
    } catch (error) {
      console.error('Error auto-filling patient data:', error);
      setFormData(prev => ({
        ...prev,
        nama_ibu: pasien.nama,
        nik_ibu: pasien.nik || pasien.NIK,
        umur_ibu: pasien.umur,
        alamat: pasien.alamat,
        nomor_hp: pasien.no_hp
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
      jenis_layanan: 'KB',
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
        jenis_layanan: 'KB',
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
    // Validasi field yang wajib diisi
    if (!formData.tanggal || !formData.metode || !formData.nama_ibu || !formData.nik_ibu || !formData.umur_ibu || !formData.nama_ayah || !formData.nik_ayah || !formData.alamat || !formData.nomor_hp) {
      showNotifikasi({
        type: 'error',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
      return;
    }

    // Validasi NIK
    if (formData.nik_ibu && formData.nik_ibu.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Ibu harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      return;
    }

    if (formData.nik_ayah && formData.nik_ayah.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Ayah harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      // Validasi Khusus Metode Pria
      if (formData.metode === 'MOP (Vasektomi)' || formData.metode === 'Kondom') {
        if (!formData.td_ayah || !formData.bb_ayah) {
          showNotifikasi({
            type: 'error',
            message: 'Data Suami (TD & BB) wajib diisi untuk layanan ini!',
            onConfirm: hideNotifikasi
          });
          return;
        }
      }

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
            response = await layananService.updateKB(editingId, formData);
          } else {
            response = await layananService.createKB(formData);
          }

          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: editingId ? 'Data berhasil diupdate!' : 'Data registrasi KB berhasil disimpan!',
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
          console.error('Error saving KB registration:', error);

          // Log informasi error detail untuk debugging
          if (error.data && error.data.errors) {
            console.error('Validation errors:', error.data.errors);
            const errorDetails = error.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
            console.error('Error details:\n' + errorDetails);
          }

          setError(error.message || 'Gagal menyimpan data registrasi KB');
          showNotifikasi({
            type: 'error',
            message: error.message || 'Gagal menyimpan data registrasi KB',
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
      jenis_layanan: 'KB',
      tanggal: '',
      nomor_registrasi_lama: '',
      nomor_registrasi_baru: '',
      metode: '',
      nama_ibu: '',
      nik_ibu: '',
      umur_ibu: '',
      td_ibu: '',
      bb_ibu: '',
      nama_ayah: '',
      nik_ayah: '',
      umur_ayah: '',
      td_ayah: '',
      bb_ayah: '',
      alamat: '',
      nomor_hp: '',
      kunjungan_ulang: '',
      jam_kunjungan_ulang: '08:00',
      jam_kunjungan_ulang_selesai: '',
      catatan: ''
    });
    setError('');
  };

  const handleEdit = async (id) => {
    try {
      console.log(`🔍 Mengambil data KB untuk ID: ${id}`);
      const response = await layananService.getKBById(id);
      console.log('📦 Respons diterima:', response);

      if (response && response.success) {
        const data = response.data;
        console.log('📋 KB data:', data);

        setFormData({
          jenis_layanan: 'KB',
          tanggal: data.tanggal_pemeriksaan || '',
          nomor_registrasi_lama: data.no_reg_lama || '',
          nomor_registrasi_baru: data.no_reg_baru || '',
          metode: data.metode_kb || data.metode || '',
          nama_ibu: data.nama || '',
          nik_ibu: data.nik || '',
          umur_ibu: data.umur || '',
          td_ibu: data.td_ibu || '',
          bb_ibu: data.bb_ibu || '',
          nama_ayah: data.nama_suami || '',
          nik_ayah: data.nik_suami || '',
          umur_ayah: data.umur_suami || '',
          td_ayah: data.td_ayah || '',
          bb_ayah: data.bb_ayah || '',
          alamat: data.alamat || '',
          nomor_hp: data.no_hp || '',
          kunjungan_ulang: data.kunjungan_ulang || '',
          jam_kunjungan_ulang: data.jam_kunjungan_ulang || '08:00',
          jam_kunjungan_ulang_selesai: data.jam_kunjungan_ulang_selesai || '',
          catatan: data.catatan || ''
        });
        setEditingId(id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('✅ Data form berhasil diperbarui');
      } else {
        console.error('❌ Respons tidak berhasil:', response);
        alert('Gagal mengambil data untuk diedit: ' + (response?.message || 'Error tidak diketahui'));
      }
    } catch (error) {
      console.error('❌ Gagal mengambil data:', error);
      console.error('   Error type:', error.type);
      console.error('   Error status:', error.status);
      console.error('   Error data:', error.data);
      alert('Gagal mengambil data untuk diedit: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    showNotifikasi({
      type: 'confirm-delete',
      message: 'Yakin ingin menghapus data ini?',
      onConfirm: async () => {
        hideNotifikasi();
        try {
          console.log(`🗑️ Menghapus data KB untuk ID: ${id}`);
          const response = await layananService.deleteKB(id);
          console.log('📦 Respons hapus:', response);

          if (response && response.success) {
            console.log('✅ Berhasil dihapus');
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dihapus!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            fetchRiwayatPelayanan();
          } else {
            console.error('❌ Gagal menghapus:', response);
            showNotifikasi({
              type: 'error',
              message: response?.message || 'Gagal menghapus data',
              onConfirm: hideNotifikasi,
              onCancel: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('❌ Error saat menghapus:', error);
          console.error('   Error type:', error.type);
          console.error('   Error status:', error.status);
          console.error('   Error data:', error.data);
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
    <div className="layanan-kb-page">
      {/* Header */}
      <div className="kb-header">
        <div className="kb-header-left">
          <div className="kb-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="kb-header-logo-img" />
          </div>
          <h1 className="kb-header-title">
            {showForm ? (editingId ? 'Edit Registrasi Layanan Keluarga Berencana' : 'Formulir Registrasi Layanan Keluarga Berencana') : 'Layanan Program Keluarga Berencana (KB)'}
          </h1>
        </div>
        <button className="btn-kembali-kb" onClick={handleHeaderBack}>Kembali</button>
      </div>

      {/* Konten Utama */}
      <div className="kb-content">
        {/* Sidebar */}
        <Sidebar
          activePage="kb"
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

        {/* Area Utama */}
        <main className="kb-main-area">
          {!showForm ? (
            <>
              {/* Pesan Selamat Datang & Tombol Aksi */}
              <div className="kb-welcome-section">
                <p className="kb-welcome-text">Selamat datang, {userData?.username || 'username'}!</p>

                <div className="kb-action-buttons">
                  <button className="kb-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z" />
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z" />
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>

                  <button className="kb-action-btn" onClick={handleOpenJadwalModal}>
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
              <div className="kb-riwayat-section">
                <h2 className="kb-section-title">Riwayat Pelayanan</h2>

                <div className="kb-search-bar">
                  <input
                    type="text"
                    placeholder="Cari Data"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="kb-search-input"
                  />
                  <div className="kb-filter-wrapper">
                    <button
                      className="kb-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <img src={filterIcon} alt="Filter" style={{ width: '20px', height: '20px' }} />
                    </button>
                    {showFilterDropdown && (
                      <div className="kb-filter-dropdown">
                        <div className="kb-filter-option" onClick={() => { setFilterType('Semua Data'); setShowFilterDropdown(false); }}>Semua Data</div>
                        <div className="kb-filter-option" onClick={() => { setFilterType('Hari Ini'); setShowFilterDropdown(false); }}>Hari Ini</div>
                        <div className="kb-filter-option" onClick={() => { setFilterType('Minggu Ini'); setShowFilterDropdown(false); }}>Minggu Ini</div>
                        <div className="kb-filter-option" onClick={() => { setFilterType('Bulan Ini'); setShowFilterDropdown(false); }}>Bulan Ini</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="kb-riwayat-list">
                  {isLoading ? (
                    <div className="kb-riwayat-loading">Memuat data...</div>
                  ) : filteredRiwayat.length > 0 ? (
                    filteredRiwayat.map((item) => (
                      <div key={item.id} className="kb-riwayat-item">
                        <span className="kb-riwayat-text">
                          {item.nama_pasien} - {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </span>
                        <div className="kb-riwayat-actions">
                          <button className="kb-btn-edit" onClick={() => handleEdit(item.id)}>
                            <img src={editIcon} alt="Edit" style={{ width: '18px', height: '18px' }} />
                          </button>
                          <button className="kb-btn-delete" onClick={() => handleDelete(item.id)}>
                            <img src={trashIcon} alt="Delete" style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="kb-riwayat-empty">Belum ada data pelayanan</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form Registrasi */
            <div className="kb-form-container">
              <form onSubmit={handleSubmit} className="kb-form" noValidate>
                {/* Informasi Layanan */}
                <div className="kb-form-section">
                  <h3 className="kb-form-section-title">Informasi Layanan</h3>

                  <div className="kb-form-row">
                    <div className="kb-form-group">
                      <label>Jenis Layanan</label>
                      <input
                        type="text"
                        name="jenis_layanan"
                        value={formData.jenis_layanan}
                        readOnly
                        placeholder="Pilih Jenis Layanan"
                      />
                    </div>

                    <div className="kb-form-group">
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

                  <div className="kb-form-row">
                    <div className="kb-form-group">
                      <label>Nomor Registrasi Lama</label>
                      <input
                        type="text"
                        name="nomor_registrasi_lama"
                        value={formData.nomor_registrasi_lama}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="kb-form-group">
                      <label>Nomor Registrasi Baru</label>
                      <input
                        type="text"
                        name="nomor_registrasi_baru"
                        value={formData.nomor_registrasi_baru}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="kb-form-group">
                      <label>Metode</label>
                      <select
                        name="metode"
                        value={formData.metode}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Metode</option>
                        <option value="Pil KB">Pil KB</option>
                        <option value="Suntik KB">Suntik KB</option>
                        <option value="IUD">IUD</option>
                        <option value="Implan">Implan</option>
                        <option value="Kondom">Kondom</option>
                        <option value="MOW">MOW (Tubektomi)</option>
                        <option value="MOP">MOP (Vasektomi)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="kb-form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 className="kb-form-section-title" style={{ margin: 0 }}>Data Ibu</h3>
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

                  <div className="kb-form-row">
                    <div className="kb-form-group full-width">
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
                  </div>

                  <div className="kb-form-row">
                    <div className="kb-form-group">
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

                    <div className="kb-form-group small">
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

                    <div className="kb-form-group small">
                      <label>TD</label>
                      <input
                        type="text"
                        name="td_ibu"
                        value={formData.td_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                      />
                    </div>

                    <div className="kb-form-group small">
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
                <div className="kb-form-section">
                  <h3 className="kb-form-section-title">Data Ayah</h3>

                  <div className="kb-form-row">
                    <div className="kb-form-group full-width">
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
                  </div>

                  <div className="kb-form-row">
                    <div className="kb-form-group">
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

                    <div className="kb-form-group small">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_ayah"
                        value={formData.umur_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="kb-form-group small">
                      <label>TD</label>
                      <input
                        type="text"
                        name="td_ayah"
                        value={formData.td_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                      />
                    </div>

                    <div className="kb-form-group small">
                      <label>BB</label>
                      <input
                        type="text"
                        name="bb_ayah"
                        value={formData.bb_ayah}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="kb-form-section">
                  <h3 className="kb-form-section-title">Informasi Tambahan</h3>

                  <div className="kb-form-row">
                    <div className="kb-form-group">
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

                    <div className="kb-form-group">
                      <label>Nomor HP</label>
                      <input
                        type="tel"
                        name="nomor_hp"
                        value={formData.nomor_hp}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor HP"
                        required
                      />
                    </div>

                    <div className="kb-form-group">
                      <label>Kunjungan Ulang</label>
                      <input
                        type="date"
                        name="kunjungan_ulang"
                        value={formData.kunjungan_ulang}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                      />
                    </div>

                    <div className="kb-form-group">
                      <label>Jam Kunjungan Ulang</label>
                      <input
                        type="time"
                        name="jam_kunjungan_ulang"
                        value={formData.jam_kunjungan_ulang}
                        onChange={handleInputChange}
                        placeholder="HH:MM"
                      />
                    </div>

                    <div className="kb-form-group">
                      <label>Jam Kunjungan Ulang Selesai</label>
                      <input
                        type="time"
                        name="jam_kunjungan_ulang_selesai"
                        value={formData.jam_kunjungan_ulang_selesai}
                        onChange={handleInputChange}
                        placeholder="HH:MM"
                      />
                    </div>
                  </div>

                  <div className="kb-form-row">
                    <div className="kb-form-group full-width">
                      <label>Catatan</label>
                      <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleInputChange}
                        placeholder="Tambahkan catatan"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="kb-form-actions">
                  <button type="button" className="kb-btn-batal" onClick={handleBatal}>
                    Batal
                  </button>
                  <button type="submit" className="kb-btn-simpan" disabled={isLoading}>
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
            <h2 className="jadwal-modal-title">Buat Jadwal KB</h2>
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

export default LayananKB;
