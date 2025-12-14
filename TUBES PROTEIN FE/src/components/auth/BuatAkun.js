import { useState } from 'react';
import './Auth.css';
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
        <h2 className="form-title">Buat Akun</h2>
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
            
            {error && (
              <div className="error-message" style={{ 
                color: '#ff6b6b', 
                textAlign: 'center', 
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '5px'
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
              <span className="eye-icon">👁</span>
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
