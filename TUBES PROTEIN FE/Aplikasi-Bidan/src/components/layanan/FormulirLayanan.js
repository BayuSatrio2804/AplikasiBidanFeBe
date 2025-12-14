import { useState, useEffect } from 'react';
import './FormulirLayanan.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import Sidebar from '../shared/Sidebar';
import persalinanService from '../../services/persalinan.service';
import ancService from '../../services/anc.service';
import kbService from '../../services/kb.service';
import imunisasiService from '../../services/imunisasi.service';

function FormulirLayanan({ 
  initialJenisLayanan = 'Persalinan',
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
  onToImunisasi
}) {
  const [jenisLayanan, setJenisLayanan] = useState(initialJenisLayanan);
  
  // State untuk form data
  const [formData, setFormData] = useState({
    // Informasi Layanan
    jenis_layanan: '',
    tanggal: '',
    no_reg_lama: '',
    no_reg_baru: '',
    
    // Data Ibu
    nama_istri: '',
    nik_ibu: '',
    umur_ibu: '',
    alamat: '',
    
    // Data Suami/Ayah
    nama_suami: '',
    nik_suami: '',
    umur_suami: '',
  });
  
  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form saat ganti jenis layanan
  useEffect(() => {
    setFormData({
      jenis_layanan: jenisLayanan,
      tanggal: '',
      no_reg_lama: '',
      no_reg_baru: '',
      nama_istri: '',
      nik_ibu: '',
      umur_ibu: '',
      alamat: '',
      nama_suami: '',
      nik_suami: '',
      umur_suami: '',
    });
    setError('');
    setSuccess('');
  }, [jenisLayanan]);

  const resetForm = () => {
    setFormData({
      jenis_layanan: jenisLayanan,
      tanggal: '',
      no_reg_lama: '',
      no_reg_baru: '',
      nama_istri: '',
      nik_ibu: '',
      umur_ibu: '',
      alamat: '',
      nama_suami: '',
      nik_suami: '',
      umur_suami: '',
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let result;
      
      switch (jenisLayanan) {
        case 'Persalinan':
          result = await persalinanService.createPersalinan(formData);
          break;
        case 'ANC':
          result = await ancService.createANC(formData);
          break;
        case 'KB':
          result = await kbService.createKB(formData);
          break;
        case 'Imunisasi':
          result = await imunisasiService.createImunisasi(formData);
          break;
        default:
          throw new Error('Jenis layanan tidak valid');
      }

      if (result.success) {
        setSuccess(`Data ${jenisLayanan} berhasil disimpan dengan Nomor Registrasi: ${result.data?.nomor_registrasi || result.data?.no_reg || '-'}`);
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        setError(result.message || `Gagal menyimpan data ${jenisLayanan}`);
      }
    } catch (err) {
      console.error('Error submitting:', err);
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  // Render form fields berdasarkan jenis layanan
  const renderFormFields = () => {
    switch (jenisLayanan) {
      case 'KB':
        return renderKBFields();
      case 'Persalinan':
        return renderPersalinanFields();
      case 'ANC':
        return renderANCFields();
      case 'Imunisasi':
        return renderImunisasiFields();
      default:
        return null;
    }
  };

  const renderPersalinanFields = () => (
    <>
      {/* Informasi Layanan Persalinan */}
      <div className="form-section">
        <h3 className="section-title">Informasi Layanan Persalinan</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Tanggal Persalinan *</label>
            <input
              type="date"
              name="tanggal_persalinan"
              value={formData.tanggal_persalinan || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Jenis Kelamin Bayi *</label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>No. Reg Lama</label>
            <input
              type="text"
              name="no_reg_lama"
              value={formData.no_reg_lama || ''}
              onChange={handleInputChange}
              placeholder="Nomor registrasi lama (opsional)"
            />
          </div>
          <div className="form-group">
            <label>No. Reg Baru</label>
            <input
              type="text"
              name="no_reg_baru"
              value={formData.no_reg_baru || ''}
              onChange={handleInputChange}
              placeholder="Nomor registrasi baru (opsional)"
            />
          </div>
        </div>
      </div>

      {/* Data Ibu */}
      <div className="form-section">
        <h3 className="section-title">Data Ibu</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Ibu/Istri *</label>
            <input
              type="text"
              name="nama_istri"
              value={formData.nama_istri || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap ibu"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Ibu *</label>
            <input
              type="text"
              name="nik_ibu"
              value={formData.nik_ibu || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Umur Ibu *</label>
            <input
              type="number"
              name="umur_ibu"
              value={formData.umur_ibu || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 25"
              required
            />
          </div>
          <div className="form-group">
            <label>LIDA Ibu (cm)</label>
            <input
              type="number"
              step="0.1"
              name="lida_ibu"
              value={formData.lida_ibu || ''}
              onChange={handleInputChange}
              placeholder="Lingkar Dada Ibu"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>LILA Ibu (cm)</label>
            <input
              type="number"
              step="0.1"
              name="lila_ibu"
              value={formData.lila_ibu || ''}
              onChange={handleInputChange}
              placeholder="Lingkar Lengan Atas"
            />
          </div>
          <div className="form-group">
            <label>IMD Dilakukan?</label>
            <select
              name="imd_dilakukan"
              value={formData.imd_dilakukan || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Status</option>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Alamat *</label>
          <textarea
            name="alamat"
            value={formData.alamat || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Alamat lengkap"
            required
          />
        </div>
      </div>

      {/* Data Ayah/Suami */}
      <div className="form-section">
        <h3 className="section-title">Data Ayah/Suami</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Suami *</label>
            <input
              type="text"
              name="nama_suami"
              value={formData.nama_suami || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap suami"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Suami *</label>
            <input
              type="text"
              name="nik_suami"
              value={formData.nik_suami || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Umur Suami *</label>
          <input
            type="number"
            name="umur_suami"
            value={formData.umur_suami || ''}
            onChange={handleInputChange}
            placeholder="Contoh: 30"
            required
          />
        </div>
      </div>

      {/* Data Bayi */}
      <div className="form-section">
        <h3 className="section-title">Data Bayi</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Berat Badan Bayi (gram) *</label>
            <input
              type="number"
              name="bb_bayi"
              value={formData.bb_bayi || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 3200"
              required
            />
          </div>
          <div className="form-group">
            <label>Panjang Badan Bayi (cm) *</label>
            <input
              type="number"
              step="0.1"
              name="pb_bayi"
              value={formData.pb_bayi || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 50"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Lingkar Kepala Bayi (cm)</label>
          <input
            type="number"
            step="0.1"
            name="lika_bayi"
            value={formData.lika_bayi || ''}
            onChange={handleInputChange}
            placeholder="Lingkar Kepala"
          />
        </div>
      </div>

      {/* Informasi Tambahan/SOAP */}
      <div className="form-section">
        <h3 className="section-title">Informasi Tambahan (SOAP)</h3>
        
        <div className="form-group">
          <label>Subjektif (S) - Keluhan</label>
          <textarea
            name="subjektif"
            value={formData.subjektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Keluhan yang disampaikan pasien"
          />
        </div>

        <div className="form-group">
          <label>Objektif (O) - Hasil Pemeriksaan</label>
          <textarea
            name="objektif"
            value={formData.objektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Hasil pemeriksaan fisik"
          />
        </div>

        <div className="form-group">
          <label>Analisa (A) - Diagnosis</label>
          <textarea
            name="analisa"
            value={formData.analisa || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Diagnosis atau analisa kondisi"
          />
        </div>

        <div className="form-group">
          <label>Tatalaksana (P) - Rencana</label>
          <textarea
            name="tatalaksana"
            value={formData.tatalaksana || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Rencana tindakan atau terapi"
          />
        </div>
      </div>
    </>
  );

  const renderANCFields = () => (
    <>
      {/* Informasi Layanan ANC */}
      <div className="form-section">
        <h3 className="section-title">Informasi Layanan ANC</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Tanggal Pemeriksaan *</label>
            <input
              type="date"
              name="tanggal_pemeriksaan"
              value={formData.tanggal_pemeriksaan || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>HPHT (Hari Pertama Haid Terakhir)</label>
            <input
              type="date"
              name="hpht"
              value={formData.hpht || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>HPL (Hari Perkiraan Lahir)</label>
            <input
              type="date"
              name="hpl"
              value={formData.hpl || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>No. Reg Lama</label>
            <input
              type="text"
              name="no_reg_lama"
              value={formData.no_reg_lama || ''}
              onChange={handleInputChange}
              placeholder="Nomor registrasi lama (opsional)"
            />
          </div>
        </div>

        <div className="form-group">
          <label>No. Reg Baru</label>
          <input
            type="text"
            name="no_reg_baru"
            value={formData.no_reg_baru || ''}
            onChange={handleInputChange}
            placeholder="Nomor registrasi baru (opsional)"
          />
        </div>
      </div>

      {/* Data Ibu */}
      <div className="form-section">
        <h3 className="section-title">Data Ibu</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Ibu/Istri *</label>
            <input
              type="text"
              name="nama_istri"
              value={formData.nama_istri || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap ibu"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Ibu *</label>
            <input
              type="text"
              name="nik_ibu"
              value={formData.nik_ibu || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Umur Ibu *</label>
            <input
              type="number"
              name="umur_ibu"
              value={formData.umur_ibu || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 25"
              required
            />
          </div>
          <div className="form-group">
            <label>Berat Badan Ibu (kg)</label>
            <input
              type="number"
              step="0.1"
              name="bb_ibu"
              value={formData.bb_ibu || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 65.5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tekanan Darah Ibu</label>
            <input
              type="text"
              name="td_ibu"
              value={formData.td_ibu || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 120/80"
            />
          </div>
          <div className="form-group">
            <label>LILA Ibu (cm)</label>
            <input
              type="number"
              step="0.1"
              name="lila_ibu"
              value={formData.lila_ibu || ''}
              onChange={handleInputChange}
              placeholder="Lingkar Lengan Atas"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Alamat *</label>
          <textarea
            name="alamat"
            value={formData.alamat || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Alamat lengkap"
            required
          />
        </div>
      </div>

      {/* Data Ayah/Suami */}
      <div className="form-section">
        <h3 className="section-title">Data Ayah/Suami</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Suami *</label>
            <input
              type="text"
              name="nama_suami"
              value={formData.nama_suami || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap suami"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Suami *</label>
            <input
              type="text"
              name="nik_suami"
              value={formData.nik_suami || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Umur Suami *</label>
          <input
            type="number"
            name="umur_suami"
            value={formData.umur_suami || ''}
            onChange={handleInputChange}
            placeholder="Contoh: 30"
            required
          />
        </div>
      </div>

      {/* Informasi Tambahan/SOAP */}
      <div className="form-section">
        <h3 className="section-title">Informasi Tambahan (SOAP & Hasil Pemeriksaan)</h3>
        
        <div className="form-group">
          <label>Hasil Pemeriksaan</label>
          <textarea
            name="hasil_pemeriksaan"
            value={formData.hasil_pemeriksaan || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Catatan hasil pemeriksaan ANC"
          />
        </div>

        <div className="form-group">
          <label>Subjektif (S) - Keluhan</label>
          <textarea
            name="subjektif"
            value={formData.subjektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Keluhan yang disampaikan pasien"
          />
        </div>

        <div className="form-group">
          <label>Objektif (O) - Hasil Pemeriksaan</label>
          <textarea
            name="objektif"
            value={formData.objektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Hasil pemeriksaan fisik"
          />
        </div>

        <div className="form-group">
          <label>Analisa (A) - Diagnosis</label>
          <textarea
            name="analisa"
            value={formData.analisa || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Diagnosis atau analisa kondisi"
          />
        </div>

        <div className="form-group">
          <label>Tatalaksana (P) - Tindakan & Rencana</label>
          <textarea
            name="tatalaksana"
            value={formData.tatalaksana || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Rencana tindakan atau terapi"
          />
        </div>

        <div className="form-group">
          <label>Tindakan Spesifik</label>
          <textarea
            name="tindakan"
            value={formData.tindakan || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Tindakan khusus yang dilakukan"
          />
        </div>
      </div>
    </>
  );

  const renderKBFields = () => (
    <>
      {/* Informasi Layanan */}
      <div className="form-section">
        <h3 className="section-title">Informasi Layanan</h3>
        
        <div className="form-row-horizontal">
          <div className="form-group">
            <label>Jenis Layanan</label>
            <select
              name="jenis_layanan"
              value={formData.jenis_layanan || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Jenis Layanan</option>
              <option value="KB">Keluarga Berencana</option>
              <option value="ANC">ANC</option>
              <option value="Persalinan">Persalinan</option>
              <option value="Imunisasi">Imunisasi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal || ''}
              onChange={handleInputChange}
              placeholder="DD/MM/YY"
            />
          </div>
        </div>

        <div className="form-row-horizontal">
          <div className="form-group">
            <label>Nomor Registrasi Lama</label>
            <input
              type="text"
              name="no_reg_lama"
              value={formData.no_reg_lama || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>Nomor Registrasi Baru</label>
            <input
              type="text"
              name="no_reg_baru"
              value={formData.no_reg_baru || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>Metode</label>
            <select
              name="metode_kb"
              value={formData.metode_kb || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Metode</option>
              <option value="Pil">Pil</option>
              <option value="Suntik 1 Bulan">Suntik 1 Bulan</option>
              <option value="Suntik 3 Bulan">Suntik 3 Bulan</option>
              <option value="IUD">IUD</option>
              <option value="Implan">Implan</option>
              <option value="Kondom">Kondom</option>
              <option value="MOW">MOW</option>
              <option value="MOP">MOP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Ibu */}
      <div className="form-section">
        <h3 className="section-title">Data Ibu</h3>
        
        <div className="form-row-horizontal">
          <div className="form-group flex-2">
            <label>Nama Istri</label>
            <input
              type="text"
              name="nama_istri"
              value={formData.nama_istri || ''}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="form-group flex-2">
            <label>NIK</label>
            <input
              type="text"
              name="nik_ibu"
              value={formData.nik_ibu || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label>Umur (Th)</label>
            <input
              type="number"
              name="umur_ibu"
              value={formData.umur_ibu || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>TD</label>
            <input
              type="text"
              name="td_ibu"
              value={formData.td_ibu || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>BB</label>
            <input
              type="number"
              step="0.1"
              name="bb_ibu"
              value={formData.bb_ibu || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
        </div>
      </div>

      {/* Data Ayah */}
      <div className="form-section">
        <h3 className="section-title">Data Ayah</h3>
        
        <div className="form-row-horizontal">
          <div className="form-group flex-2">
            <label>Nama Suami</label>
            <input
              type="text"
              name="nama_suami"
              value={formData.nama_suami || ''}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="form-group flex-2">
            <label>NIK</label>
            <input
              type="text"
              name="nik_suami"
              value={formData.nik_suami || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label>Umur (Th)</label>
            <input
              type="number"
              name="umur_suami"
              value={formData.umur_suami || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>TD</label>
            <input
              type="text"
              name="td_ayah"
              value={formData.td_ayah || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
          <div className="form-group">
            <label>BB</label>
            <input
              type="number"
              step="0.1"
              name="bb_ayah"
              value={formData.bb_ayah || ''}
              onChange={handleInputChange}
              placeholder="Masukkan data"
            />
          </div>
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="form-section">
        <h3 className="section-title">Informasi Tambahan</h3>
        
        <div className="form-row-horizontal">
          <div className="form-group flex-2">
            <label>Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat || ''}
              onChange={handleInputChange}
              placeholder="Masukkan detail alamat"
            />
          </div>
          <div className="form-group">
            <label>Nomor HP</label>
            <input
              type="tel"
              name="nomor_hp"
              value={formData.nomor_hp || ''}
              onChange={handleInputChange}
              placeholder="Masukkan nomor HP"
            />
          </div>
          <div className="form-group">
            <label>Kunjungan Ulang</label>
            <input
              type="date"
              name="kunjungan_ulang"
              value={formData.kunjungan_ulang || ''}
              onChange={handleInputChange}
              placeholder="DD/MM/YY"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Catatan</label>
          <textarea
            name="catatan"
            value={formData.catatan || ''}
            onChange={handleInputChange}
            rows="3"
            placeholder="Tambahkan catatan"
          />
        </div>
      </div>
    </>
  );

  const renderImunisasiFields = () => (
    <>
      {/* Informasi Layanan Imunisasi */}
      <div className="form-section">
        <h3 className="section-title">Informasi Layanan Imunisasi</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Tanggal Imunisasi *</label>
            <input
              type="date"
              name="tanggal_imunisasi"
              value={formData.tanggal_imunisasi || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Jenis Imunisasi *</label>
            <select
              name="jenis_imunisasi"
              value={formData.jenis_imunisasi || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Jenis Imunisasi</option>
              <option value="BCG">BCG</option>
              <option value="Hepatitis B">Hepatitis B</option>
              <option value="Polio">Polio</option>
              <option value="DPT">DPT</option>
              <option value="Campak">Campak</option>
              <option value="HIB">HIB</option>
              <option value="PCV">PCV</option>
              <option value="Rotavirus">Rotavirus</option>
              <option value="MMR">MMR</option>
              <option value="Varicella">Varicella</option>
              <option value="Influenza">Influenza</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>No. Reg Lama</label>
            <input
              type="text"
              name="no_reg_lama"
              value={formData.no_reg_lama || ''}
              onChange={handleInputChange}
              placeholder="Nomor registrasi lama (opsional)"
            />
          </div>
          <div className="form-group">
            <label>No. Reg Baru</label>
            <input
              type="text"
              name="no_reg_baru"
              value={formData.no_reg_baru || ''}
              onChange={handleInputChange}
              placeholder="Nomor registrasi baru (opsional)"
            />
          </div>
        </div>
      </div>

      {/* Data Ibu */}
      <div className="form-section">
        <h3 className="section-title">Data Ibu</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Ibu/Istri *</label>
            <input
              type="text"
              name="nama_istri"
              value={formData.nama_istri || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap ibu"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Ibu *</label>
            <input
              type="text"
              name="nik_ibu"
              value={formData.nik_ibu || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Umur Ibu *</label>
            <input
              type="number"
              name="umur_ibu"
              value={formData.umur_ibu || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 25"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Alamat *</label>
          <textarea
            name="alamat"
            value={formData.alamat || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Alamat lengkap"
            required
          />
        </div>
      </div>

      {/* Data Ayah/Suami */}
      <div className="form-section">
        <h3 className="section-title">Data Ayah/Suami</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Suami *</label>
            <input
              type="text"
              name="nama_suami"
              value={formData.nama_suami || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap suami"
              required
            />
          </div>
          <div className="form-group">
            <label>NIK Suami *</label>
            <input
              type="text"
              name="nik_suami"
              value={formData.nik_suami || ''}
              onChange={handleInputChange}
              placeholder="Nomor Induk Kependudukan"
              maxLength="16"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Umur Suami *</label>
          <input
            type="number"
            name="umur_suami"
            value={formData.umur_suami || ''}
            onChange={handleInputChange}
            placeholder="Contoh: 30"
            required
          />
        </div>
      </div>

      {/* Data Bayi/Balita */}
      <div className="form-section">
        <h3 className="section-title">Data Bayi/Balita</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nama Bayi/Balita *</label>
            <input
              type="text"
              name="nama_bayi_balita"
              value={formData.nama_bayi_balita || ''}
              onChange={handleInputChange}
              placeholder="Nama lengkap bayi/balita"
              required
            />
          </div>
          <div className="form-group">
            <label>Tanggal Lahir Bayi *</label>
            <input
              type="date"
              name="tanggal_lahir_bayi"
              value={formData.tanggal_lahir_bayi || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Berat Badan Bayi (kg)</label>
            <input
              type="number"
              step="0.1"
              name="bb_bayi"
              value={formData.bb_bayi || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 8.5"
            />
          </div>
          <div className="form-group">
            <label>Tinggi Badan Bayi (cm)</label>
            <input
              type="number"
              step="0.1"
              name="tb_bayi"
              value={formData.tb_bayi || ''}
              onChange={handleInputChange}
              placeholder="Contoh: 70"
            />
          </div>
        </div>
      </div>

      {/* Informasi Tambahan/SOAP */}
      <div className="form-section">
        <h3 className="section-title">Informasi Tambahan (SOAP)</h3>
        
        <div className="form-group">
          <label>Subjektif (S) - Keluhan</label>
          <textarea
            name="subjektif"
            value={formData.subjektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Keluhan atau kondisi anak"
          />
        </div>

        <div className="form-group">
          <label>Objektif (O) - Hasil Pemeriksaan</label>
          <textarea
            name="objektif"
            value={formData.objektif || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Hasil pemeriksaan fisik"
          />
        </div>

        <div className="form-group">
          <label>Analisa (A) - Diagnosis</label>
          <textarea
            name="analisa"
            value={formData.analisa || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Diagnosis atau analisa kondisi"
          />
        </div>

        <div className="form-group">
          <label>Tatalaksana (P) - Rencana</label>
          <textarea
            name="tatalaksana"
            value={formData.tatalaksana || ''}
            onChange={handleInputChange}
            rows="2"
            placeholder="Rencana tindakan atau terapi"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="formulir-layanan-page">
      {/* Header */}
      <div className="fl-header">
        <div className="fl-header-left">
          <div className="fl-header-icon">
            <img src={pinkLogo} alt="Icon" className="fl-header-icon-img" />
          </div>
          <h1 className="fl-header-title">Formulir Registrasi Layanan Keluarga Berencana</h1>
        </div>
        <button className="btn-kembali-fl" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="fl-content">
        {/* Sidebar */}
        <Sidebar
          activePage={`layanan-${jenisLayanan.toLowerCase()}`}
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

        {/* Form */}
        <main className="fl-main">
          {/* Form */}
          <form onSubmit={handleSubmit} className="fl-form">
            {/* Dynamic form fields based on jenis layanan */}
            {renderFormFields()}

            {/* Error & Success Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-reset" disabled={loading}>
                Batal
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default FormulirLayanan;
