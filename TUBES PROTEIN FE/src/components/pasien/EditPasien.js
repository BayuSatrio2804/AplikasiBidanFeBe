import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './EditPasien.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasien.service';
import * as layananService from '../../services/layanan.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function EditPasien({
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
  pasienId = null
}) {
  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    nik: '',
    no_hp: '',
    alamat: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  const [historiLayanan, setHistoriLayanan] = useState({
    kb: [],
    anc: [],
    imunisasi: [],
    persalinan: [],
    kunjunganPasien: []
  });

  useEffect(() => {
    if (pasienId) {
      fetchPasienData();
    }
  }, [pasienId]);

  const fetchPasienData = async () => {
    setIsLoading(true);
    try {
      const response = await pasienService.getPasienById(pasienId);
      if (response.success) {
        const data = response.data;
        setFormData({
          nama: data.nama || '',
          umur: data.umur || '',
          nik: data.nik || '',
          no_hp: data.no_hp || '',
          alamat: data.alamat || ''
        });
        // Fetch historiLayanan after getting pasien data
        await fetchHistoriLayanan(pasienId);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal mengambil data pasien',
        onConfirm: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistoriLayanan = async (id_pasien) => {
    try {
      console.log('📋 Fetching histori layanan for pasien:', id_pasien);
      const [kbRes, ancRes, imunRes, persRes, kunjRes] = await Promise.all([
        layananService.getAllKB(),
        layananService.getAllANC(),
        layananService.getAllImunisasi(),
        layananService.getAllPersalinan(),
        layananService.getAllKunjunganPasien()
      ]);

      console.log('🏥 KB Response:', kbRes);
      console.log('🏥 ANC Response:', ancRes);
      console.log('🏥 Imunisasi Response:', imunRes);
      console.log('🏥 Persalinan Response:', persRes);
      console.log('🏥 Kunjungan Pasien Response:', kunjRes);

      const kbFiltered = (kbRes?.data || kbRes || []).filter(item => item?.id_pasien === id_pasien);
      const ancFiltered = (ancRes?.data || ancRes || []).filter(item => item?.id_pasien === id_pasien);
      const imunFiltered = (imunRes?.data || imunRes || []).filter(item => item?.id_pasien === id_pasien);
      const persFiltered = (persRes?.data || persRes || []).filter(item => item?.id_pasien === id_pasien);
      const kunjFiltered = (kunjRes?.data || kunjRes || []).filter(item => item?.id_pasien === id_pasien);

      console.log('✅ After filtering:', {
        kb: kbFiltered.length,
        anc: ancFiltered.length,
        imunisasi: imunFiltered.length,
        persalinan: persFiltered.length,
        kunjunganPasien: kunjFiltered.length
      });

      setHistoriLayanan({
        kb: kbFiltered,
        anc: ancFiltered,
        imunisasi: imunFiltered,
        persalinan: persFiltered,
        kunjunganPasien: kunjFiltered
      });
    } catch (error) {
      console.error('Error fetching historiLayanan:', error);
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
    // Validate
    if (!formData.nama || !formData.umur || !formData.nik || !formData.no_hp || !formData.alamat) {
      showNotifikasi({
        type: 'error',
        message: 'Mohon lengkapi semua field',
        onConfirm: hideNotifikasi
      });
      return;
    }

    showNotifikasi({
      type: 'confirm-edit',
      onConfirm: async () => {
        hideNotifikasi();
        setIsLoading(true);

        try {
          const payload = {
            nama: formData.nama,
            umur: parseInt(formData.umur),
            NIK: formData.nik,
            no_hp: formData.no_hp,
            alamat: formData.alamat
          };

          const response = await pasienService.updatePasien(pasienId, payload);

          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data pasien berhasil diupdate!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: () => {
                hideNotifikasi();
                onBack();
              }
            });
          } else {
            showNotifikasi({
              type: 'error',
              message: response.message || 'Gagal mengupdate data pasien',
              onConfirm: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('Error updating pasien:', error);
          showNotifikasi({
            type: 'error',
            message: 'Terjadi kesalahan saat mengupdate data pasien',
            onConfirm: hideNotifikasi
          });
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: hideNotifikasi
    });
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="edit-pasien-page">
      {/* Header */}
      <div className="edit-pasien-header">
        <div className="edit-pasien-header-left">
          <div className="edit-pasien-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="edit-pasien-header-logo-img" />
          </div>
          <h1 className="edit-pasien-header-title">Edit Data Pasien</h1>
        </div>
        <button className="btn-kembali-edit-pasien" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="edit-pasien-content">
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

        {/* Main Form Area */}
        <main className="edit-pasien-main-area">
          {isLoading ? (
            <div className="loading-message">Loading...</div>
          ) : (
            <div className="pasien-form-container">
              <div className="pasien-form-section">
                <h2 className="pasien-form-section-title">Informasi Pasien</h2>

                <div className="pasien-form-content">
                  {/* Nama Pasien */}
                  <div className="pasien-form-group full-width">
                    <label>Nama Pasien</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Umur, NIK */}
                  <div className="pasien-form-row">
                    <div className="pasien-form-group">
                      <label>Umur (Th)</label>
                      <input
                        type="number"
                        name="umur"
                        value={formData.umur}
                        onChange={handleInputChange}
                        placeholder="Masukkan umur"
                      />
                    </div>
                    <div className="pasien-form-group">
                      <label>NIK</label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        placeholder="Masukkan NIK"
                      />
                    </div>
                  </div>

                  {/* Nomor HP */}
                  <div className="pasien-form-group full-width">
                    <label>Nomor HP</label>
                    <input
                      type="text"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      placeholder="Masukkan nomor HP"
                    />
                  </div>

                  {/* Alamat */}
                  <div className="pasien-form-group full-width">
                    <label>Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                  {/* Histori Layanan */}
                  <h2 className="pasien-form-section-title">Histori Layanan</h2>

                  {/* Layanan Program Keluarga Berencana */}
                  <div className="pasien-histori-subsection">
                    <h3 className="pasien-histori-subtitle">Layanan Program Keluarga Berencana</h3>
                    <div className="pasien-kb-container">
                      <div className="pasien-kb-label">Nomor Registrasi</div>
                      <div className="pasien-kb-select">
                        {historiLayanan.kb && historiLayanan.kb.length > 0 ? (
                          historiLayanan.kb.map(item => (
                            <div key={item.id_kb || item.id_pemeriksaan} className="pasien-kb-option">
                              {item.nomor_registrasi || item.no_registrasi || 'N/A'}
                            </div>
                          ))
                        ) : (
                          <div className="pasien-kb-option">Data tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layanan Persalinan */}
                  <div className="pasien-histori-subsection">
                    <h3 className="pasien-histori-subtitle">Layanan Persalinan</h3>
                    <div className="pasien-kb-container">
                      <div className="pasien-kb-label">Nomor Registrasi</div>
                      <div className="pasien-kb-select">
                        {historiLayanan.persalinan && historiLayanan.persalinan.length > 0 ? (
                          historiLayanan.persalinan.map(item => (
                            <div key={item.id_persalinan || item.id_pemeriksaan} className="pasien-kb-option">
                              {item.nomor_registrasi || item.no_registrasi || 'N/A'}
                            </div>
                          ))
                        ) : (
                          <div className="pasien-kb-option">Data tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layanan ANC */}
                  <div className="pasien-histori-subsection">
                    <h3 className="pasien-histori-subtitle">Layanan ANC</h3>
                    <div className="pasien-kb-container">
                      <div className="pasien-kb-label">Nomor Registrasi</div>
                      <div className="pasien-kb-select">
                        {historiLayanan.anc && historiLayanan.anc.length > 0 ? (
                          historiLayanan.anc.map(item => (
                            <div key={item.id_anc || item.id_pemeriksaan} className="pasien-kb-option">
                              {item.nomor_registrasi || item.no_registrasi || 'N/A'}
                            </div>
                          ))
                        ) : (
                          <div className="pasien-kb-option">Data tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layanan Imunisasi */}
                  <div className="pasien-histori-subsection">
                    <h3 className="pasien-histori-subtitle">Layanan Imunisasi</h3>
                    <div className="pasien-kb-container">
                      <div className="pasien-kb-label">Nomor Registrasi</div>
                      <div className="pasien-kb-select">
                        {historiLayanan.imunisasi && historiLayanan.imunisasi.length > 0 ? (
                          historiLayanan.imunisasi.map(item => (
                            <div key={item.id_imunisasi || item.id_pemeriksaan} className="pasien-kb-option">
                              {item.nomor_registrasi || item.no_registrasi || 'N/A'}
                            </div>
                          ))
                        ) : (
                          <div className="pasien-kb-option">Data tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layanan Kunjungan Pasien */}
                  <div className="pasien-histori-subsection">
                    <h3 className="pasien-histori-subtitle">Layanan Kunjungan Pasien</h3>
                    <div className="pasien-kb-container">
                      <div className="pasien-kb-label">Nomor Registrasi</div>
                      <div className="pasien-kb-select">
                        {historiLayanan.kunjunganPasien && historiLayanan.kunjunganPasien.length > 0 ? (
                          historiLayanan.kunjunganPasien.map(item => (
                            <div key={item.id_kunjungan_pasien || item.id_pemeriksaan} className="pasien-kb-option">
                              {item.nomor_registrasi || item.no_registrasi || 'N/A'}
                            </div>
                          ))
                        ) : (
                          <div className="pasien-kb-option">Data tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>





                {/* Form Actions */}
                <div className="pasien-form-actions">
                  <button
                    className="btn-pasien-submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    title="Simpan"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  <button
                    className="btn-pasien-cancel"
                    onClick={handleCancel}
                    title="Batal"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M6 6L14 14M6 14L14 6M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </div>
              </div>
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

export default EditPasien;
