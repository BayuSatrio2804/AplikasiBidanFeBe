import { useState } from 'react';
import './Auth.css';
import eyeIcon from '../../assets/images/icons/icons8-eye-100.png';
import pinkLogo from '../../assets/images/pink-logo.png';
import authService from '../../services/auth.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function BuatAkun({ onNavigate }) {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ingatSaya, setIngatSaya] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.register({
        nama_lengkap: namaLengkap,
        username,
        email,
        password,
      });

      if (response.success) {
        showNotifikasi({
          type: 'register-success',
          onConfirm: () => {
            hideNotifikasi();
            onNavigate('masuk');
          },
          onCancel: () => {
            hideNotifikasi();
            onNavigate('masuk');
          }
        });
      } else {
        setError(response.message || 'Gagal membuat akun');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError(error.message || 'Terjadi kesalahan saat membuat akun');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back-button" onClick={() => onNavigate('beranda')}>
        Kembali
      </button>
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="logo-container">
              <div className="logo">
                <img src={pinkLogo} alt="Pink Logo" className="auth-logo-img" />
              </div>
            </div>

            {error && (
              <div className="error-message" style={{
                color: '#D32F2F',
                textAlign: 'center',
                marginBottom: '15px',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                fontWeight: '500',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Buat username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={`eye-icon ${!showPassword ? 'eye-slash' : ''}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  src={eyeIcon}
                  alt={showPassword ? "Sembunyikan" : "Tampilkan"}
                  style={{
                    width: '20px',
                    height: '20px',
                    opacity: showPassword ? '1' : '0.5',
                    transition: 'opacity 0.2s',
                    filter: 'brightness(0)'
                  }}
                />
              </span>
            </div>

            <div className="form-footer-center">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={ingatSaya}
                  onChange={(e) => setIngatSaya(e.target.checked)}
                />
                <span>Ingat Saya</span>
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Buat Akun'}
            </button>

            <div className="link-text">
              Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('masuk'); }}>Masuk</a>
            </div>
          </div>
        </form>

        <Notifikasi
          show={notifikasi.show}
          type={notifikasi.type}
          message={notifikasi.message}
          detail={notifikasi.detail}
          onConfirm={notifikasi.onConfirm}
          onCancel={notifikasi.onCancel}
        />
      </div>
    </div>
  );
}

export default BuatAkun;
