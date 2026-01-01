import { useState, useEffect } from 'react';
import './DataSampahLayanan.css';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

/**
 * DataSampahLayanan - Reusable trash/recovery component for services
 * @param {Object} props
 * @param {string} props.title - Service name (e.g., "KB", "ANC", "Imunisasi")
 * @param {Function} props.onBack - Handler to go back to main view
 * @param {Function} props.fetchDeleted - API function to fetch deleted records
 * @param {Function} props.restoreItem - API function to restore an item
 * @param {Function} props.deleteItemPermanent - API function to permanently delete
 * @param {Function} props.onDataChanged - Callback after restore/delete to refresh parent
 */
function DataSampahLayanan({
  title,
  onBack,
  fetchDeleted,
  restoreItem,
  deleteItemPermanent,
  onDataChanged
}) {
  const [deletedData, setDeletedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  useEffect(() => {
    loadDeletedData();
  }, []);

  const loadDeletedData = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await fetchDeleted(query);
      if (response.success && response.data) {
        setDeletedData(response.data);
      } else {
        setDeletedData([]);
      }
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
    loadDeletedData(query);
  };

  const handleRestore = async (id, nama) => {
    showNotifikasi({
      type: 'confirm-save',
      message: `Pulihkan data ${nama || 'ini'}?`,
      onConfirm: async () => {
        hideNotifikasi();
        try {
          const response = await restoreItem(id);
          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dipulihkan!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            loadDeletedData(searchQuery);
            if (onDataChanged) onDataChanged();
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

  const handlePermanentDelete = async (id, nama) => {
    showNotifikasi({
      type: 'confirm-delete',
      message: `PERINGATAN: Hapus permanen data ${nama || 'ini'}? Tindakan ini tidak dapat dibatalkan!`,
      confirmText: 'Ya, hapus permanen',
      cancelText: 'Batal',
      onConfirm: async () => {
        hideNotifikasi();
        try {
          const response = await deleteItemPermanent(id);
          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Data berhasil dihapus secara permanen',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: hideNotifikasi
            });
            loadDeletedData(searchQuery);
            if (onDataChanged) onDataChanged();
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
      <div className="dsl-header">
        <button className="dsl-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <h2 className="dsl-title">Sampah Layanan {title}</h2>
      </div>

      <div className="dsl-search-bar">
        <input
          type="text"
          className="dsl-search-input"
          placeholder="Cari Data Terhapus"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="dsl-list">
        {isLoading ? (
          <div className="dsl-loading">Memuat data...</div>
        ) : deletedData.length > 0 ? (
          deletedData.map((item, index) => (
            <div key={item.id_pemeriksaan || item.id || index} className="dsl-item">
              <div className="dsl-item-info">
                <h4>{item.nama_pasien || item.nama || 'Data Pasien'}</h4>
                <p>Dihapus: {formatDate(item.deleted_at)}</p>
                {item.jenis_layanan && <span className="dsl-badge">{item.jenis_layanan}</span>}
              </div>
              <div className="dsl-actions">
                <button
                  className="dsl-btn-restore"
                  onClick={() => handleRestore(item.id_pemeriksaan || item.id, item.nama_pasien || item.nama)}
                  title="Pulihkan Data"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                </button>
                <button
                  className="dsl-btn-delete"
                  onClick={() => handlePermanentDelete(item.id_pemeriksaan || item.id, item.nama_pasien || item.nama)}
                  title="Hapus Permanen"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="dsl-empty">Tidak ada data terhapus</div>
        )}
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
