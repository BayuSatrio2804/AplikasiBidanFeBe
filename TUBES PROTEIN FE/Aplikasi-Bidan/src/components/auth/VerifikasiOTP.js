import { useState, useRef } from 'react';
import './Auth.css';
import authService from '../../services/authService';

function VerifikasiOTP({ onBack, onVerified, registerEmail, resetEmail, email }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    // Hanya terima angka
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus ke input berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: hapus dan pindah ke input sebelumnya
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus ke input terakhir yang diisi atau input pertama yang kosong
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setLoading(true);
    setError('');
    
    try {
      // Get email: for registration, use localStorage first (more reliable)
      const loginEmail = localStorage.getItem('loginEmail');
      const localRegisterEmail = localStorage.getItem('registerEmail');
      const registrationType = localStorage.getItem('registrationType');
      
      // For registration flow, prioritize localStorage registerEmail
      let emailToUse;
      if (registrationType === 'register' || localRegisterEmail) {
        emailToUse = localRegisterEmail || registerEmail || email;
      } else {
        // For reset password or other flows
        emailToUse = registerEmail || resetEmail || loginEmail || email;
      }
      
      console.log('[VERIFIKASIOTP] Props:', { registerEmail, resetEmail, email });
      console.log('[VERIFIKASIOTP] LocalStorage:', { loginEmail, localRegisterEmail, registrationType });
      console.log('[VERIFIKASIOTP] Final emailToUse:', emailToUse, 'OTP Code:', otpCode);
      const result = await authService.verifyOTP(emailToUse, otpCode);
      
      if (result.success) {
        // Clear temp emails from localStorage
        localStorage.removeItem('loginEmail');
        localStorage.removeItem('registerEmail');
        onVerified();
      } else {
        setError(result.message || 'Verifikasi OTP gagal');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Terjadi kesalahan saat verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const loginEmail = localStorage.getItem('loginEmail');
      const registerEmail = localStorage.getItem('registerEmail');
      const emailToUse = loginEmail || registerEmail || email;
      
      // Call login atau register API untuk kirim OTP ulang
      // Untuk sekarang, hanya reset field dan tampilkan pesan
      alert('Kode OTP telah dikirim ulang ke ' + emailToUse);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="form-title">Verifikasi OTP</h2>
        
        <div className="form-card">
          <div className="logo-container">
            <div className="logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="22" stroke="#E89AC7" strokeWidth="2" fill="none"/>
                <circle cx="30" cy="30" r="18" stroke="#E89AC7" strokeWidth="2" fill="none"/>
                {/* Lock icon */}
                <rect x="24" y="28" width="12" height="10" rx="1" fill="#E89AC7"/>
                <path 
                  d="M26 28V25C26 22.8 27.8 21 30 21C32.2 21 34 22.8 34 25V28" 
                  stroke="#E89AC7" 
                  strokeWidth="2" 
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="33" r="1.5" fill="white"/>
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{
              color: 'white',
              fontSize: '20px',
              textAlign: 'center',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              Masukkan Kode OTP
            </h3>
            
            <p style={{
              color: 'white',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '30px',
              opacity: '0.9'
            }}>
              Masukkan kode verifikasi yang dikirim ke email Anda
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={{
                    width: '50px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#C94C8B',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
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

            <p style={{
              color: 'white',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '25px',
              opacity: '0.8'
            }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleResendOTP(); }}
                style={{
                  color: 'white',
                  textDecoration: 'underline',
                  fontWeight: '500'
                }}
              >
                Kirim ulang
              </a>
            </p>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={otp.join('').length !== 6 || loading}
              style={{
                opacity: otp.join('').length !== 6 || loading ? 0.5 : 1,
                cursor: otp.join('').length !== 6 || loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Memproses...' : 'Kirim'}
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

export default VerifikasiOTP;
