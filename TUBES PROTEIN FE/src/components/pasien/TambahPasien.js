import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import './EditPasien.css'; // Reuse valid styles
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasien.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function TambahPasien({
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
    const [formData, setFormData] = useState({
        nama: '',
        umur: '',
        nik: '',
        no_hp: '',
        alamat: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

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

        setIsLoading(true);

        try {
            const payload = {
                nama: formData.nama,
                umur: parseInt(formData.umur),
                NIK: formData.nik, // Ensure casing matches backend expectation (NIK vs nik)
                no_hp: formData.no_hp,
                alamat: formData.alamat
            };

            const response = await pasienService.createPasien(payload);

            if (response.success) {
                showNotifikasi({
                    type: 'success',
                    message: 'Pasien berhasil ditambahkan!',
                    autoClose: true,
                    autoCloseDuration: 2000,
                    onConfirm: () => {
                        hideNotifikasi();
                        onBack(); // Go back to list
                    }
                });
            } else {
                showNotifikasi({
                    type: 'error',
                    message: response.message || 'Gagal menambahkan pasien',
                    onConfirm: hideNotifikasi
                });
            }
        } catch (error) {
            console.error('Error creating pasien:', error);
            showNotifikasi({
                type: 'error',
                message: 'Terjadi kesalahan saat menambahkan pasien',
                onConfirm: hideNotifikasi
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="edit-pasien-page"> {/* Reuse styling class */}
            {/* Header */}
            <div className="edit-pasien-header">
                <div className="edit-pasien-header-left">
                    <div className="edit-pasien-header-logo">
                        <img src={pinkLogo} alt="Pink Logo" className="edit-pasien-header-logo-img" />
                    </div>
                    <h1 className="edit-pasien-header-title">Formulir Informasi Pasien</h1>
                </div>
                <button className="btn-kembali-edit-pasien" onClick={onBack}>Kembali</button>
            </div>

            {/* Main Content */}
            <div className="edit-pasien-content">
                {/* Sidebar */}
                <Sidebar
                    activePage="data-pasien" // Highlight Data Pasien menu
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
                                            placeholder="Masukkan NIK (16 digit)"
                                            maxLength={16}
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

                                {/* Form Actions */}
                                <div className="pasien-form-actions">
                                    <button
                                        className="btn-pasien-cancel"
                                        onClick={onBack}
                                        title="Batal"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        className="btn-pasien-submit"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        title="Simpan"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default TambahPasien;
