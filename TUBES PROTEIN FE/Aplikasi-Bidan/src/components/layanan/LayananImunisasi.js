import { useState, useEffect } from 'react';
import './LayananImunisasi.css';
import Sidebar from '../shared/Sidebar';

function LayananImunisasi({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [showForm, setShowForm] = useState(false);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Informasi Layanan
    jenis_layanan: 'Imunisasi',
    tanggal: '',
    nomor_registrasi: '',
    jenis_imunisasi: '',
    
    // Data Ibu
    nama_ibu: '',
    nik_ibu: '',
    umur_ibu: '',
    alamat_ibu: '',
    
    // Data Ayah
    nama_ayah: '',
    nik_ayah: '',
    umur_ayah: '',
    
    // Data Bayi/Balita
    nama_bayi: '',
    tanggal_lahir: '',
    tb: '',
    bb: '',
    
    // Informasi Tambahan
    jadwal_selanjutnya: '',
    nomor_hp: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async () => {
    try {
      // TODO: Replace with actual API call GET /pemeriksaan?jenis_layanan=Imunisasi
      // const response = await fetch('https://api.bidan-digital.com/v1/pemeriksaan?jenis_layanan=Imunisasi', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      // setRiwayatPelayanan(data);
      
      // Mock data
      const mockData = [
        { id: '1', nama_pasien: 'Data Pasien', tanggal: '2025-01-15' },
        { id: '2', nama_pasien: 'Data Pasien', tanggal: '2025-01-14' },
        { id: '3', nama_pasien: 'Data Pasien', tanggal: '2025-01-13' }
      ];
      setRiwayatPelayanan(mockData);
    } catch (error) {
      console.error('Error fetching riwayat:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search filter
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Replace with actual API call POST /pemeriksaan
      // const response = await fetch('https://api.bidan-digital.com/v1/pemeriksaan', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     id_pasien: formData.id_pasien,
      //     jenis_layanan: 'Imunisasi',
      //     subjektif: `Nama Bayi: ${formData.nama_bayi}, Tanggal Lahir: ${formData.tanggal_lahir}`,
      //     objektif: `TB: ${formData.tb} cm, BB: ${formData.bb} kg`,
      //     analisa: `Jenis Imunisasi: ${formData.jenis_imunisasi}`,
      //     tatalaksana: `Jadwal selanjutnya: ${formData.jadwal_selanjutnya}`
      //   })
      // });
      
      console.log('Submit Imunisasi Registration:', formData);
      alert('Data registrasi imunisasi berhasil disimpan!');
      setShowForm(false);
      resetForm();
      fetchRiwayatPelayanan();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Gagal menyimpan data registrasi');
    }
  };

  const handleBatal = () => {
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
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
      nomor_hp: ''
    });
  };

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit:', id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    
    try {
      // TODO: API call DELETE /pemeriksaan/{id}
      console.log('Delete:', id);
      alert('Data berhasil dihapus!');
      fetchRiwayatPelayanan();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="layanan-imunisasi-page">
      {/* Header */}
      <div className="imunisasi-header">
        <div className="imunisasi-header-left">
          <div className="imunisasi-header-logo">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="25" fill="#E91E8C"/>
              <path d="M25 15C25 18.866 21.866 22 18 22C14.134 22 11 18.866 11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15Z" fill="white"/>
              <path d="M25 25C28.866 25 32 28.134 32 32C32 35.866 28.866 39 25 39C21.134 39 18 35.866 18 32C18 28.134 21.134 25 25 25Z" fill="white"/>
            </svg>
          </div>
          <h1 className="imunisasi-header-title">
            {showForm ? 'Formulir Registrasi Layanan Imunisasi' : 'Layanan Imunisasi'}
          </h1>
        </div>
        <button className="btn-kembali-imunisasi" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="imunisasi-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="imunisasi"
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
        <main className="imunisasi-main-area">
          {!showForm ? (
            <>
              {/* Welcome Message & Action Buttons */}
              <div className="imunisasi-welcome-section">
                <p className="imunisasi-welcome-text">Selamat datang, {userData?.username || 'username'}!</p>
                
                <div className="imunisasi-action-buttons">
                  <button className="imunisasi-action-btn">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z"/>
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z"/>
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  
                  <button className="imunisasi-action-btn" onClick={() => setShowForm(true)}>
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
                  <button className="imunisasi-search-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M9 3.5C5.686 3.5 3 6.186 3 9.5C3 12.814 5.686 15.5 9 15.5C10.386 15.5 11.678 15.013 12.707 14.207L16.293 17.793L17.707 16.379L14.121 12.793C14.957 11.754 15.5 10.437 15.5 9C15.5 5.686 12.814 3 9 3C9 3 9 3.5 9 3.5ZM9 5C11.761 5 14 7.239 14 10C14 12.761 11.761 15 9 15C6.239 15 4 12.761 4 10C4 7.239 6.239 5 9 5Z"/>
                    </svg>
                  </button>
                </div>

                <div className="imunisasi-riwayat-list">
                  {riwayatPelayanan.map((item) => (
                    <div key={item.id} className="imunisasi-riwayat-item">
                      <span className="imunisasi-riwayat-text">Data Pasien</span>
                      <div className="imunisasi-riwayat-actions">
                        <button className="imunisasi-btn-edit" onClick={() => handleEdit(item.id)}>✏️</button>
                        <button className="imunisasi-btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
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
                        onChange={handleInputChange}
                        placeholder="Pilih Jenis Layanan"
                        required
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
                  <button type="submit" className="imunisasi-btn-simpan">
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

export default LayananImunisasi;
