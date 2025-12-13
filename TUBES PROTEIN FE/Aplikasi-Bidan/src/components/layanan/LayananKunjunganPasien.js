import { useState, useEffect } from 'react';
import './LayananKunjunganPasien.css';
import Sidebar from '../shared/Sidebar';

function LayananKunjunganPasien({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [formData, setFormData] = useState({
    // Informasi Layanan
    jenis_layanan: 'Kunjungan',
    tanggal_kunjungan: '',
    keluhan: '',
    
    // Data Diri Pasien
    nama_pasien: '',
    nik: '',
    umur: '',
    alamat: '',
    
    // Data Kesehatan
    tekanan_darah: '',
    suhu_tubuh: '',
    berat_badan: '',
    tinggi_badan: '',
    
    // Informasi Tambahan
    diagnosis: '',
    tindakan: '',
    catatan: ''
  });

  const [riwayatPelayanan, setRiwayatPelayanan] = useState([
    { id: 1, nama_pasien: 'Siti Nurhaliza', tanggal: '2024-01-15' },
    { id: 2, nama_pasien: 'Dewi Sartika', tanggal: '2024-01-14' },
    { id: 3, nama_pasien: 'Kartini Wijaya', tanggal: '2024-01-13' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async () => {
    try {
      // TODO: Uncomment saat integrasi API
      /*
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.bidan-digital.com/v1/pemeriksaan?jenis_layanan=Kunjungan', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiwayatPelayanan(data.data || []);
      }
      */
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRiwayat = riwayatPelayanan.filter(item =>
    item.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Uncomment saat integrasi API
      /*
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.bidan-digital.com/v1/pemeriksaan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Data kunjungan berhasil disimpan!');
        resetForm();
        fetchRiwayatPelayanan();
      } else {
        alert('Gagal menyimpan data kunjungan');
      }
      */
      
      // Simulasi sukses
      alert('Data kunjungan berhasil disimpan!');
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleBatal = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      jenis_layanan: 'Kunjungan',
      tanggal_kunjungan: '',
      keluhan: '',
      nama_pasien: '',
      nik: '',
      umur: '',
      alamat: '',
      tekanan_darah: '',
      suhu_tubuh: '',
      berat_badan: '',
      tinggi_badan: '',
      diagnosis: '',
      tindakan: '',
      catatan: ''
    });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      ...formData,
      nama_pasien: item.nama_pasien,
      tanggal_kunjungan: item.tanggal
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        // TODO: Uncomment saat integrasi API
        /*
        const token = localStorage.getItem('token');
        const response = await fetch(`https://api.bidan-digital.com/v1/pemeriksaan/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('Data berhasil dihapus!');
          fetchRiwayatPelayanan();
        } else {
          alert('Gagal menghapus data');
        }
        */
        
        // Simulasi sukses
        setRiwayatPelayanan(riwayatPelayanan.filter(item => item.id !== id));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  return (
    <div className="layanan-kunjungan-page">
      {/* Header */}
      <div className="kunjungan-header">
        <div className="kunjungan-header-left">
          <div className="kunjungan-header-logo">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="25" fill="#E91E8C"/>
              <path d="M25 15C25 18.866 21.866 22 18 22C14.134 22 11 18.866 11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15Z" fill="white"/>
              <path d="M25 25C28.866 25 32 28.134 32 32C32 35.866 28.866 39 25 39C21.134 39 18 35.866 18 32C18 28.134 21.134 25 25 25Z" fill="white"/>
            </svg>
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
          onTambahPasien={onToTambahPasien}
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
                  <button className="kunjungan-action-btn">
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
                  <button className="kunjungan-search-btn">
                    🔍
                  </button>
                </div>

                <div className="kunjungan-riwayat-list">
                  {filteredRiwayat.map((item) => (
                    <div key={item.id} className="kunjungan-riwayat-item">
                      <span className="kunjungan-riwayat-text">
                        {item.nama_pasien} - {item.tanggal}
                      </span>
                      <div className="kunjungan-riwayat-actions">
                        <button 
                          className="kunjungan-btn-edit"
                          onClick={() => handleEdit(item)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="kunjungan-btn-delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
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
                  <button type="submit" className="kunjungan-btn-simpan">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LayananKunjunganPasien;
