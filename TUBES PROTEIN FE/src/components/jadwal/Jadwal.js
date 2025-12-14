import { useState, useEffect } from 'react';
import './Jadwal.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import jadwalService from '../../services/jadwal.service';

function Jadwal({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [jadwalList, setJadwalList] = useState([]);
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterLayanan, setFilterLayanan] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  
  // Form state
  const [formData, setFormData] = useState({
    id_pasien: '',
    id_petugas: '',
    jenis_layanan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });

  // Load data jadwal
  useEffect(() => {
    fetchJadwal();
  }, []);

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
      if (editingJadwal) {
        // Update jadwal
        await jadwalService.updateJadwal(editingJadwal.id_jadwal, formData);
        showNotifikasi({
          type: 'success',
          message: 'Jadwal berhasil diperbarui!',
          autoClose: true,
          autoCloseDuration: 2000,
          onConfirm: hideNotifikasi
        });
      } else {
        // Create jadwal
        await jadwalService.createJadwal(formData);
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
        id_petugas: '',
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
      showNotifikasi({
        type: 'error',
        message: 'Gagal menyimpan jadwal',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  const handleEdit = (jadwal) => {
    setEditingJadwal(jadwal);
    setFormData({
      id_pasien: jadwal.id_pasien || '',
      id_petugas: jadwal.id_petugas || '',
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
                  <div className="jadwal-date-header">DD/MM/YY</div>
                  {jadwalList.map((jadwal) => (
                    <div key={jadwal.id_jadwal} className="jadwal-item">
                      <span className="jadwal-item-text">Data Jadwal</span>
                      <div className="jadwal-item-actions">
                        <button 
                          className="jadwal-btn-edit"
                          onClick={() => handleEdit(jadwal)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="jadwal-btn-delete"
                          onClick={() => handleDelete(jadwal.id_jadwal)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="jadwal-empty-state">
                  Data tidak ditemukan. Harap lakukan filtering terlebih dahulu.
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
                    <option value="Nifas">Nifas</option>
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
                  <input
                    type="text"
                    name="id_pasien"
                    value={formData.id_pasien}
                    onChange={handleInputChange}
                    placeholder="Masukkan"
                    required
                  />
                </div>

                <div className="jadwal-modal-form-group full-width">
                  <label>Petugas/Penanggung Jawab *</label>
                  <input
                    type="text"
                    name="id_petugas"
                    value={formData.id_petugas}
                    onChange={handleInputChange}
                    placeholder="Masukkan"
                    required
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
