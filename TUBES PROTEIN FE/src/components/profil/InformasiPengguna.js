import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './InformasiPengguna.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
import authService from '../../services/auth.service';

function InformasiPengguna({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Fetch daftar users aktif saat component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getAllUsers();
        
        if (response.success && response.data) {
          setAccounts(response.data);
          setError(null);
        } else {
          setError(response.message || 'Gagal mengambil data pengguna');
          setAccounts([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Terjadi kesalahan saat mengambil data pengguna');
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddAccount = (e) => {
    e.preventDefault();
    
    console.log('Tambah Akun Bidan:', {
      username: newUsername,
      email: newEmail,
      password: newPassword
    });

    const newAccount = {
      id: accounts.length + 1,
      username: newUsername
    };

    setAccounts([...accounts, newAccount]);
    
    // Reset form
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setShowAddForm(false);
    
    showNotifikasi({
      type: 'success',
      message: 'Akun bidan berhasil ditambahkan!',
      autoClose: true,
      autoCloseDuration: 2000,
      onConfirm: hideNotifikasi
    });
  };

  return (
    <div className="info-pengguna-page">
      {/* Header */}
      <div className="info-pengguna-header">
        <div className="info-header-left">
          <div className="info-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="info-header-logo-img" />
          </div>
          <h1 className="info-header-title">Informasi Pengguna</h1>
        </div>
        <button className="btn-kembali-info" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="info-pengguna-content">
        {/* Sidebar */}
        <Sidebar
          activePage="informasi-pengguna"
          onRiwayatDataMasuk={onToRiwayatDataMasuk}
          onRiwayatMasukAkun={onToRiwayatMasukAkun}
          onProfilSaya={onToProfil}
          onTambahPasien={onToTambahPasien}
          onTambahPengunjung={onToTambahPengunjung}
          onBuatLaporan={onToBuatLaporan}
          onToPersalinan={onToPersalinan}
          onToANC={onToANC}
          onToKB={onToKB}
          onToImunisasi={onToImunisasi}
        />

        {/* Main Area */}
        <main className="info-main-area">
          {/* Loading State */}
          {isLoading && (
            <div className="info-loading">
              <p>Memuat data pengguna...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="info-error">
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Account List Card */}
          {!isLoading && !error && (
            <div className="account-list-card">
              {accounts.length > 0 ? (
                <div className="account-list-inner">
                  {accounts.map((account) => (
                    <div key={account.id_user} className="account-item">
                      <div className="account-icon">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
                          <path d="M15 15C18.45 15 21.25 12.2 21.25 8.75C21.25 5.3 18.45 2.5 15 2.5C11.55 2.5 8.75 5.3 8.75 8.75C8.75 12.2 11.55 15 15 15ZM15 18.125C10.825 18.125 2.5 20.225 2.5 24.375V27.5H27.5V24.375C27.5 20.225 19.175 18.125 15 18.125Z"/>
                        </svg>
                      </div>
                      <div className="account-info">
                        <div className="account-username">{account.username}</div>
                        <div className="account-details">
                          <span className="account-nama">{account.nama_lengkap}</span>
                          <span className="account-email">{account.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="account-empty">
                  <p>Tidak ada pengguna aktif</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Account Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Tambah Akun Bidan</h2>
            <form onSubmit={handleAddAccount}>
              <div className="modal-form-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="modal-form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="modal-form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-modal-batal" onClick={() => setShowAddForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-modal-simpan">
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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

export default InformasiPengguna;
