import { useState, useEffect } from 'react';
import './Jadwal.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import jadwalService from '../../services/jadwal.service';
import pasienService from '../../services/pasien.service';

function Jadwal({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [jadwalList, setJadwalList] = useState([]);
  const [pasienList, setPasienList] = useState([]);
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterLayanan, setFilterLayanan] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  // Form state
  const [formData, setFormData] = useState({
    id_pasien: '',
    jenis_layanan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });

  // Load data jadwal and patients
  useEffect(() => {
    fetchJadwal();
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const response = await pasienService.getAllPasien();
      if (response.success) {
        setPasienList(response.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchJadwal = async (bulan = '', tahun = '', layanan = '') => {
    try {
      const filters = {};
      if (bulan) filters.bulan = bulan;
      if (tahun) filters.tahun = tahun;
      if (layanan) filters.layanan = layanan;

      const response = await jadwalService.getAllJadwal(filters);

      if (response.success) {
        setJadwalList(response.data);
      } else {
        setJadwalList([]);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal memuat data jadwal',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleFilter = () => {
    fetchJadwal(filterBulan, filterTahun, filterLayanan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('🔍 Form data before validation:', formData);

      // Validation
      if (!formData.id_pasien || !formData.jenis_layanan || !formData.tanggal || !formData.jam_mulai) {
        console.error('❌ Validation failed - missing fields:', {
          id_pasien: !!formData.id_pasien,
          jenis_layanan: !!formData.jenis_layanan,
          tanggal: !!formData.tanggal,
          jam_mulai: !!formData.jam_mulai
        });
        alert('Mohon lengkapi: Pasien, Layanan, Tanggal, Jam Mulai');
        return;
      }

      const payload = {
        id_pasien: formData.id_pasien,
        jenis_layanan: formData.jenis_layanan,
        tanggal: formData.tanggal,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai || null
      };

      console.log('📤 Jadwal.js Submit Payload:', payload);
      console.log('📤 Payload stringified:', JSON.stringify(payload));

      if (editingJadwal) {
        // Update jadwal
        console.log('🔄 Updating existing jadwal...');
        await jadwalService.updateJadwal(editingJadwal.id_jadwal, payload);
        showNotifikasi({
          type: 'success',
          message: 'Jadwal berhasil diperbarui!',
          autoClose: true,
          autoCloseDuration: 2000,
          onConfirm: hideNotifikasi
        });
      } else {
        // Create jadwal
        console.log('✨ Creating new jadwal...');
        await jadwalService.createJadwal(payload);
        showNotifikasi({
          type: 'success',
          message: 'Jadwal berhasil ditambahkan!',
          autoClose: true,
          autoCloseDuration: 2000,
          onConfirm: hideNotifikasi
        });
      }

      // Reset form
      setFormData({
        id_pasien: '',
        jenis_layanan: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: ''
      });
      setShowAddModal(false);
      setEditingJadwal(null);
      fetchJadwal();
    } catch (error) {
      console.error('Error saving jadwal:', error);
      console.error('Error data:', error.data);
      console.error('Error status:', error.status);

      // Format validation errors for display
      let errorMessage = 'Gagal menyimpan jadwal';
      let errorDetail = '';

      if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
        errorMessage = 'Validasi gagal:';
        errorDetail = error.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        console.error('Validation errors:', errorDetail);
      }

      showNotifikasi({
        type: 'error',
        message: errorMessage,
        detail: errorDetail,
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleEdit = (jadwal) => {
    setEditingJadwal(jadwal);
    setFormData({
      id_pasien: jadwal.id_pasien || '',
      jenis_layanan: jadwal.jenis_layanan,
      tanggal: jadwal.tanggal,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    showNotifikasi({
      type: 'confirm-delete',
      onConfirm: async () => {
        hideNotifikasi();
        await executeDelete(id);
      },
      onCancel: hideNotifikasi
    });
  };

  const executeDelete = async (id) => {
    try {
      await jadwalService.deleteJadwal(id);
      showNotifikasi({
        type: 'success',
        message: 'Jadwal berhasil dihapus!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: hideNotifikasi
      });
      fetchJadwal();
      // }
    } catch (error) {
      console.error('Error deleting jadwal:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal menghapus jadwal',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="jadwal-page">
      {/* Header */}
      <div className="jadwal-header">
        <div className="jadwal-header-left">
          <div className="jadwal-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="jadwal-header-logo-img" />
          </div>
          <h1 className="jadwal-header-title">Jadwal</h1>
        </div>
        <button className="btn-kembali-jadwal" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="jadwal-content">
        {/* Sidebar */}
        <Sidebar
          activePage="jadwal"
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
        <main className="jadwal-main-area">
          {/* Filter Section */}
          <div className="jadwal-filter-section">
            <div className="jadwal-filter-group">
              <div className="filter-item">
                <label>Bulan</label>
                <select
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(e.target.value)}
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

              <div className="filter-item">
                <label>Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                >
                  <option value="">Pilih Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Layanan</label>
                <select
                  value={filterLayanan}
                  onChange={(e) => setFilterLayanan(e.target.value)}
                >
                  <option value="">Pilih Layanan</option>
                  <option value="ANC">ANC</option>
                  <option value="KB">KB</option>
                  <option value="Imunisasi">Imunisasi</option>
                  <option value="Persalinan">Persalinan</option>
                  <option value="Kunjungan Pasien">Kunjungan Pasien</option>
                </select>
              </div>

              <button className="btn-filter" onClick={handleFilter}>
                Filter
              </button>

              <button
                className="btn-buat-jadwal"
                onClick={() => {
                  setFormData({
                    id_pasien: '',
                    id_petugas: '',
                    jenis_layanan: '',
                    tanggal: '',
                    jam_mulai: '',
                    jam_selesai: ''
                  });
                  setEditingJadwal(null);
                  setShowAddModal(true);
                }}
              >
                + Buat Jadwal
              </button>
            </div>
          </div>

          {/* Jadwal List Card */}
          <div className="jadwal-list-card">
            <div className="jadwal-list-inner">
              {jadwalList.length > 0 ? (
                <>
                  {/* Group by date */}
                  {Object.entries(
                    jadwalList.reduce((groups, jadwal) => {
                      const date = jadwal.tanggal;
                      if (!groups[date]) groups[date] = [];
                      groups[date].push(jadwal);
                      return groups;
                    }, {})
                  ).map(([date, items]) => (
                    <div key={date}>
                      <div className="jadwal-date-header">{formatDate(date)}</div>
                      {items.map((jadwal) => (
                        <div key={jadwal.id_jadwal} className="jadwal-item">
                          <div className="jadwal-item-details">
                            <span className="jadwal-item-text">
                              {jadwal.jenis_layanan} - {jadwal.jam_mulai}
                              {jadwal.jam_selesai && ` s/d ${jadwal.jam_selesai}`}
                            </span>
                            <span className="jadwal-item-pasien">
                              {jadwal.nama_pasien || 'Pasien tidak diketahui'}
                            </span>
                          </div>
                          <div className="jadwal-item-actions">
                            <button
                              className="jadwal-btn-edit"
                              onClick={() => handleEdit(jadwal)}
                              title="Edit"
                            >
                              <img src={editIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              className="jadwal-btn-delete"
                              onClick={() => handleDelete(jadwal.id_jadwal)}
                              title="Hapus"
                            >
                              <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <div className="jadwal-empty-state">
                  <p>Belum ada jadwal. Buat jadwal baru untuk memulai.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="jadwal-modal-overlay" onClick={() => { setShowAddModal(false); setEditingJadwal(null); }}>
          <div className="jadwal-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="jadwal-modal-title">
              {editingJadwal ? 'Edit Jadwal' : 'Buat Jadwal Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="jadwal-modal-grid">
                <div className="jadwal-modal-form-group full-width">
                  <label>Jenis Layanan *</label>
                  <select
                    name="jenis_layanan"
                    value={formData.jenis_layanan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Jenis Layanan</option>
                    <option value="ANC">ANC</option>
                    <option value="KB">KB</option>
                    <option value="Imunisasi">Imunisasi</option>
                    <option value="Persalinan">Persalinan</option>
                    <option value="Kunjungan Pasien">Kunjungan Pasien</option>
                  </select>
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Tanggal *</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    placeholder="Masukkan"
                    required
                  />
                </div>

                <div className="jadwal-modal-form-group">
                  <label>Jam *</label>
                  <input
                    type="time"
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleInputChange}
                    placeholder="XX:XX"
                    required
                  />
                </div>

                <div className="jadwal-modal-form-group">
                  <label>&nbsp;</label>
                  <div className="time-separator">
                    <span>-</span>
                    <input
                      type="time"
                      name="jam_selesai"
                      value={formData.jam_selesai}
                      onChange={handleInputChange}
                      placeholder="XX:XX"
                    />
                  </div>
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Nama Pasien *</label>
                  {editingJadwal ? (
                    <input
                      type="text"
                      value={editingJadwal.nama_pasien || 'Pasien tidak diketahui'}
                      disabled
                      className="form-control-disabled"
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  ) : (
                    <select
                      name="id_pasien"
                      value={formData.id_pasien}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Pasien</option>
                      {pasienList.map(pasien => (
                        <option key={pasien.id_pasien} value={pasien.id_pasien}>
                          {pasien.nama}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Penanggung Jawab</label>
                  <input
                    type="text"
                    value={userData?.nama_lengkap || 'Tidak diketahui'}
                    disabled
                    placeholder="Akan diisi otomatis"
                  />
                </div>
              </div>

              <div className="jadwal-modal-actions">
                <button
                  type="button"
                  className="jadwal-btn-modal-batal"
                  onClick={() => { setShowAddModal(false); setEditingJadwal(null); }}
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

export default Jadwal;
