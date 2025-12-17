import './App.css';
import { useState, useEffect } from 'react';
import BuatAkun from './components/auth/BuatAkun';
import Masuk from './components/auth/Masuk';
import LupaPassword from './components/auth/LupaPassword';
import VerifikasiOTP from './components/auth/VerifikasiOTP';
import Dashboard from './components/dashboard/Dashboard';
import ProfilSaya from './components/profil/ProfilSaya';
import InformasiPengguna from './components/profil/InformasiPengguna';
import DataPasien from './components/pasien/DataPasien';
import EditPasien from './components/pasien/EditPasien';
import RiwayatUbahData from './components/pasien/RiwayatUbahData';
import RiwayatMasukAkun from './components/profil/RiwayatMasukAkun';
import Jadwal from './components/jadwal/Jadwal';
import BuatJadwal from './components/jadwal/BuatJadwal';
import Laporan from './components/laporan/Laporan';
import DashboardLayanan from './components/layanan/DashboardLayanan';
import LayananKB from './components/layanan/LayananKB';
import LayananPersalinan from './components/layanan/LayananPersalinan';
import LayananANC from './components/layanan/LayananANC';
import LayananImunisasi from './components/layanan/LayananImunisasi';
import LayananKunjunganPasien from './components/layanan/LayananKunjunganPasien';
import Notifikasi from './components/notifikasi/NotifikasiComponent';
import { useNotifikasi } from './components/notifikasi/useNotifikasi';
import { getToken, getStoredUser, clearAuth } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('masuk');
  const [previousPage, setPreviousPage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [otpData, setOtpData] = useState({ email: '', usernameOrEmail: '' });
  const [selectedPasienId, setSelectedPasienId] = useState(null);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  // Check for existing auth on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(storedUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'verifikasi-otp' && data) {
      setOtpData(data);
    }
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    setCurrentPage('dashboard');
    
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
        clearAuth(); // Clear token and user from localStorage
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

  const handleToBuatJadwal = () => {
    setPreviousPage(currentPage);
    setCurrentPage('buat-jadwal');
  };

  const handleBackFromBuatJadwal = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    } else {
      setCurrentPage('dashboard');
    }
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

  const handleOTPVerified = (userData = null) => {
    if (userData) {
      // OTP verification from login - redirect to dashboard
      handleLogin(userData);
    } else {
      // OTP verification from forgot password - redirect to login
      showNotifikasi({
        type: 'success',
        message: 'OTP berhasil diverifikasi!',
        autoClose: true,
        autoCloseDuration: 2000,
        onConfirm: () => {
          hideNotifikasi();
          setCurrentPage('masuk');
        }
      });
    }
  };

  const handleToTambahPasien = () => {
    setCurrentPage('data-pasien#tambahPasien');
  };

  const handleToEditPasien = (pasienId) => {
    setSelectedPasienId(pasienId);
    setCurrentPage('edit-pasien');
  };

  const handleToTambahPengunjung = () => {
    setCurrentPage('kunjungan-pasien#tambahPengunjung');
  };

  const handleToBuatLaporan = () => {
    setCurrentPage('laporan');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      {!isLoggedIn && currentPage === 'buat-akun' && <BuatAkun onNavigate={handleNavigate} />}
      {!isLoggedIn && currentPage === 'masuk' && <Masuk onNavigate={handleNavigate} onLogin={handleLogin} />}
      {!isLoggedIn && currentPage === 'lupa-password' && <LupaPassword onBack={() => handleNavigate('masuk')} onLogin={() => handleNavigate('masuk')} onToVerifikasiOTP={handleToVerifikasiOTP} />}
      {!isLoggedIn && currentPage === 'verifikasi-otp' && (
        <VerifikasiOTP 
          onBack={() => handleNavigate(otpData.usernameOrEmail ? 'masuk' : 'lupa-password')} 
          onVerified={handleOTPVerified} 
          email={otpData.email || resetEmail}
          usernameOrEmail={otpData.usernameOrEmail}
        />
      )}
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
      {isLoggedIn && (currentPage === 'data-pasien' || currentPage === 'data-pasien#tambahPasien') && (
        <DataPasien 
          onBack={handleBackToDashboard}
          onToRiwayatDataMasuk={handleToRiwayatDataMasuk}
          onToRiwayatMasukAkun={handleToRiwayatMasukAkun}
          onToProfil={handleToProfil}
          onToTambahPasien={handleToTambahPasien}
          onToEditPasien={handleToEditPasien}
          onToTambahPengunjung={handleToTambahPengunjung}
          onToBuatLaporan={handleToBuatLaporan}
          onToPersalinan={handleToPersalinan}
          onToANC={handleToANC}
          onToKB={handleToKB}
          onToImunisasi={handleToImunisasi}
        />
      )}
      {isLoggedIn && currentPage === 'edit-pasien' && (
        <EditPasien 
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
          pasienId={selectedPasienId}
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
      {isLoggedIn && currentPage === 'buat-jadwal' && (
        <BuatJadwal 
          onBack={handleBackFromBuatJadwal}
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
          onToKunjunganPasien={handleToKunjunganPasien}
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
          onToJadwal={handleToBuatJadwal}
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
          onToJadwal={handleToBuatJadwal}
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
          onToJadwal={handleToBuatJadwal}
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
          onToJadwal={handleToBuatJadwal}
        />
      )}
      {isLoggedIn && (currentPage === 'kunjungan-pasien' || currentPage === 'kunjungan-pasien#tambahPengunjung') && (
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
          onToJadwal={handleToBuatJadwal}
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
