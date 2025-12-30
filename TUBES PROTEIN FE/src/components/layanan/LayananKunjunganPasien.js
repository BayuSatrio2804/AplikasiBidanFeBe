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
    jenis_layanan: 'Kunjungan Pasien',
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
          id: item.id,
          nama_pasien: item.nama_pasien || 'Pasien',
          tanggal: item.tanggal,
          jenis_layanan: item.jenis_layanan
        }));
        setRiwayatPelayanan(mappedData);
      } else {
        setRiwayatPelayanan([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRiwayatPelayanan([]);
      // Only show error if it's not a simple empty result
      if (error.response?.status !== 404) {
        showNotifikasi({
          type: 'error',
          message: 'Gagal memuat data riwayat pelayanan',
          onConfirm: hideNotifikasi
        });
      }
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

    // Validasi NIK - hanya angka dan maksimal 16 digit
    if (name === 'nik_pasien' || name === 'nik_wali') {
      // Hapus karakter non-angka
      const numericValue = value.replace(/[^0-9]/g, '');
      // Batasi maksimal 16 digit
      const limitedValue = numericValue.slice(0, 16);

      setFormData({
        ...formData,
        [name]: limitedValue
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.tanggal || !formData.no_reg || !formData.jenis_kunjungan || !formData.nama_pasien || !formData.umur_pasien || !formData.bb_pasien || !formData.td_pasien || !formData.keluhan || !formData.diagnosa || !formData.terapi_obat) {
      showNotifikasi({
        type: 'error',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
      return;
    }

    // Validasi NIK sebelum submit
    if (formData.nik_pasien && formData.nik_pasien.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Pasien harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      return;
    }

    if (formData.nik_wali && formData.nik_wali.length > 0 && formData.nik_wali.length !== 16) {
      showNotifikasi({
        type: 'error',
        message: 'NIK Wali harus 16 digit!',
        onConfirm: hideNotifikasi
      });
      return;
    }

    showNotifikasi({
      type: editingId ? 'confirm-edit' : 'confirm-save',
      onConfirm: async () => {
        hideNotifikasi();
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
              message: editingId ? 'Data kunjungan pasien berhasil diupdate!' : 'Data kunjungan pasien berhasil disimpan!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            resetForm();
            fetchRiwayatPelayanan();
          } else {
            throw new Error(response.message || 'Gagal menyimpan data');
          }
        } catch (error) {
          console.error('Error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat menyimpan data';
          setError(errorMessage);
          showNotifikasi({
            type: 'error',
            message: errorMessage,
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
    console.log('handleBatal clicked!');
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      jenis_layanan: 'Kunjungan Pasien',
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
      setIsLoading(true);
      console.log('Editing item:', item);
      console.log('Item ID:', item.id);
      const response = await layananService.getKunjunganPasienById(item.id);
      if (response.success) {
        const data = response.data;
        setFormData({
          jenis_layanan: data.jenis_layanan || 'Kunjungan Pasien',
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
      } else {
        throw new Error(response.message || 'Gagal mengambil data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotifikasi({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Gagal mengambil data untuk diedit',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('handleDelete clicked with id:', id);
    console.log('About to show delete confirmation...');
    showNotifikasi({
      type: 'confirm-delete',
      message: 'Yakin ingin menghapus data ini?',
      onConfirm: async () => {
        console.log('Delete confirmed by user');
        hideNotifikasi();
        try {
          console.log(`🗑️ Deleting Kunjungan Pasien data for ID: ${id}`);
          const response = await layananService.deleteKunjunganPasien(id);
          console.log('📦 Delete response:', response);

          if (response && response.success) {
            console.log('✅ Delete successful');
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dihapus!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            fetchRiwayatPelayanan();
          } else {
            console.error('❌ Delete failed:', response);
            showNotifikasi({
              type: 'error',
              message: response?.message || 'Gagal menghapus data',
              onConfirm: hideNotifikasi,
              onCancel: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('❌ Error deleting:', error);
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
    <div className="layanan-kunjungan-page">
      {/* Header */}
      <div className="kunjungan-header">
        <div className="kunjungan-header-left">
          <div className="kunjungan-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="kunjungan-header-logo-img" />
          </div>
          <h1 className="kunjungan-header-title">Layanan Kunjungan Pasien</h1>
        </div>
        <button className="btn-kembali-kunjungan" onClick={handleHeaderBack}>Kembali</button>
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
                <p className="kunjungan-welcome-text">Selamat datang, {userData?.nama_lengkap || userData?.username || 'Pengguna'}!</p>
                <div className="kunjungan-action-buttons">
                  <button className="kunjungan-action-btn" onClick={() => setShowForm(true)}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="white" opacity="0.3" />
                      <path d="M20 10V30M10 20H30" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  <button className="kunjungan-action-btn" onClick={onToJadwal}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="white" opacity="0.3" />
                      <rect x="12" y="12" width="16" height="16" rx="2" stroke="white" strokeWidth="2" />
                      <path d="M16 12V8M24 12V8M12 16H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
                      <img src={filterIcon} alt="Filter" style={{ width: '20px', height: '20px' }} />
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
                            <img src={editIcon} alt="Edit" style={{ width: '18px', height: '18px', pointerEvents: 'none' }} />
                          </button>
                          <button
                            className="kunjungan-btn-delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <img src={trashIcon} alt="Delete" style={{ width: '18px', height: '18px', pointerEvents: 'none' }} />
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
              <form className="kunjungan-form" onSubmit={handleSubmit} noValidate>
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
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="kunjungan-form-group">
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
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Nomor Registrasi</label>
                      <input
                        type="text"
                        name="no_reg"
                        value={formData.no_reg}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Jenis Kunjungan</label>
                      <select
                        name="jenis_kunjungan"
                        value={formData.jenis_kunjungan}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Jenis Kunjungan</option>
                        <option value="Bayi">Bayi</option>
                        <option value="Anak">Anak</option>
                        <option value="Hamil">Hamil</option>
                        <option value="Nifas">Nifas</option>
                        <option value="KB">KB</option>
                        <option value="Lansia">Lansia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Pasien */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Data Pasien</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Nama Pasien</label>
                      <input
                        type="text"
                        name="nama_pasien"
                        value={formData.nama_pasien}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_pasien"
                        value={formData.nik_pasien}
                        onChange={handleInputChange}
                        placeholder="16 digit angka"
                        maxLength="16"
                        pattern="[0-9]{16}"
                        title="NIK harus 16 digit angka"
                        required
                      />
                      {formData.nik_pasien && formData.nik_pasien.length < 16 && (
                        <small style={{ color: 'red', fontSize: '12px' }}>NIK harus 16 digit ({formData.nik_pasien.length}/16)</small>
                      )}
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_pasien"
                        value={formData.umur_pasien}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>BB (kg)</label>
                      <input
                        type="text"
                        name="bb_pasien"
                        value={formData.bb_pasien}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>TD</label>
                      <input
                        type="text"
                        name="td_pasien"
                        value={formData.td_pasien}
                        onChange={handleInputChange}
                        placeholder="Masukkan"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Data Wali Pasien */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Data Wali Pasien</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Nama Wali</label>
                      <input
                        type="text"
                        name="nama_wali"
                        value={formData.nama_wali}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik_wali"
                        value={formData.nik_wali}
                        onChange={handleInputChange}
                        placeholder="16 digit angka (opsional)"
                        maxLength="16"
                        pattern="[0-9]{16}"
                        title="NIK harus 16 digit angka"
                      />
                      {formData.nik_wali && formData.nik_wali.length > 0 && formData.nik_wali.length < 16 && (
                        <small style={{ color: 'red', fontSize: '12px' }}>NIK harus 16 digit ({formData.nik_wali.length}/16)</small>
                      )}
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur_wali"
                        value={formData.umur_wali}
                        onChange={handleInputChange}
                        placeholder="Masukkan data"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="kunjungan-form-section">
                  <h3 className="kunjungan-form-section-title">Informasi Tambahan</h3>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Keluhan</label>
                      <textarea
                        name="keluhan"
                        value={formData.keluhan}
                        onChange={handleInputChange}
                        placeholder="Masukkan detail keluhan"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Diagnosa</label>
                      <textarea
                        name="diagnosa"
                        value={formData.diagnosa}
                        onChange={handleInputChange}
                        placeholder="Masukkan detail diagnosa"
                        required
                      />
                    </div>
                  </div>
                  <div className="kunjungan-form-row">
                    <div className="kunjungan-form-group">
                      <label>Terapi Obat yang Diberikan</label>
                      <textarea
                        name="terapi_obat"
                        value={formData.terapi_obat}
                        onChange={handleInputChange}
                        placeholder="Tambahkan catatan terapi obat yang diberikan"
                        required
                      />
                    </div>
                    <div className="kunjungan-form-group">
                      <label>Keterangan</label>
                      <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleInputChange}
                        placeholder="Tambahkan Keterangan"
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
        show={notifikasi.show}
        onConfirm={notifikasi.onConfirm}
        onCancel={notifikasi.onCancel}
        autoClose={notifikasi.autoClose}
        autoCloseDuration={notifikasi.autoCloseDuration}
      />
    </div>
  );
}

export default LayananKunjunganPasien;
