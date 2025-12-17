import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './BuatJadwal.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import jadwalService from '../../services/jadwal.service';
import pasienService from '../../services/pasien.service';

function BuatJadwal({ 
  onBack, 
  onToRiwayatDataMasuk, 
  onToRiwayatMasukAkun, 
  onToProfil,
  onToTambahPasien,
  onToTambahPengunjung,
  onToBuatLaporan,
  onToPersalinan,
  onToANC,
  onToKB,
  onToImunisasi,
  onToKunjunganPasien,
  editData = null
}) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [pasienList, setPasienList] = useState([]);
  const [formData, setFormData] = useState({
    id_pasien: '',
    jenis_layanan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });

  const layananOptions = [
    { value: 'ANC', label: 'ANC (Antenatal Care)' },
    { value: 'KB', label: 'KB (Keluarga Berencana)' },
    { value: 'Imunisasi', label: 'Imunisasi' },
    { value: 'Persalinan', label: 'Persalinan' },
    { value: 'Kunjungan Pasien', label: 'Kunjungan Pasien' }
  ];

  useEffect(() => {
    fetchPasienList();
    if (editData) {
      setFormData({
        id_pasien: editData.id_pasien || '',
        jenis_layanan: editData.jenis_layanan || '',
        tanggal: editData.tanggal || '',
        jam_mulai: editData.jam_mulai || '',
        jam_selesai: editData.jam_selesai || ''
      });
    }
  }, [editData]);

  const fetchPasienList = async () => {
    try {
      const response = await pasienService.getAllPasien();
      if (response.success) {
        setPasienList(response.data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate
      if (!formData.id_pasien || !formData.jenis_layanan || !formData.tanggal || !formData.jam_mulai) {
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

      console.log('📤 Submit payload:', payload);

      let response;
      if (editData) {
        response = await jadwalService.updateJadwal(editData.id_jadwal, payload);
      } else {
        response = await jadwalService.createJadwal(payload);
      }

      if (response.success) {
        alert(editData ? 'Jadwal berhasil diupdate!' : 'Jadwal berhasil dibuat!');
        onBack();
      } else {
        alert(response.message || 'Gagal menyimpan jadwal');
      }
    } catch (error) {
      console.error('Error saving jadwal:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan jadwal');
    }
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="buat-jadwal-page">
      {/* Header */}
      <div className="buat-jadwal-header">
        <div className="buat-jadwal-header-left">
          <div className="buat-jadwal-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="buat-jadwal-header-logo-img" />
          </div>
          <h1 className="buat-jadwal-header-title">
            {editData ? 'Edit Jadwal' : 'Buat/Edit Jadwal'}
          </h1>
        </div>
        <button className="btn-kembali-jadwal" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="buat-jadwal-content">
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

        {/* Main Form Area */}
        <main className="buat-jadwal-main-area">
          <div className="jadwal-form-container">
            <div className="jadwal-form-section">
              <h2 className="jadwal-form-section-title">Jadwal</h2>
              
              <div className="jadwal-form-content">
                {/* Jenis Layanan */}
                <div className="jadwal-form-group full-width">
                  <label>Jenis Layanan *</label>
                  <select
                    name="jenis_layanan"
                    value={formData.jenis_layanan}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Jenis Layanan</option>
                    {layananOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Pasien */}
                <div className="jadwal-form-group full-width">
                  <label>Nama Pasien *</label>
                  <select
                    name="id_pasien"
                    value={formData.id_pasien}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Pasien</option>
                    {pasienList.map(pasien => (
                      <option key={pasien.id_pasien} value={pasien.id_pasien}>
                        {pasien.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal */}
                <div className="jadwal-form-row">
                  <div className="jadwal-form-group">
                    <label>Tanggal *</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Waktu */}
                <div className="jadwal-form-row">
                  <div className="jadwal-form-group">
                    <label>Jam Mulai *</label>
                    <input
                      type="time"
                      name="jam_mulai"
                      value={formData.jam_mulai}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="jadwal-form-group">
                    <label>Jam Selesai</label>
                    <input
                      type="time"
                      name="jam_selesai"
                      value={formData.jam_selesai}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="jadwal-form-actions">
                <button 
                  className="btn-jadwal-submit" 
                  onClick={handleSubmit}
                  title="Simpan"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
                <button 
                  className="btn-jadwal-cancel" 
                  onClick={handleCancel}
                  title="Batal"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <path d="M6 6L14 14M6 14L14 6M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BuatJadwal;
