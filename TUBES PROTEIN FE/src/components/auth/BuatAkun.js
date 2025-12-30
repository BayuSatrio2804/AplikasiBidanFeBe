import { useState } from 'react';
import './Auth.css';
import eyeIcon from '../../assets/images/icons/icons8-eye-100.png';
import pinkLogo from '../../assets/images/pink-logo.png';
import authService from '../../services/auth.service';

function BuatAkun({ onNavigate }) {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ingatSaya, setIngatSaya] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        alert('Akun berhasil dibuat! Silakan login menggunakan akun Anda.');
        onNavigate('masuk');
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

            <div className="form-group password-group">
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye-icon">
                <img src={eyeIcon} alt="Show" style={{ width: '20px', height: '20px', opacity: '0.5' }} />
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
      </div>
    </div>
  );
}

export default BuatAkun;
