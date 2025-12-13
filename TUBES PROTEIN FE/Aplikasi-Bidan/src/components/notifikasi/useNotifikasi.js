import { useState } from 'react';

/**
 * Custom hook untuk mengelola notifikasi
 * Contoh penggunaan:
 * 
 * const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
 * 
 * showNotifikasi({
 *   type: 'confirm-save',
 *   message: 'Custom message',
 *   onConfirm: () => { console.log('confirmed'); hideNotifikasi(); },
 *   onCancel: hideNotifikasi
 * });
 */

export const useNotifikasi = () => {
  const [notifikasi, setNotifikasi] = useState({
    show: false,
    type: 'success',
    message: '',
    detail: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Ya',
    cancelText: 'Tidak',
    autoClose: false,
    autoCloseDuration: 3000
  });

  const showNotifikasi = (config) => {
    setNotifikasi({
      show: true,
      type: config.type || 'success',
      message: config.message || '',
      detail: config.detail || '',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      confirmText: config.confirmText || 'Ya',
      cancelText: config.cancelText || 'Tidak',
      autoClose: config.autoClose !== undefined ? config.autoClose : false,
      autoCloseDuration: config.autoCloseDuration || 3000
    });
  };

  const hideNotifikasi = () => {
    setNotifikasi(prev => ({ ...prev, show: false }));
  };

  return {
    notifikasi,
    showNotifikasi,
    hideNotifikasi
  };
};

export default useNotifikasi;
