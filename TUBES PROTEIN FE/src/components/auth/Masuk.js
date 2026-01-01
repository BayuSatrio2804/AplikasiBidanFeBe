import { useState } from 'react';
import './Auth.css';
import eyeIcon from '../../assets/images/icons/icons8-eye-100.png';
import pinkLogo from '../../assets/images/pink-logo.png';
import authService from '../../services/auth.service';

function Masuk({ onNavigate, onLogin }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        usernameOrEmail,
        password,
      });

      if (response.success) {
        // Login berhasil, OTP dikirim ke email
        onNavigate('verifikasi-otp', {
          email: response.data?.email || response.email,
          usernameOrEmail
        });
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Error login:', error);
      setError(error.message || 'Terjadi kesalahan saat login');
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
                placeholder="Username atau email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group password-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
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

            <div className="form-footer">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); onNavigate('lupa-password'); }}>Lupa password</a>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="link-text">
              Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('buat-akun'); }}>Buat Akun</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Masuk;