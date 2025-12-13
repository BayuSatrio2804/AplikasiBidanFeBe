import './App.css';
import { useState } from 'react';
import BuatAkun from './components/auth/BuatAkun';
import Masuk from './components/auth/Masuk';
import LupaPassword from './components/auth/LupaPassword';
import VerifikasiOTP from './components/auth/VerifikasiOTP';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import ProfilSaya from './components/profil/ProfilSaya';
import InformasiPengguna from './components/profil/InformasiPengguna';
import DataPasien from './components/pasien/DataPasien';
import RiwayatUbahData from './components/pasien/RiwayatUbahData';
import RiwayatMasukAkun from './components/profil/RiwayatMasukAkun';
import Jadwal from './components/jadwal/Jadwal';
import Laporan from './components/laporan/Laporan';
import DashboardLayanan from './components/layanan/DashboardLayanan';
import LayananKB from './components/layanan/LayananKB';
import LayananPersalinan from './components/layanan/LayananPersalinan';
import LayananANC from './components/layanan/LayananANC';
import LayananImunisasi from './components/layanan/LayananImunisasi';
import LayananKunjunganPasien from './components/layanan/LayananKunjunganPasien';
import Notifikasi from './components/notifikasi/NotifikasiComponent';
import { useNotifikasi } from './components/notifikasi/useNotifikasi';

