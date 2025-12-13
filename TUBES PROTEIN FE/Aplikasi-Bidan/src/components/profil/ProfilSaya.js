import { useState, useEffect } from 'react';
import './ProfilSaya.css';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function ProfilSaya({ onBack, userData }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Simulasi data dari props atau API
        if (userData) {
          setEmail(userData.email || 'Email@domain.com');
          setUsername(userData.username || 'Username');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Update Profil:', {
        email,
        username,
        password: password ? '***' : 'tidak diubah'
      });
      
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
        message: 'Gagal memperbarui profil',
        onConfirm: hideNotifikasi,
        onCancel: hideNotifikasi
      });
    }
  };

  return (
    <div className="profil-page">
      {/* Header */}
      <header className="profil-header">
        <div className="profil-header-left">
          <div className="profil-header-icon">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="25" fill="#E89AC7"/>
              <path d="M25 15C25 18.866 21.866 22 18 22C14.134 22 11 18.866 11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15Z" fill="white"/>
              <path d="M25 25C28.866 25 32 28.134 32 32C32 35.866 28.866 39 25 39C21.134 39 18 35.866 18 32C18 28.134 21.134 25 25 25Z" fill="white"/>
            </svg>
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
                  <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <circle cx="90" cy="90" r="85" fill="#E89AC7" opacity="0.3"/>
                    <circle cx="90" cy="90" r="70" fill="#E89AC7" opacity="0.5"/>
                    <circle cx="90" cy="90" r="60" fill="white"/>
                    {/* Heart with hands */}
                    <path 
                      d="M90 80C90 80 75 67 75 58C75 52 79 48 83 48C86 48 89 50 90 52C91 50 94 48 97 48C101 48 105 52 105 58C105 67 90 80 90 80Z" 
                      fill="#C94C8B"
                    />
                    {/* Hands */}
                    <path 
                      d="M78 80C78 80 70 84 66 88C62 92 62 96 66 100C70 104 74 104 78 100L84 94" 
                      stroke="#C94C8B" 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path 
                      d="M102 80C102 80 110 84 114 88C118 92 118 96 114 100C110 104 106 104 102 100L96 94" 
                      stroke="#C94C8B" 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <button type="button" className="btn-ubah-profil">
                  Ubah Profil
                </button>
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
                    <span className="edit-icon">✏️</span>
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
                    <span className="edit-icon">✏️</span>
                  </div>
                </div>

                <h2 className="profil-section-title">Keamanan Pengguna</h2>

                {/* Password Field */}
                <div className="profil-field">
                  <div className="profil-icon">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="white">
                      <path d="M27.7083 11.6667H26.25V8.75001C26.25 4.72501 22.9833 1.45834 18.9583 1.45834C14.9333 1.45834 11.6667 4.72501 11.6667 8.75001V11.6667H10.2083C8.60417 11.6667 7.29167 12.9792 7.29167 14.5833V30.625C7.29167 32.2292 8.60417 33.5417 10.2083 33.5417H27.7083C29.3125 33.5417 30.625 32.2292 30.625 30.625V14.5833C30.625 12.9792 29.3125 11.6667 27.7083 11.6667ZM18.9583 26.25C17.3542 26.25 16.0417 24.9375 16.0417 23.3333C16.0417 21.7292 17.3542 20.4167 18.9583 20.4167C20.5625 20.4167 21.875 21.7292 21.875 23.3333C21.875 24.9375 20.5625 26.25 18.9583 26.25ZM23.625 11.6667H14.2917V8.75001C14.2917 6.17084 16.3792 4.08334 18.9583 4.08334C21.5375 4.08334 23.625 6.17084 23.625 8.75001V11.6667Z"/>
                    </svg>
                  </div>
                  <div className="profil-input-container">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <span className="edit-icon">✏️</span>
                  </div>
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
