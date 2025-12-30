import { useState, useEffect } from 'react';
import './LayananImunisasi.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import filterIcon from '../../assets/images/icons/icons8-filter-100.png';
import editIcon from '../../assets/images/icons/icons8-edit-pencil-100.png';
import trashIcon from '../../assets/images/icons/icons8-trash-100.png';
import layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function LayananImunisasi({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi, onToJadwal }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const [formData, setFormData] = useState({
    jenis_layanan: 'Imunisasi',
    tanggal: '',
    nomor_registrasi: '',
    jenis_imunisasi: '',
    nama_ibu: '',
    nik_ibu: '',
    umur_ibu: '',
    alamat_ibu: '',
    nama_ayah: '',
    nik_ayah: '',
    umur_ayah: '',
    nama_bayi: '',
    tanggal_lahir: '',
    tb: '',
    bb: '',
    jadwal_selanjutnya: '',
    jam_jadwal_selanjutnya: '09:00',
    jam_jadwal_selanjutnya_selesai: '',
    nomor_hp: '',
    pengobatan: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await layananService.getAllImunisasi(search);
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
    console.log(`Input changed: ${name} = ${value}`);
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log('Updated formData:', updated);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('=== SUBMIT DATA ===');
    console.log('editingId:', editingId);
    console.log('formData being sent:', JSON.stringify(formData, null, 2));

    try {
      let response;
      if (editingId) {
        console.log('Calling updateImunisasi with:', editingId, formData);
        response = await layananService.updateImunisasi(editingId, formData);
      } else {
        response = await layananService.createImunisasi(formData);
      }

      if (response.success) {
        showNotifikasi({
          type: 'success',
          message: editingId ? 'Data berhasil diupdate!' : 'Data registrasi imunisasi berhasil disimpan!',
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
      jenis_layanan: 'Imunisasi',
      tanggal: '',
      nomor_registrasi: '',
      jenis_imunisasi: '',
      nama_ibu: '',
      nik_ibu: '',
      umur_ibu: '',
      alamat_ibu: '',
      nama_ayah: '',
      nik_ayah: '',
      umur_ayah: '',
      nama_bayi: '',
      tanggal_lahir: '',
      tb: '',
      bb: '',
      jadwal_selanjutnya: '',
      jam_jadwal_selanjutnya: '09:00',
      jam_jadwal_selanjutnya_selesai: '',
      nomor_hp: '',
      pengobatan: ''
    });
    setError('');
  };

  const handleEdit = async (id) => {
    try {
      console.log('=== LOADING DATA FOR EDIT ===');
      console.log('Loading data for id:', id);
      const response = await layananService.getImunisasiById(id);
      console.log('Received data:', response.data);
      if (response.success) {
        const data = response.data;
        setFormData({
          jenis_layanan: 'Imunisasi',
          tanggal: data.tanggal || '',
          nomor_registrasi: data.no_reg || '',
          jenis_imunisasi: data.jenis_imunisasi || '',
          nama_ibu: data.nama_istri || '',
          nik_ibu: data.nik_istri || '',
          umur_ibu: data.umur_istri || '',
          alamat_ibu: data.alamat || '',
          nama_ayah: data.nama_suami || '',
          nik_ayah: data.nik_suami || '',
          umur_ayah: data.umur_suami || '',
          nama_bayi: data.nama_bayi_balita || '',
          tanggal_lahir: data.tanggal_lahir_bayi || '',
          tb: data.tb_bayi || '',
          bb: data.bb_bayi || '',
          jadwal_selanjutnya: data.jadwal_selanjutnya || '',
          jam_jadwal_selanjutnya: data.jam_jadwal_selanjutnya || '09:00',
          jam_jadwal_selanjutnya_selesai: data.jam_jadwal_selanjutnya_selesai || '',
          nomor_hp: data.no_hp || '',
          pengobatan: data.pengobatan || ''
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
          const response = await layananService.deleteImunisasi(id);
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
    <div className="layanan-imunisasi-page">
      {/* Header */}
      <div className="imunisasi-header">
        <div className="imunisasi-header-left">
          <div className="imunisasi-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="imunisasi-header-logo-img" />
          </div>
          <h1 className="imunisasi-header-title">
            {showForm ? (editingId ? 'Edit Registrasi Layanan Imunisasi' : 'Formulir Registrasi Layanan Imunisasi') : 'Layanan Imunisasi'}
          </h1>
        </div>
        <button className="btn-kembali-imunisasi" onClick={handleHeaderBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="imunisasi-content">
        {/* Sidebar */}
        <Sidebar
          activePage="imunisasi"
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
        <main className="imunisasi-main-area">
          {!showForm ? (
            <>
              {/* Welcome Message & Action Buttons */}
              <div className="imunisasi-welcome-section">
                <p className="imunisasi-welcome-text">Selamat datang, {userData?.username || 'username'}!</p>

                <div className="imunisasi-action-buttons">
                  <button className="imunisasi-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z" />
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z" />
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>

                  <button className="imunisasi-action-btn" onClick={onToJadwal}>
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
              <div className="imunisasi-riwayat-section">
                <h2 className="imunisasi-section-title">Riwayat Pelayanan</h2>

                <div className="imunisasi-search-bar">
                  <input
                    type="text"
                    placeholder="Cari Data"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="imunisasi-search-input"
                  />
                  <div className="imunisasi-filter-wrapper">
                    <button
                      className="imunisasi-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <img src={filterIcon} alt="Filter" style={{ width: '20px', height: '20px' }} />
                    </button>
                    {showFilterDropdown && (
                      <div className="imunisasi-filter-dropdown">
                        <div className="imunisasi-filter-option">Semua Data</div>
                        <div className="imunisasi-filter-option">Hari Ini</div>
                        <div className="imunisasi-filter-option">Minggu Ini</div>
                        <div className="imunisasi-filter-option">Bulan Ini</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="imunisasi-riwayat-list">
                  {isLoading ? (
                    <div className="imunisasi-riwayat-loading">Memuat data...</div>
                  ) : riwayatPelayanan.length > 0 ? (
                    riwayatPelayanan.map((item) => (
                      <div key={item.id} className="imunisasi-riwayat-item">
                        <span className="imunisasi-riwayat-text">
                          {item.nama_pasien} - {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </span>
                        <div className="imunisasi-riwayat-actions">
                          <button className="imunisasi-btn-edit" onClick={() => handleEdit(item.id)}>
                            <img src={editIcon} alt="Edit" style={{ width: '18px', height: '18px' }} />
                          </button>
                          <button className="imunisasi-btn-delete" onClick={() => handleDelete(item.id)}>
                            <img src={trashIcon} alt="Delete" style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="imunisasi-riwayat-empty">Belum ada data pelayanan</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form Registrasi */
            <div className="imunisasi-form-container">
              <form onSubmit={handleSubmit} className="imunisasi-form">
                {/* Informasi Layanan */}
                <div className="imunisasi-form-section">
                  <h3 className="imunisasi-form-section-title">Informasi Layanan</h3>

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
                      <label>Jenis Layanan</label>
                      <input
                        type="text"
                        name="jenis_layanan"
                        value={formData.jenis_layanan}
                        readOnly
                        disabled
                        placeholder="Imunisasi"
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                      />
                    </div>

                    <div className="imunisasi-form-group">
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

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
                      <label>Nomor Registrasi</label>
                      <input
                        type="text"
                        name="nomor_registrasi"
                        value={formData.nomor_registrasi}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>Jenis Imunisasi</label>
                      <select
                        name="jenis_imunisasi"
                        value={formData.jenis_imunisasi}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Jenis</option>
                        <option value="BCG">BCG</option>
                        <option value="Hepatitis B">Hepatitis B</option>
                        <option value="Polio">Polio</option>
                        <option value="DPT">DPT</option>
                        <option value="Campak">Campak</option>
                        <option value="MMR">MMR</option>
                        <option value="Hib">Hib</option>
                        <option value="Rotavirus">Rotavirus</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="imunisasi-form-section">
                  <h3 className="imunisasi-form-section-title">Data Ibu</h3>

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
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

                    <div className="imunisasi-form-group">
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

                    <div className="imunisasi-form-group">
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

                    <div className="imunisasi-form-group">
                      <label>Alamat</label>
                      <input
                        type="text"
                        name="alamat_ibu"
                        value={formData.alamat_ibu}
                        onChange={handleInputChange}
                        placeholder="Masukkan detail alamat"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ayah */}
                <div className="imunisasi-form-section">
                  <h3 className="imunisasi-form-section-title">Data Ayah</h3>

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
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

                    <div className="imunisasi-form-group">
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

                    <div className="imunisasi-form-group">
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

                {/* Data Bayi/Balita */}
                <div className="imunisasi-form-section">
                  <h3 className="imunisasi-form-section-title">Data Bayi/Balita</h3>

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
                      <label>Nama Bayi/Balita</label>
                      <input
                        type="text"
                        name="nama_bayi"
                        value={formData.nama_bayi}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>Tanggal Lahir</label>
                      <input
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                        required
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>TB (cm)</label>
                      <input
                        type="number"
                        name="tb"
                        value={formData.tb}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        step="0.1"
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>BB (kg)</label>
                      <input
                        type="number"
                        name="bb"
                        value={formData.bb}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="imunisasi-form-section">
                  <h3 className="imunisasi-form-section-title">Informasi Tambahan</h3>

                  <div className="imunisasi-form-row">
                    <div className="imunisasi-form-group">
                      <label>Jadwal Selanjutnya</label>
                      <input
                        type="date"
                        name="jadwal_selanjutnya"
                        value={formData.jadwal_selanjutnya}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YY"
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>Jam Jadwal Selanjutnya</label>
                      <input
                        type="time"
                        name="jam_jadwal_selanjutnya"
                        value={formData.jam_jadwal_selanjutnya}
                        onChange={handleInputChange}
                        placeholder="HH:MM"
                      />
                    </div>

                    <div className="imunisasi-form-group">
                      <label>Jam Jadwal Selanjutnya Selesai</label>
                      <input
                        type="time"
                        name="jam_jadwal_selanjutnya_selesai"
                        value={formData.jam_jadwal_selanjutnya_selesai}
                        onChange={handleInputChange}
                        placeholder="HH:MM"
                      />
                    </div>

                    <div className="imunisasi-form-group">
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
                  </div>
                </div>

                {/* Form Actions */}
                <div className="imunisasi-form-actions">
                  <button type="button" className="imunisasi-btn-batal" onClick={handleBatal}>
                    Batal
                  </button>
                  <button type="submit" className="imunisasi-btn-simpan" disabled={isLoading}>
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

export default LayananImunisasi;
