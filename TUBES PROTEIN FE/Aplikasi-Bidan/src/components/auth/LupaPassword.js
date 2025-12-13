import { useState } from 'react';
import './Auth.css';
import authService from '../../services/authService';

function LupaPassword({ onBack, onLogin, onToVerifikasiOTP }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await authService.requestPasswordReset(email);
      
      if (result.success) {
        // Simpan email untuk verifikasi OTP
        localStorage.setItem('resetEmail', email);
        alert(result.message);
        onToVerifikasiOTP(email);
      } else {
        setError(result.message || 'Gagal mengirim kode reset');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError('Terjadi kesalahan saat mengirim kode reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="form-title">Lupa password</h2>
        
        <div className="form-card">
          <div className="logo-container">
            <div className="logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="22" fill="#E89AC7" opacity="0.3"/>
                <circle cx="30" cy="30" r="18" fill="#E89AC7" opacity="0.5"/>
                <circle cx="30" cy="30" r="14" fill="#E89AC7"/>
                {/* Heart with flower stem */}
                <path 
                  d="M30 38C30 38 22 32 22 27C22 24 24 22 26 22C27.5 22 29 23 30 24C31 23 32.5 22 34 22C36 22 38 24 38 27C38 32 30 38 30 38Z" 
                  fill="white"
                />
                <path 
                  d="M30 38V45" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M27 41C27 41 28 40 30 40C32 40 33 41 33 41" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{
              color: 'white',
              fontSize: '20px',
              textAlign: 'center',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              Lupa Password?
            </h3>
            
            <p style={{
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '30px',
              opacity: '0.9'
            }}>
              Masukkan email
            </p>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              {loading ? 'Memproses...' : 'Kirim'}
            </button>

            <div className="link-text">
              <a href="#" onClick={(e) => { e.preventDefault(); onLogin(); }}>
                Kembali ke Masuk
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LupaPassword;
