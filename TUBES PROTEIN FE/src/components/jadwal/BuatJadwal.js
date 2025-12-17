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
    jenis_layanan: '',
    tanggal: '',
    jam: '',
    pasien_id: '',
    petugas: userData?.username || ''
  });

  useEffect(() => {
    fetchPasienList();
    if (editData) {
      // Parse existing data for edit mode
      const [datePart, timePart] = editData.tanggal_waktu ? editData.tanggal_waktu.split(' ') : ['', ''];
      setFormData({
        jenis_layanan: editData.jenis_layanan || '',
        tanggal: datePart || '',
        jam: timePart ? timePart.substring(0, 5) : '', // HH:MM format
        pasien_id: editData.pasien_id || '',
        petugas: editData.petugas || userData?.username || ''
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
      if (!formData.jenis_layanan || !formData.tanggal || !formData.jam || !formData.pasien_id) {
        alert('Mohon lengkapi semua field yang diperlukan');
        return;
      }

      // Combine date and time
      const tanggal_waktu = `${formData.tanggal} ${formData.jam}:00`;

      const payload = {
        jenis_layanan: formData.jenis_layanan,
        tanggal_waktu,
        pasien_id: formData.pasien_id,
        petugas: formData.petugas,
        status: 'scheduled'
      };

      let response;
      if (editData) {
        response = await jadwalService.updateJadwal(editData.id, payload);
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
      alert('Terjadi kesalahan saat menyimpan jadwal');
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
                  <label>Jenis Layanan</label>
                  <select
                    name="jenis_layanan"
                    value={formData.jenis_layanan}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Jenis Layanan</option>
                    <option value="KB">Layanan KB</option>
                    <option value="ANC">Layanan ANC</option>
                    <option value="Persalinan">Layanan Persalinan</option>
                    <option value="Imunisasi">Layanan Imunisasi</option>
                    <option value="Kunjungan Pasien">Kunjungan Pasien</option>
                  </select>
                </div>

                {/* Tanggal dan Jam */}
                <div className="jadwal-form-row">
                  <div className="jadwal-form-group">
                    <label>Tanggal</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      placeholder="Masukkan"
                    />
                  </div>
                  <div className="jadwal-form-group small">
                    <label>Jam</label>
                    <input
                      type="time"
                      name="jam"
                      value={formData.jam}
                      onChange={handleInputChange}
                      placeholder="XX:XX"
                    />
                  </div>
                </div>

                {/* Nama Pasien */}
                <div className="jadwal-form-group full-width">
                  <label>Nama Pasien</label>
                  <select
                    name="pasien_id"
                    value={formData.pasien_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Masukkan</option>
                    {pasienList.map(pasien => (
                      <option key={pasien.id} value={pasien.id}>
                        {pasien.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Petugas/Penanggung Jawab */}
                <div className="jadwal-form-group full-width">
                  <label>Petugas/Penanggung Jawab</label>
                  <input
                    type="text"
                    name="petugas"
                    value={formData.petugas}
                    onChange={handleInputChange}
                    placeholder="Masukkan"
                  />
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
