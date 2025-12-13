import { useState } from 'react';
import './Auth.css';
import authService from '../../services/authService';

function ResetPassword({ onBack, onReset }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const resetEmail = localStorage.getItem('resetEmail');
      
      if (!resetEmail) {
        setError('Email tidak ditemukan. Silakan coba lagi dari awal.');
        return;
      }

      const result = await authService.resetPassword(resetEmail, newPassword);
      
      if (result.success) {
        alert(result.message);
        localStorage.removeItem('resetEmail');
        onReset();
      } else {
        setError(result.message || 'Gagal mereset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Terjadi kesalahan saat mereset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="form-title">Reset Password</h2>
        
        <div className="form-card">
          <div className="logo-container">
            <div className="logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="22" fill="#E89AC7" opacity="0.3"/>
                <circle cx="30" cy="30" r="18" fill="#E89AC7" opacity="0.5"/>
                <circle cx="30" cy="30" r="14" fill="#E89AC7"/>
                {/* Key icon */}
                <circle cx="22" cy="30" r="6" fill="none" stroke="white" strokeWidth="2"/>
                <path d="M28 36L38 46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="36" cy="44" r="2" fill="white"/>
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
              Reset Password
            </h3>
            
            <p style={{
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '30px',
              opacity: '0.9'
            }}>
              Masukkan password baru Anda
            </p>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </span>
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </span>
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
              {loading ? 'Memproses...' : 'Reset Password'}
            </button>

            <div className="link-text">
              <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                Kembali
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