function App() {
  const [currentPage, setCurrentPage] = useState('masuk');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleRegistrationSuccess = (email) => {
    setRegisterEmail(email);
    localStorage.setItem('registerEmail', email);
    setCurrentPage('verifikasi-otp');
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    // Simulasi user data
    setUserData({
      username: name,
      email: 'bidan@example.com',
      nama_lengkap: name
    });
    setCurrentPage('dashboard');
    
    // Tampilkan notifikasi berhasil login
    showNotifikasi({
      type: 'success-login',
      autoClose: true,
      autoCloseDuration: 2000,
      onConfirm: hideNotifikasi
    });
  };

  const handleLogout = () => {
    showNotifikasi({
      type: 'confirm-logout',
      onConfirm: () => {
        setIsLoggedIn(false);
        setUserData(null);
        setCurrentPage('masuk');
        hideNotifikasi();
      },
      onCancel: hideNotifikasi,
      cancelText: 'Batal',
      confirmText: 'Ya'
    });
  };

  const handleToProfil = () => {
    setCurrentPage('profil');
  };

  const handleToInformasiPengguna = () => {
    setCurrentPage('informasi-pengguna');
  };

  const handleToDataPasien = () => {
    setCurrentPage('data-pasien');
  };

  const handleToRiwayatDataMasuk = () => {
    setCurrentPage('riwayat-data-masuk');
  };

  const handleToRiwayatUbahData = () => {
    setCurrentPage('riwayat-ubah-data');
  };

  const handleToRiwayatMasukAkun = () => {
    setCurrentPage('riwayat-masuk-akun');
  };

  const handleToJadwal = () => {
    setCurrentPage('jadwal');
  };

  const handleToLaporan = () => {
    setCurrentPage('laporan');
  };

  const handleToLayanan = () => {
    setCurrentPage('layanan');
  };

  const handleToKB = () => {
    setCurrentPage('kb');
  };

  const handleToPersalinan = () => {
    setCurrentPage('persalinan');
  };

  const handleToANC = () => {
    setCurrentPage('anc');
  };

  const handleToImunisasi = () => {
    setCurrentPage('imunisasi');
  };

  const handleToKunjunganPasien = () => {
    setCurrentPage('kunjungan-pasien');
  };

  const handleToVerifikasiOTP = (email) => {
    setResetEmail(email);
    setCurrentPage('verifikasi-otp');
  };

  const handleOTPVerified = () => {
    // Cek apakah ini dari lupa password atau login/register
    const resetEmail = localStorage.getItem('resetEmail');
    
    if (resetEmail) {
      // Dari lupa password, navigasi ke reset password
      showNotifikasi({
        type: 'success',
        message: 'OTP berhasil diverifikasi!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: () => {
          hideNotifikasi();
          setCurrentPage('reset-password');
        }
      });
    } else {
      // Dari login atau register, set sebagai logged in
      showNotifikasi({
        type: 'success-login',
        message: 'Login berhasil!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: () => {
          hideNotifikasi();
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
        }
      });
    }
  };

  const handleResetPasswordComplete = () => {
    showNotifikasi({
      type: 'success',
      message: 'Password berhasil direset! Silakan login dengan password baru Anda.',
      autoClose: true,
      autoCloseDuration: 2000,
      onConfirm: () => {
        hideNotifikasi();
        setCurrentPage('masuk');
      }
    });
  };

  const handleToTambahPasien = () => {
    setCurrentPage('data-pasien');
  };

  const handleToTambahPengunjung = () => {
    setCurrentPage('kunjungan-pasien');
  };

  const handleToBuatLaporan = () => {
    setCurrentPage('laporan');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      {!isLoggedIn && currentPage === 'buat-akun' && <BuatAkun onNavigate={handleNavigate} onRegistrationSuccess={handleRegistrationSuccess} />}
      {!isLoggedIn && currentPage === 'masuk' && <Masuk onNavigate={handleNavigate} onLogin={handleLogin} />}
      {!isLoggedIn && currentPage === 'lupa-password' && <LupaPassword onBack={() => handleNavigate('masuk')} onLogin={() => handleNavigate('masuk')} onToVerifikasiOTP={handleToVerifikasiOTP} />}
      {!isLoggedIn && currentPage === 'verifikasi-otp' && <VerifikasiOTP onBack={() => { const resetEmail = localStorage.getItem('resetEmail'); resetEmail ? handleNavigate('lupa-password') : handleNavigate('masuk'); }} onVerified={handleOTPVerified} registerEmail={registerEmail} resetEmail={resetEmail} />}
      {!isLoggedIn && currentPage === 'reset-password' && <ResetPassword onBack={() => handleNavigate('lupa-password')} onReset={handleResetPasswordComplete} />}
      {isLoggedIn && currentPage === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout} 
          userData={userData}
          onToProfil={handleToProfil}
          onToInformasiPengguna={handleToInformasiPengguna}
          onToDataPasien={handleToDataPasien}
          onToJadwal={handleToJadwal}
          onToLaporan={handleToLaporan}
          onToLayanan={handleToLayanan}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'profil' && (
        <ProfilSaya 
          onBack={handleBackToDashboard}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'informasi-pengguna' && (
        <InformasiPengguna 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'data-pasien' && (
        <DataPasien 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'riwayat-data-masuk' && (
        <RiwayatUbahData 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'riwayat-ubah-data' && (
        <RiwayatUbahData 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'riwayat-masuk-akun' && (
        <RiwayatMasukAkun 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'jadwal' && (
        <Jadwal 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'laporan' && (
        <Laporan 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'layanan' && (
        <DashboardLayanan 
          onBack={handleBackToDashboard}
          onToKB={handleToKB}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToImunisasi={handleToImunisasi}
          onToKunjunganPasien={handleToKunjunganPasien}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
        />
      )}
      {isLoggedIn && currentPage === 'kb' && (
        <LayananKB 
          onBack={handleToLayanan}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'persalinan' && (
        <LayananPersalinan 
          onBack={handleToLayanan}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'anc' && (
        <LayananANC 
          onBack={handleToLayanan}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'imunisasi' && (
        <LayananImunisasi 
          onBack={handleToLayanan}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'kunjungan-pasien' && (
        <LayananKunjunganPasien 
          onBack={handleToLayanan}
          userData={userData}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      
      {/* Komponen Notifikasi Global */}
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

export default App;
