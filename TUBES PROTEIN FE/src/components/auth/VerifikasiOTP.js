import { useState, useRef, useEffect } from 'react';
import './Auth.css';
import authService from '../../services/auth.service';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import pinkLogo from '../../assets/images/pink-logo.png';

function VerifikasiOTP({ onBack, onVerified, email, usernameOrEmail }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  useEffect(() => {
    showNotifikasi({
      type: 'otp-sent',
      message: 'Kode verifikasi telah dikirim ke email Anda. Silakan periksa kotak masuk.',
      onConfirm: hideNotifikasi,
      onCancel: hideNotifikasi
    });
  }, []);

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

    if (otpCode.length !== 6) {
      setError('Masukkan kode OTP lengkap 6 digit');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authService.verifyOTP({
        usernameOrEmail,
        otp_code: otpCode,
      });

      if (response.success) {
        onVerified(response.data.user);
      } else {
        setError(response.message || 'Verifikasi OTP gagal');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Terjadi kesalahan saat verifikasi OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await authService.resendOTP({ usernameOrEmail });

      if (response.success) {
        alert('Kode OTP telah dikirim ulang ke ' + email);
        setOtp(['', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();
      } else {
        setError('Gagal mengirim ulang OTP: ' + response.message);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError(error.message || 'Terjadi kesalahan saat mengirim ulang OTP');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="form-card">
          <div className="logo-container">
            <div className="logo">
              <img src={pinkLogo} alt="Pink Logo" className="auth-logo-img" />
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
              disabled={otp.join('').length !== 6}
              style={{
                opacity: otp.join('').length !== 6 ? 0.5 : 1,
                cursor: otp.join('').length !== 6 ? 'not-allowed' : 'pointer'
              }}
            >
              Kirim
            </button>

            <div className="link-text">
              <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                Kembali
              </a>
            </div>
          </form>
        </div>
      </div>
      <Notifikasi
        show={notifikasi.show}
        type={notifikasi.type}
        message={notifikasi.message}
        detail={notifikasi.detail}
        onConfirm={notifikasi.onConfirm}
        onCancel={notifikasi.onCancel}
      />
    </div>
  );
}

export default VerifikasiOTP;
