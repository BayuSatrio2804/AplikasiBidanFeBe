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
 * - 'cek-email': Notifikasi Cek Email
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
    console.log('Notifikasi render - show:', show, 'type:', type, 'message:', message);
  }, [show, type, message]);

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
      case 'delete-success':
        return 'Berhasil!';
      case 'error':
        return 'Oops! Penyimpanan Gagal';
      case 'confirm-logout':
        return 'Konfirmasi Keluar Akun';
      case 'success-login':
        return 'Selamat!';
      case 'cek-email':
        return 'Cek Email Anda!';
      case 'register-success':
        return 'Berhasil!';
      case 'otp-sent':
        return 'Perhatian!';
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
        return 'Apakah Anda yakin untuk menghapus data berikut?';
      case 'success':
        return 'Data berhasil tersimpan dengan aman di sistem.';
      case 'delete-success':
        return 'Data Anda telah berhasil dihapus.';
      case 'error':
        return 'Mohon lengkapi data yang kosong atau perbaiki data yang salah';
      case 'confirm-logout':
        return 'Apakah Anda yakin ingin keluar dari sistem? Pastikan semua pekerjaan telah tersimpan.';
      case 'success-login':
        return 'Anda telah berhasil masuk.';
      case 'cek-email':
        return 'Link verifikasi telah dikirim ke email Anda. Silakan cek inbox atau folder spam Anda.';
      case 'register-success':
        return 'Akun Anda telah berhasil dibuat.';
      default:
        return '';
    }
  };

  const isConfirmDialog = ['confirm-save', 'confirm-edit', 'confirm-delete', 'confirm-logout'].includes(type);
  const isSuccessNotif = ['success', 'success-login', 'cek-email', 'register-success', 'otp-sent', 'delete-success'].includes(type);

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
                  onClick={() => {
                    console.log('Cancel button clicked');
                    if (onCancel) onCancel();
                  }}
                >
                  {cancelText}
                </button>
                <button
                  className="notifikasi-btn notifikasi-btn-confirm"
                  onClick={() => {
                    console.log('Confirm button clicked');
                    if (onConfirm) onConfirm();
                  }}
                >
                  {confirmText}
                </button>
              </>
            ) : isSuccessNotif ? (
              <button
                className="notifikasi-btn-close"
                onClick={onConfirm || onCancel}
              >
                ✕
              </button>
            ) : (
              <>
                <button
                  className="notifikasi-btn notifikasi-btn-cancel"
                  onClick={() => {
                    console.log('Tutup button clicked');
                    if (onCancel) {
                      onCancel();
                    } else if (onConfirm) {
                      onConfirm();
                    }
                  }}
                >
                  {cancelText === 'Tidak' ? 'Tutup' : cancelText}
                </button>
                <button
                  className="notifikasi-btn notifikasi-btn-confirm"
                  onClick={() => {
                    console.log('Periksa button clicked');
                    if (onConfirm) onConfirm();
                  }}
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
