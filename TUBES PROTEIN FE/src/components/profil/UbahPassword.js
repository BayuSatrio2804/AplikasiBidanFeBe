import React, { useState } from 'react';
import './UbahPassword.css';
import authService from '../../services/auth.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import pinkLogo from '../../assets/images/pink-logo.png';

function UbahPassword({ onBack }) {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const validateForm = () => {
    if (!passwordLama.trim()) {
      showNotifikasi({
        type: 'error',
        message: 'Password lama wajib diisi',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    if (!passwordBaru.trim()) {
      showNotifikasi({
        type: 'error',
        message: 'Password baru wajib diisi',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    if (passwordBaru.length < 6) {
      showNotifikasi({
        type: 'error',
        message: 'Password baru minimal 6 karakter',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    if (!konfirmasiPassword.trim()) {
      showNotifikasi({
        type: 'error',
        message: 'Konfirmasi password wajib diisi',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    if (passwordBaru !== konfirmasiPassword) {
      showNotifikasi({
        type: 'error',
        message: 'Password baru tidak cocok dengan konfirmasi password',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    if (passwordLama === passwordBaru) {
      showNotifikasi({
        type: 'error',
        message: 'Password baru tidak boleh sama dengan password lama',
        onConfirm: hideNotifikasi
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    showNotifikasi({
      type: 'confirm-edit',
      onConfirm: async () => {
        hideNotifikasi();
        setIsLoading(true);
        try {
          const response = await authService.updateProfile({
            password: passwordBaru,
            passwordLama: passwordLama
          });

          if (response.success) {
            showNotifikasi({
              type: 'success',
              message: 'Password berhasil diubah!',
              autoClose: true,
              autoCloseDuration: 2000,
              onConfirm: () => {
                hideNotifikasi();
                resetForm();
                if (onBack) onBack();
              }
            });
          }
        } catch (error) {
          console.error('Error changing password:', error);
          showNotifikasi({
            type: 'error',
            message: error.message || 'Gagal mengubah password',
            onConfirm: hideNotifikasi
          });
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: hideNotifikasi
    });
  };

  const resetForm = () => {
    setPasswordLama('');
    setPasswordBaru('');
    setKonfirmasiPassword('');
    setShowPasswordLama(false);
    setShowPasswordBaru(false);
    setShowKonfirmasi(false);
  };

  return (
    <div className="ubah-password-page">
      {/* Header */}
      <header className="ubah-password-header-page">
        <div className="ubah-password-header-left">
          <div className="ubah-password-header-icon">
            <img src={pinkLogo} alt="Pink Logo" className="ubah-password-header-logo-img" />
          </div>
          <h1 className="ubah-password-header-title">Ubah Password</h1>
        </div>
        <button className="btn-kembali-ubah" onClick={onBack}>Kembali</button>
      </header>

      {/* Content */}
      <div className="ubah-password-content">
        <div className="ubah-password-card">
          {/* Left - Avatar */}
          <div className="ubah-password-left">
            <div className="ubah-password-avatar">
              <img src={pinkLogo} alt="Logo" className="ubah-password-avatar-img" />
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} className="ubah-password-form-section">
            {/* Password Lama */}
            <div className="ubah-password-form-field">
              <label htmlFor="passwordLama">Password Lama</label>
              <div className="ubah-password-form-input-wrapper">
                <input
                  id="passwordLama"
                  type={showPasswordLama ? 'text' : 'password'}
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  placeholder="Masukkan password lama"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="ubah-password-form-toggle"
                  onClick={() => setShowPasswordLama(!showPasswordLama)}
                  disabled={isLoading}
                >
                  {showPasswordLama ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div className="ubah-password-form-field">
              <label htmlFor="passwordBaru">Password Baru</label>
              <div className="ubah-password-form-input-wrapper">
                <input
                  id="passwordBaru"
                  type={showPasswordBaru ? 'text' : 'password'}
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="ubah-password-form-toggle"
                  onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                  disabled={isLoading}
                >
                  {showPasswordBaru ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordBaru && (
                <div className="ubah-password-strength">
                  Panjang: {passwordBaru.length} karakter {passwordBaru.length >= 6 ? '✓' : ''}
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="ubah-password-form-field">
              <label htmlFor="konfirmasiPassword">Konfirmasi Password</label>
              <div className="ubah-password-form-input-wrapper">
                <input
                  id="konfirmasiPassword"
                  type={showKonfirmasi ? 'text' : 'password'}
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="ubah-password-form-toggle"
                  onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                  disabled={isLoading}
                >
                  {showKonfirmasi ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {konfirmasiPassword && passwordBaru && (
                <div className={`ubah-password-match ${passwordBaru === konfirmasiPassword ? 'match' : 'mismatch'}`}>
                  {passwordBaru === konfirmasiPassword ? '✓ Password cocok' : '✗ Password tidak cocok'}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-form-ubah"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Simpan'}
            </button>
          </form>
        </div>
      </div>

      {/* Notifikasi */}
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

export default UbahPassword;
