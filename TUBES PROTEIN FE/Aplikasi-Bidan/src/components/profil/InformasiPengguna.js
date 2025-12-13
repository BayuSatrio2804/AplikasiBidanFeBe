import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import './InformasiPengguna.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function InformasiPengguna({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
  const [accounts, setAccounts] = useState([
    { id: 1, username: 'Username Akun' },
    { id: 2, username: 'Username Akun' },
    { id: 3, username: 'Username Akun' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAddAccount = (e) => {
    e.preventDefault();
    
    // TODO: Replace with actual API call POST /auth/register
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
          {/* Tambah Akun Button Card */}
          <div className="tambah-akun-card" onClick={() => setShowAddForm(true)}>
            <div className="tambah-akun-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect x="10" y="10" width="40" height="40" rx="8" fill="white" fillOpacity="0.5"/>
                <path d="M30 20V40M20 30H40" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="tambah-akun-label">Tambah Akun</p>
          </div>

          {/* Account List Card */}
          <div className="account-list-card">
            <div className="account-list-inner">
              {accounts.map((account) => (
                <div key={account.id} className="account-item">
                  <div className="account-icon">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
                      <path d="M15 15C18.45 15 21.25 12.2 21.25 8.75C21.25 5.3 18.45 2.5 15 2.5C11.55 2.5 8.75 5.3 8.75 8.75C8.75 12.2 11.55 15 15 15ZM15 18.125C10.825 18.125 2.5 20.225 2.5 24.375V27.5H27.5V24.375C27.5 20.225 19.175 18.125 15 18.125Z"/>
                    </svg>
                  </div>
                  <span className="account-username">{account.username}</span>
                </div>
              ))}
            </div>
          </div>
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
