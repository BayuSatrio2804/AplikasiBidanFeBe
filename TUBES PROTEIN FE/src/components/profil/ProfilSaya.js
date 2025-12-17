import { useState, useEffect } from 'react';
import './ProfilSaya.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import passwordIcon from '../../assets/images/icons/icons8-password-100.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import authService from '../../services/auth.service';

function ProfilSaya({ onBack, userData }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use props first, fallback to API
        if (userData) {
          setEmail(userData.email || '');
          setUsername(userData.username || '');
        } else {
          const response = await authService.getProfile();
          if (response.data) {
            setEmail(response.data.email || '');
            setUsername(response.data.username || '');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updateData = { email, username };
      if (password) {
        updateData.password = password;
      }
      
      await authService.updateProfile(updateData);
      
      showNotifikasi({
        type: 'success',
        message: 'Profil berhasil diperbarui!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: hideNotifikasi
      });
      setPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotifikasi({
        type: 'error',
        message: error.message || 'Gagal memperbarui profil',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profil-page">
      {/* Header */}
      <header className="profil-header">
        <div className="profil-header-left">
          <div className="profil-header-icon">
            <img src={pinkLogo} alt="Pink Logo" className="profil-header-logo-img" />
          </div>
          <h1 className="profil-header-title">Profil Saya</h1>
        </div>
        <button className="btn-kembali" onClick={onBack}>Kembali</button>
      </header>

      {/* Content */}
      <div className="profil-content">
        <div className="profil-card">
          <form onSubmit={handleSave}>
            <div className="profil-layout">
              {/* Left Section - Avatar */}
              <div className="profil-left">
                <div className="profil-avatar">
                  <img src={pinkLogo} alt="Logo" className="profil-avatar-img" />
                </div>
              </div>

              {/* Right Section - Form */}
              <div className="profil-right">
                <h2 className="profil-section-title">Identitas Pengguna</h2>
                
                {/* Email Field */}
                <div className="profil-field">
                  <div className="profil-icon">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="white">
                      <path d="M29.1667 5.83334H5.83333C4.21667 5.83334 2.9275 7.14584 2.9275 8.75001L2.91667 26.25C2.91667 27.8542 4.21667 29.1667 5.83333 29.1667H29.1667C30.7833 29.1667 32.0833 27.8542 32.0833 26.25V8.75001C32.0833 7.14584 30.7833 5.83334 29.1667 5.83334ZM29.1667 11.6667L17.5 18.9583L5.83333 11.6667V8.75001L17.5 16.0417L29.1667 8.75001V11.6667Z"/>
                    </svg>
                  </div>
                  <div className="profil-input-container">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email@domain.com"
                      required
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div className="profil-field">
                  <div className="profil-icon">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="white">
                      <path d="M17.5 17.5C21.525 17.5 24.7917 14.2333 24.7917 10.2083C24.7917 6.18334 21.525 2.91667 17.5 2.91667C13.475 2.91667 10.2083 6.18334 10.2083 10.2083C10.2083 14.2333 13.475 17.5 17.5 17.5ZM17.5 21.1458C12.6292 21.1458 2.91667 23.5958 2.91667 28.4583V32.0833H32.0833V28.4583C32.0833 23.5958 22.3708 21.1458 17.5 21.1458Z"/>
                    </svg>
                  </div>
                  <div className="profil-input-container">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>

                <h2 className="profil-section-title">Keamanan Pengguna</h2>

                {/* Password Field dengan Ubah Password link */}
                <div className="profil-field">
                  <div className="profil-icon">
                    <img src={passwordIcon} alt="Password" style={{width: '24px', height: '24px', filter: 'brightness(0) invert(1)'}} />
                  </div>
                  <div className="profil-input-container">
                    <input
                      type="password"
                      value="Password"
                      disabled
                      style={{cursor: 'not-allowed'}}
                    />
                  </div>
                  <a href="#ubah-password" className="link-ubah-password-inline">
                    Ubah Password
                  </a>
                </div>

                {/* Simpan Button */}
                <div className="profil-action">
                  <button type="submit" className="btn-simpan">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Komponen Notifikasi */}
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

export default ProfilSaya;
