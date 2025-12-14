import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './DataPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasienService';

function DataPasien({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [formData, setFormData] = useState({
    id_pasien: '',
    nama: '',
    umur: '',
    NIK: '',
    no_hp: '',
    alamat: ''
  });

  const [riwayatLayanan, setRiwayatLayanan] = useState({
    'KB': [],
    'Persalinan': [],
    'ANC': [],
    'Imunisasi': [],
    'Kunjungan': []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load pasien data dari localStorage (di-set oleh DaftarPasien saat klik detail)
    const selectedPasien = localStorage.getItem('selectedPasien');
    if (selectedPasien) {
      const parsedPasien = JSON.parse(selectedPasien);
      setFormData({
        id_pasien: parsedPasien.id_pasien || '',
        nama: parsedPasien.nama || '',
        umur: parsedPasien.umur || '',
        NIK: parsedPasien.NIK || '',
        no_hp: parsedPasien.no_hp || '',
        alamat: parsedPasien.alamat || ''
      });
      
      // Load riwayat dari backend
      loadRiwayatPasien(parsedPasien.id_pasien);
    } else {
      // Jika tidak ada data, gunakan mock data (untuk backward compatibility)
      loadMockData();
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMockData = () => {
    // Mock data untuk testing
    setRiwayatLayanan({
      'KB': [
        { id_pemeriksaan: '1', nomor_registrasi: 'Nomor Registrasi' },
        { id_pemeriksaan: '2', nomor_registrasi: 'Nomor Registrasi' }
      ],
      'Persalinan': [],
      'ANC': [],
      'Imunisasi': [],
      'Kunjungan': [
        { id_pemeriksaan: '3', nomor_registrasi: 'Nomor Registrasi' }
      ]
    });
  };

  const loadRiwayatPasien = async (id_pasien) => {
    try {
      setLoading(true);
      const result = await pasienService.getRiwayatPasien(id_pasien);
      
      if (result.success && result.data) {
        // Transform riwayat data ke format yang dibutuhkan
        const transformedData = {
          'KB': result.data.filter(r => r.jenis_layanan === 'KB') || [],
          'Persalinan': result.data.filter(r => r.jenis_layanan === 'Persalinan') || [],
          'ANC': result.data.filter(r => r.jenis_layanan === 'ANC') || [],
          'Imunisasi': result.data.filter(r => r.jenis_layanan === 'Imunisasi') || [],
          'Kunjungan': result.data.filter(r => r.jenis_layanan === 'Kunjungan') || []
        };
        setRiwayatLayanan(transformedData);
      } else {
        // Jika gagal atau tidak ada data, gunakan array kosong
        setRiwayatLayanan({
          'KB': [],
          'Persalinan': [],
          'ANC': [],
          'Imunisasi': [],
          'Kunjungan': []
        });
      }
    } catch (err) {
      console.error('Error loading riwayat:', err);
      setError(err.message || 'Gagal memuat riwayat pasien');
      // Gunakan data kosong jika error
      setRiwayatLayanan({
        'KB': [],
        'Persalinan': [],
        'ANC': [],
        'Imunisasi': [],
        'Kunjungan Pasien': []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="data-pasien-page">
      {/* Header */}
      <div className="data-pasien-header">
        <div className="dp-header-left">
          <div className="dp-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="dp-header-logo-img" />
          </div>
          <h1 className="dp-header-title">Data Pasien</h1>
        </div>
        <button className="btn-kembali-dp" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="data-pasien-content">
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

        {/* Main Area */}
        <main className="dp-main-area">
          {/* Informasi Pasien */}
          <div className="dp-info-section">
            <h2 className="dp-section-title">Informasi Pasien</h2>
            <div className="dp-info-form">
              <div className="dp-form-row">
                <div className="dp-form-group">
                  <label>Nama Pasien</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Nama Pasien"
                  />
                </div>
                <div className="dp-form-group">
                  <label>Umur (Th)</label>
                  <input
                    type="text"
                    name="umur"
                    value={formData.umur}
                    onChange={handleInputChange}
                    placeholder="Umur Pasien"
                  />
                </div>
                <div className="dp-form-group">
                  <label>NIK</label>
                  <input
                    type="text"
                    name="NIK"
                    value={formData.NIK}
                    onChange={handleInputChange}
                    placeholder="NIK Pasien"
                  />
                </div>
              </div>
              <div className="dp-form-row">
                <div className="dp-form-group">
                  <label>Nomor HP</label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Nomor HP"
                  />
                </div>
                <div className="dp-form-group dp-form-group-alamat">
                  <label>Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Histori Layanan */}
          <div className="dp-history-section">
            <h2 className="dp-section-title">Histori Layanan</h2>
            <h3 className="dp-subsection-title">Layanan Program Keluarga Berencana</h3>
            
            <div className="dp-layanan-list">
              {/* KB */}
              <div className="dp-layanan-item">
                <div className="dp-layanan-label">Nomor Registrasi</div>
                <div className="dp-layanan-values">
                  {riwayatLayanan['KB'].length > 0 ? (
                    riwayatLayanan['KB'].map((item, index) => (
                      <div key={item.id_pemeriksaan} className="dp-layanan-value">
                        {item.nomor_registrasi}
                        <div className="dp-layanan-actions">
                          <button className="dp-btn-detail">✏️</button>
                          <button className="dp-btn-delete-small">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dp-layanan-empty">Data tidak ditemukan</div>
                  )}
                </div>
              </div>

              {/* Persalinan */}
              <div className="dp-layanan-item">
                <div className="dp-layanan-label">Layanan Persalinan</div>
                <div className="dp-layanan-values">
                  {riwayatLayanan['Persalinan'].length > 0 ? (
                    riwayatLayanan['Persalinan'].map((item, index) => (
                      <div key={item.id_pemeriksaan} className="dp-layanan-value">
                        {item.nomor_registrasi}
                        <div className="dp-layanan-actions">
                          <button className="dp-btn-detail">✏️</button>
                          <button className="dp-btn-delete-small">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dp-layanan-empty">Data tidak ditemukan</div>
                  )}
                </div>
              </div>

              {/* ANC */}
              <div className="dp-layanan-item">
                <div className="dp-layanan-label">Layanan ANC</div>
                <div className="dp-layanan-values">
                  {riwayatLayanan['ANC'].length > 0 ? (
                    riwayatLayanan['ANC'].map((item, index) => (
                      <div key={item.id_pemeriksaan} className="dp-layanan-value">
                        {item.nomor_registrasi}
                        <div className="dp-layanan-actions">
                          <button className="dp-btn-detail">✏️</button>
                          <button className="dp-btn-delete-small">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dp-layanan-empty">Data tidak ditemukan</div>
                  )}
                </div>
              </div>

              {/* Imunisasi */}
              <div className="dp-layanan-item">
                <div className="dp-layanan-label">Layanan Imunisasi</div>
                <div className="dp-layanan-values">
                  {riwayatLayanan['Imunisasi'].length > 0 ? (
                    riwayatLayanan['Imunisasi'].map((item, index) => (
                      <div key={item.id_pemeriksaan} className="dp-layanan-value">
                        {item.nomor_registrasi}
                        <div className="dp-layanan-actions">
                          <button className="dp-btn-detail">✏️</button>
                          <button className="dp-btn-delete-small">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dp-layanan-empty">Data tidak ditemukan</div>
                  )}
                </div>
              </div>

              {/* Kunjungan Pasien */}
              <div className="dp-layanan-item">
                <div className="dp-layanan-label">Layanan Kunjungan Pasien</div>
                <div className="dp-layanan-values">
                  {riwayatLayanan['Kunjungan'].length > 0 ? (
                    riwayatLayanan['Kunjungan'].map((item, index) => (
                      <div key={item.id_pemeriksaan} className="dp-layanan-value">
                        {item.nomor_registrasi}
                        <div className="dp-layanan-actions">
                          <button className="dp-btn-detail">✏️</button>
                          <button className="dp-btn-delete-small">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dp-layanan-empty">Data tidak ditemukan</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DataPasien;
