import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import './TambahPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasienService';

function TambahPasien({ 
  onBack,
  onSuccess,
  onToRiwayatDataMasuk, 
  onToRiwayatMasukAkun, 
  onToProfil, 
  onToTambahPasien, 
  onToTambahPengunjung, 
  onToBuatLaporan, 
  onToPersalinan, 
  onToANC, 
  onToKB, 
  onToImunisasi 
}) {
  const [formData, setFormData] = useState({
    nama: '',
    NIK: '',
    umur: '',
    alamat: '',
    no_hp: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mulai mengetik
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.nama || !formData.NIK || !formData.umur || !formData.alamat || !formData.no_hp) {
      setError('Semua field harus diisi');
      return;
    }

    if (formData.NIK.length !== 16) {
      setError('NIK harus 16 digit');
      return;
    }

    if (isNaN(formData.umur) || formData.umur < 0 || formData.umur > 150) {
      setError('Umur tidak valid');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await pasienService.createPasien(formData);
      
      if (result.success) {
        setSuccess(true);
        alert('Data pasien berhasil ditambahkan!');
        
        // Reset form
        setFormData({
          nama: '',
          NIK: '',
          umur: '',
          alamat: '',
          no_hp: ''
        });

        // Redirect setelah 1 detik
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            onBack();
          }
        }, 1000);
      } else {
        setError(result.message || 'Gagal menambahkan data pasien');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menyimpan data');
      console.error('Error creating pasien:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nama: '',
      NIK: '',
      umur: '',
      alamat: '',
      no_hp: ''
    });
    setError('');
    setSuccess(false);
  };

  return (
    <div className="tambah-pasien-page">
      {/* Header */}
      <div className="tambah-pasien-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="header-logo-img" />
          </div>
          <h1 className="header-title">Tambah Pasien Baru</h1>
        </div>
        <button className="btn-kembali" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="tambah-pasien-content">
        {/* Sidebar */}
        <Sidebar
          activePage="data-pasien"
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

        {/* Form Area */}
        <main className="form-area">
          <div className="form-card">
            <h2 className="form-card-title">Informasi Pasien</h2>
            
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span>✅</span>
                <p>Data berhasil disimpan!</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nama">
                    Nama Lengkap <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="NIK">
                    NIK (16 digit) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="NIK"
                    name="NIK"
                    value={formData.NIK}
                    onChange={handleChange}
                    placeholder="Masukkan NIK 16 digit"
                    maxLength="16"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="umur">
                    Umur (Tahun) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="umur"
                    name="umur"
                    value={formData.umur}
                    onChange={handleChange}
                    placeholder="Masukkan umur"
                    min="0"
                    max="150"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="no_hp">
                    Nomor HP <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="no_hp"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="Masukkan nomor HP"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="alamat">
                  Alamat Lengkap <span className="required">*</span>
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  rows="4"
                  disabled={loading}
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-reset"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TambahPasien;
