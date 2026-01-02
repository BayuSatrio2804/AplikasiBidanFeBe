import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './DataSampah.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import pasienService from '../../services/pasien.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function DataSampah({
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
    const [deletedPasien, setDeletedPasien] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

    useEffect(() => {
        fetchDeletedData();
    }, []);

    const fetchDeletedData = async (query = '') => {
        setIsLoading(true);
        try {
            const response = await pasienService.getDeletedPasien(query);
            if (response.success && response.data) {
                setDeletedPasien(response.data);
            } else {
                setDeletedPasien([]);
            }
        } catch (error) {
            console.error('Error fetching deleted data:', error);
            // Optional: don't show error immediately on load to keep UI clean
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchDeletedData(query);
    };

    const handleRestore = async (id, nama) => {
        showNotifikasi({
            type: 'confirm-save', // Reusing confirm dialog
            message: `Apakah Anda ingin melakukan pemulihan (restore) terhadap data "${nama}"?`,
            onConfirm: async () => {
                hideNotifikasi();
                try {
                    const response = await pasienService.restorePasien(id);
                    if (response.success) {
                        showNotifikasi({
                            type: 'success',
                            message: 'Data berhasil dipulihkan!',
                            autoClose: true,
                            autoCloseDuration: 2000,
                            onConfirm: hideNotifikasi
                        });
                        fetchDeletedData(searchQuery);
                    } else {
                        showNotifikasi({
                            type: 'error',
                            message: response.message || 'Gagal memulihkan data',
                            onConfirm: hideNotifikasi
                        });
                    }
                } catch (error) {
                    console.error('Error restoring data:', error);
                    showNotifikasi({
                        type: 'error',
                        message: 'Terjadi kesalahan saat memulihkan data',
                        onConfirm: hideNotifikasi
                    });
                }
            },
            onCancel: hideNotifikasi
        });
    };

    const handlePermanentDelete = (pasienId) => {
        showNotifikasi({
            type: 'confirm-delete',
            message: 'Penghapusan ini bersifat permanen. Apakah Anda yakin ingin melanjutkan?',
            confirmText: 'Ya, hapus',
            cancelText: 'Batal',
            onConfirm: async () => {
                hideNotifikasi();
                try {
                    const response = await pasienService.deletePasienPermanent(pasienId);
                    if (response.success) {
                        showNotifikasi({
                            type: 'delete-success',
                            autoClose: true,
                            onConfirm: hideNotifikasi
                        });
                        fetchDeletedData(searchQuery);
                    } else {
                        showNotifikasi({
                            type: 'error',
                            message: response.message || 'Gagal menghapus data permanen',
                            onConfirm: hideNotifikasi
                        });
                    }
                } catch (error) {
                    console.error('Error deleting pasien permanently:', error);
                    showNotifikasi({
                        type: 'error',
                        message: 'Terjadi kesalahan saat menghapus data permanen',
                        onConfirm: hideNotifikasi
                    });
                }
            },
            onCancel: hideNotifikasi
        });
    };

    return (
        <div className="data-sampah-page">
            {/* Header */}
            <div className="ds-header">
                <div className="ds-header-left">
                    <div className="ds-header-logo">
                        <img src={pinkLogo} alt="Pink Logo" className="ds-header-logo-img" />
                    </div>
                    <h1 className="ds-header-title">Data Sampah (Recovery)</h1>
                </div>
                <button className="btn-kembali-ds" onClick={onBack}>Kembali</button>
            </div>

            {/* Content */}
            <div className="ds-content">
                <Sidebar
                    activePage="data-sampah"
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

                <main className="ds-main-area">
                    <div className="ds-section-card">
                        <h2 className="ds-section-title">Riwayat Data Pasien Dihapus</h2>
                        
                        <div className="ds-search-row">
                            <input
                                type="text"
                                className="ds-search-input"
                                placeholder="Cari Data Pasien"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="ds-list">
                            {isLoading ? (
                                <div className="ds-loading">Memuat data...</div>
                            ) : deletedPasien.length > 0 ? (
                                deletedPasien.map(item => (
                                    <div key={item.id_pasien} className="ds-item">
                                        <div className="ds-item-info">
                                            <h4>{item.nama}</h4>
                                            <p>Dihapus: {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString('id-ID') : 'N/A'}</p>
                                        </div>
                                        <div className="ds-actions">
                                            <button
                                                className="btn-restore"
                                                onClick={() => handleRestore(item.id_pasien, item.nama)}
                                                title="Pulihkan Data"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="1 4 1 10 7 10"></polyline>
                                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                                </svg>
                                            </button>
                                            <button
                                                className="btn-delete-perm"
                                                onClick={() => handlePermanentDelete(item.id_pasien)}
                                                title="Hapus Permanen"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="ds-empty">
                                    Data tidak ditemukan.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

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

export default DataSampah;
