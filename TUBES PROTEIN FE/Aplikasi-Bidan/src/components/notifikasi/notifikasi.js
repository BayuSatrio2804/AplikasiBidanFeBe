import React from 'react';
import './Notifikasi.css';
import pinkLogo from '../../assets/images/pink-logo.png';

/**
 * Komponen Notifikasi Reusable
 * Types:
 * - 'confirm-save': Konfirmasi Penyimpanan
 * - 'confirm-edit': Konfirmasi Perubahan
 * - 'confirm-delete': Peringatan Hapus
 * - 'success': Notifikasi Berhasil
 * - 'error': Notifikasi Gagal
 * - 'confirm-logout': Konfirmasi Logout
 * - 'success-login': Notifikasi Berhasil Login
 */

function Notifikasi({ 
  type = 'success', 
  message, 
  detail,
  onConfirm, 
  onCancel,
  show = false,
  confirmText = 'Ya',
  cancelText = 'Tidak',
  autoClose = false,
  autoCloseDuration = 3000
}) {
  
  React.useEffect(() => {
    if (show && autoClose && (type === 'success' || type === 'success-login')) {
      const timer = setTimeout(() => {
        if (onConfirm) onConfirm();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, type, onConfirm, autoCloseDuration]);

  if (!show) return null;

  const getTitle = () => {
    switch (type) {
      case 'confirm-save':
        return 'Konfirmasi Penyimpanan';
      case 'confirm-edit':
        return 'Konfirmasi Perubahan';
      case 'confirm-delete':
        return 'Peringatan';
      case 'success':
        return 'Berhasil!';
      case 'error':
        return 'Oops! Penyimpanan Gagal';
      case 'confirm-logout':
        return 'Konfirmasi Keluar Akun';
      case 'success-login':
        return 'Selamat!';
      default:
        return message;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'confirm-save':
        return 'Apakah Anda yakin untuk menyimpan data berikut?';
      case 'confirm-edit':
        return 'Perubahan yang Anda buat akan disimpan. Lanjutkan?';
      case 'confirm-delete':
        return 'Apakah Anda yakin untuk menghapus data berikut? Data yang sudah dihapus tidak dapat dipulihkan.';
      case 'success':
        return 'Data berhasil tersimpan dengan aman di sistem.';
      case 'error':
        return 'Terjadi kendala saat menyimpan data. Silakan periksa kembali!';
      case 'confirm-logout':
        return 'Apakah Anda yakin ingin keluar dari sistem? Pastikan semua pekerjaan telah tersimpan.';
      case 'success-login':
        return 'Anda telah berhasil masuk.';
      default:
        return '';
    }
  };

  const isConfirmDialog = ['confirm-save', 'confirm-edit', 'confirm-delete', 'confirm-logout'].includes(type);
  const isSuccessNotif = ['success', 'success-login'].includes(type);

  return (
    <div className="notifikasi-overlay" onClick={isConfirmDialog ? null : onCancel}>
      <div className="notifikasi-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notifikasi-icon-wrapper">
          <img src={pinkLogo} alt="Icon" className="notifikasi-icon" />
        </div>
        
        <div className="notifikasi-content">
          <h3 className="notifikasi-title">{getTitle()}</h3>
          <p className="notifikasi-message">{getMessage()}</p>
          {detail && <p className="notifikasi-detail">{detail}</p>}
          
          <div className="notifikasi-actions">
            {isConfirmDialog ? (
              <>
                <button 
                  className="notifikasi-btn notifikasi-btn-cancel" 
                  onClick={onCancel}
                >
                  {cancelText}
                </button>
                <button 
                  className="notifikasi-btn notifikasi-btn-confirm" 
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              </>
            ) : isSuccessNotif ? (
              !autoClose && (
                <button 
                  className="notifikasi-btn-close"
                  onClick={onConfirm || onCancel}
                >
                  ✕
                </button>
              )
            ) : (
              <>
                <button 
                  className="notifikasi-btn notifikasi-btn-cancel" 
                  onClick={onCancel}
                >
                  {cancelText === 'Tidak' ? 'Tutup' : cancelText}
                </button>
                <button 
                  className="notifikasi-btn notifikasi-btn-confirm" 
                  onClick={onConfirm}
                >
                  {confirmText === 'Ya' ? 'Periksa' : confirmText}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifikasi;
