import { useState } from 'react';
import './Auth.css';
import authService from '../../services/authService';

function Masuk({ onNavigate, onLogin }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.login(usernameOrEmail, password);
      
      if (result.success) {
        // Login berhasil, OTP telah dikirim - simpan email dan redirect ke verifikasi
        const emailToStore = result.email || usernameOrEmail;
        localStorage.setItem('loginEmail', emailToStore);
        console.log('[MASUK] OTP sent, redirect to verification');
        onNavigate('verifikasi-otp');
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Error login:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="form-title">Masuk</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="logo-container">
              <div className="logo">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <path d="M25 15C25 18.866 21.866 22 18 22C14.134 22 11 18.866 11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15Z" fill="#C94C8B"/>
                  <path d="M25 25C28.866 25 32 28.134 32 32C32 35.866 28.866 39 25 39C21.134 39 18 35.866 18 32C18 28.134 21.134 25 25 25Z" fill="#C94C8B"/>
                  <path d="M18 22C18 22 15 24 15 28V32C15 32 15 38 25 42C35 38 35 32 35 32V28C35 24 32 22 32 22" stroke="#C94C8B" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Username atau email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-footer">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); onNavigate('lupa-password'); }}>Lupa password</a>
            </div>
            
            {error && (
              <div style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#ffcccc',
                color: '#cc0000',
                borderRadius: '5px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
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
