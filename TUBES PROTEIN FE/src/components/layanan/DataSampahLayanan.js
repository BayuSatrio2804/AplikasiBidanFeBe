import { useState, useEffect } from 'react';
import './DataSampahLayanan.css';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import layananService from '../../services/layanan.service';

/**
 * DataSampahLayanan - Global recovery component for all services
 */
function DataSampahLayanan({ onBack }) {
  const [deletedData, setDeletedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  useEffect(() => {
    loadAllDeletedData();
  }, []);

  const loadAllDeletedData = async (query = '') => {
    setIsLoading(true);
    try {
      // Fetch deleted data from all services concurrently
      const [kb, anc, imunisasi, persalinan, kunjungan] = await Promise.all([
        layananService.getDeletedKB(query),
        layananService.getDeletedANC(query),
        layananService.getDeletedImunisasi(query),
        layananService.getDeletedPersalinan(query),
        layananService.getDeletedKunjunganPasien(query)
      ]);

      const processData = (response, type) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map(item => ({ ...item, jenis_layanan: type }));
        }
        return [];
      };

      const allData = [
        ...processData(kb, 'KB'),
        ...processData(anc, 'ANC'),
        ...processData(imunisasi, 'Imunisasi'),
        ...processData(persalinan, 'Persalinan'),
        ...processData(kunjungan, 'Kunjungan Pasien')
      ];

      // Sort by deleted_at desc
      allData.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));

      setDeletedData(allData);
    } catch (error) {
      console.error('Error fetching deleted data:', error);
      setDeletedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    loadAllDeletedData(query);
  };

  const getServiceFunctions = (type) => {
    switch (type) {
      case 'KB': return { restore: layananService.restoreKB, deletePerm: layananService.deletePermanentKB };
      case 'ANC': return { restore: layananService.restoreANC, deletePerm: layananService.deletePermanentANC };
      case 'Imunisasi': return { restore: layananService.restoreImunisasi, deletePerm: layananService.deletePermanentImunisasi };
      case 'Persalinan': return { restore: layananService.restorePersalinan, deletePerm: layananService.deletePermanentPersalinan };
      case 'Kunjungan Pasien': return { restore: layananService.restoreKunjunganPasien, deletePerm: layananService.deletePermanentKunjunganPasien };
      default: return null;
    }
  };

  const handleRestore = async (id, nama, type) => {
    const service = getServiceFunctions(type);
    if (!service) return;

    showNotifikasi({
      type: 'confirm-save',
      message: `Apakah Anda ingin melakukan pemulihan (restore) terhadap data "${nama || 'ini'}"?`,
      onConfirm: async () => {
        hideNotifikasi();
        try {
          const response = await service.restore(id);
          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dipulihkan!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            loadAllDeletedData(searchQuery);
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

  const handlePermanentDelete = async (id, nama, type) => {
    const service = getServiceFunctions(type);
    if (!service) return;

    showNotifikasi({
      type: 'confirm-delete',
      message: `PERINGATAN: Hapus permanen data ${nama || 'ini'} (${type})? Tindakan ini tidak dapat dibatalkan!`,
      confirmText: 'Ya, hapus permanen',
      cancelText: 'Batal',
      onConfirm: async () => {
        hideNotifikasi();
        try {
          const response = await service.deletePerm(id);
          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dihapus secara permanen',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            loadAllDeletedData(searchQuery);
          } else {
            showNotifikasi({
              type: 'error',
              message: response.message || 'Gagal menghapus data',
              onConfirm: hideNotifikasi
            });
          }
        } catch (error) {
          console.error('Error deleting permanently:', error);
          showNotifikasi({
            type: 'error',
            message: 'Terjadi kesalahan saat menghapus data',
            onConfirm: hideNotifikasi
          });
        }
      },
      onCancel: hideNotifikasi
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="data-sampah-layanan">
      <div className="dsl-card-header">
        <div className="dsl-search-bar">
          <input
            type="text"
            className="dsl-search-input"
            placeholder="Cari Data Layanan Pasien"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="dsl-card-body">
        <div className="dsl-list">
          {isLoading ? (
            <div className="dsl-empty">Memuat data...</div>
          ) : deletedData.length > 0 ? (
            deletedData.map((item, index) => (
              <div key={item.id_pemeriksaan || item.id || index} className="dsl-item">
                <div className="dsl-item-info">
                  <h4>{item.nama_pasien || item.nama || 'Data Pasien'}</h4>
                  <p className="dsl-service-type">Jenis Layanan: {item.jenis_layanan}</p>
                  <p>Dihapus: {formatDate(item.deleted_at)}</p>
                </div>
                <div className="dsl-actions">
                  <button
                    className="dsl-btn-delete"
                    onClick={() => handlePermanentDelete(item.id_pemeriksaan || item.id, item.nama_pasien || item.nama, item.jenis_layanan)}
                    title="Hapus Permanen"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/delete-trash.png"
                      alt="Delete"
                      style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                    />
                  </button>
                  <button
                    className="dsl-btn-restore"
                    onClick={() => handleRestore(item.id_pemeriksaan || item.id, item.nama_pasien || item.nama, item.jenis_layanan)}
                    title="Pulihkan Data"
                  >
                    <img
                      src="https://img.icons8.com/windows/32/settings-backup-restore.png"
                      alt="Restore"
                      style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="dsl-empty">Data tidak ditemukan.</div>
          )}
        </div>
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

export default DataSampahLayanan;
