import { useState, useEffect } from 'react';
import './LayananANC.css';
import Sidebar from '../shared/Sidebar';

function LayananANC({ onBack, userData, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [showForm, setShowForm] = useState(false);
  const [riwayatPelayanan, setRiwayatPelayanan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form data

  const [formData, setFormData] = useState({
    // Informasi Layanan
    jenis_layanan: 'ANC',
    tanggal: '',
    nomor_registrasi_lama: '',
    nomor_registrasi_baru: '',
    tindakan: '',
    
    // Data Ibu
    nama_ibu: '',
    nik_ibu: '',
    umur_ibu: '',
    
    // Data Ayah
    nama_ayah: '',
    nik_ayah: '',
    umur_ayah: '',
    
    // Informasi Tambahan
    alamat: '',
    hpht: '',
    hpl: '',
    
    // Hasil Pemeriksaan
    hasil_pemeriksaan: '',
    keterangan: ''
  });

  useEffect(() => {
    fetchRiwayatPelayanan();
  }, []);

  const fetchRiwayatPelayanan = async () => {
    try {
      // TODO: Replace with actual API call GET /pemeriksaan?jenis_layanan=ANC
      // const response = await fetch('https://api.bidan-digital.com/v1/pemeriksaan?jenis_layanan=ANC', {
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
      //     jenis_layanan: 'ANC',
      //     subjektif: `HPHT: ${formData.hpht}, HPL: ${formData.hpl}`,
      //     objektif: formData.hasil_pemeriksaan,
      //     analisa: formData.tindakan,
      //     tatalaksana: formData.keterangan
      //   })
      // });
      
      console.log('Submit ANC Registration:', formData);
      alert('Data registrasi ANC berhasil disimpan!');
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
      jenis_layanan: 'ANC',
      tanggal: '',
      nomor_registrasi_lama: '',
      nomor_registrasi_baru: '',
      tindakan: '',
      nama_ibu: '',
      nik_ibu: '',
      umur_ibu: '',
      nama_ayah: '',
      nik_ayah: '',
      umur_ayah: '',
      alamat: '',
      hpht: '',
      hpl: '',
      hasil_pemeriksaan: '',
      keterangan: ''
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
    <div className="layanan-anc-page">
      {/* Header */}
      <div className="anc-header">
        <div className="anc-header-left">
          <div className="anc-header-logo">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="25" fill="#E91E8C"/>
              <path d="M25 15C25 18.866 21.866 22 18 22C14.134 22 11 18.866 11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15Z" fill="white"/>
              <path d="M25 25C28.866 25 32 28.134 32 32C32 35.866 28.866 39 25 39C21.134 39 18 35.866 18 32C18 28.134 21.134 25 25 25Z" fill="white"/>
            </svg>
          </div>
          <h1 className="anc-header-title">
            {showForm ? 'Formulir Registrasi Layanan Antenatal Care (ANC)' : 'Layanan Antenatal Care (ANC)'}
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
          onTambahPasien={onToTambahPasien}
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
                  <button className="anc-action-btn">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                      <path d="M20 10C20 14.866 15.866 18 11 18C6.134 18 2 14.866 2 10C2 5.134 6.134 2 11 2C15.866 2 20 5.134 20 10Z"/>
                      <path d="M11 19C4.582 19 0 23.582 0 29V35H22V29C22 23.582 17.418 19 11 19Z"/>
                    </svg>
                    <span>Tambah Pasien</span>
                  </button>
                  
                  <button className="anc-action-btn" onClick={() => setShowForm(true)}>
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
                  <button className="anc-search-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M9 3.5C5.686 3.5 3 6.186 3 9.5C3 12.814 5.686 15.5 9 15.5C10.386 15.5 11.678 15.013 12.707 14.207L16.293 17.793L17.707 16.379L14.121 12.793C14.957 11.754 15.5 10.437 15.5 9C15.5 5.686 12.814 3 9 3C9 3 9 3.5 9 3.5ZM9 5C11.761 5 14 7.239 14 10C14 12.761 11.761 15 9 15C6.239 15 4 12.761 4 10C4 7.239 6.239 5 9 5Z"/>
                    </svg>
                  </button>
                </div>

                <div className="anc-riwayat-list">
                  {riwayatPelayanan.map((item) => (
                    <div key={item.id} className="anc-riwayat-item">
                      <span className="anc-riwayat-text">Data Pasien</span>
                      <div className="anc-riwayat-actions">
                        <button className="anc-btn-edit" onClick={() => handleEdit(item.id)}>✏️</button>
                        <button className="anc-btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
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
                  <button type="submit" className="anc-btn-simpan">
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

export default LayananANC;
