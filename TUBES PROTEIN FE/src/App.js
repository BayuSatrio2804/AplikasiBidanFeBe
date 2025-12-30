import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import AboutPage from './components/landing/AboutPage';
import BuatAkun from './components/auth/BuatAkun';
import Masuk from './components/auth/Masuk';
import LupaPassword from './components/auth/LupaPassword';
import VerifikasiOTP from './components/auth/VerifikasiOTP';
import Dashboard from './components/dashboard/Dashboard';
import ProfilSaya from './components/profil/ProfilSaya';
import InformasiPengguna from './components/profil/InformasiPengguna';
import UbahPassword from './components/profil/UbahPassword';
import DataPasien from './components/pasien/DataPasien';
import EditPasien from './components/pasien/EditPasien';
import RiwayatUbahDataPasien from './components/pasien/RiwayatUbahData';
import RiwayatMasukAkun from './components/profil/RiwayatMasukAkun';
import RiwayatUbahData from './components/profil/RiwayatUbahData';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    }
    setIsLoading(false);
  }, []);

  const handleNavigate = (page, data = null) => {
    navigate(`/${page}`);
    if (page === 'verifikasi-otp' && data) {
      setOtpData(data);
    }
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    navigate('/dashboard');

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
        window.location.href = '/';
        hideNotifikasi();
      },
      onCancel: hideNotifikasi,
      cancelText: 'Batal',
      confirmText: 'Ya'
    });
  };

  const handleToProfil = () => navigate('/profil');
  const handleToInformasiPengguna = () => navigate('/informasi-pengguna');
  const handleToUbahPassword = () => navigate('/ubah-password');
  const handleToDataPasien = () => navigate('/data-pasien');
  const handleToRiwayatDataMasuk = () => navigate('/riwayat-data-masuk');
  const handleToRiwayatUbahData = () => navigate('/riwayat-ubah-data');
  const handleToRiwayatMasukAkun = () => navigate('/riwayat-masuk-akun');
  const handleToJadwal = () => navigate('/jadwal');
  const handleToBuatJadwal = () => navigate('/buat-jadwal');
  const handleToLaporan = () => navigate('/laporan');
  const handleToLayanan = () => navigate('/layanan');
  const handleToKB = () => navigate('/kb');
  const handleToPersalinan = () => navigate('/persalinan');
  const handleToANC = () => navigate('/anc');
  const handleToImunisasi = () => navigate('/imunisasi');
  const handleToKunjunganPasien = () => navigate('/kunjungan-pasien');
  const handleBackToDashboard = () => navigate('/dashboard');
  const handleBackFromBuatJadwal = () => navigate(-1);

  const handleToVerifikasiOTP = (email) => {
    setResetEmail(email);
    navigate('/verifikasi-otp');
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
          navigate('/masuk');
        }
      });
    }
  };

  const handleToTambahPasien = () => {
    navigate('/data-pasien#tambahPasien');
  };

  const handleToEditPasien = (pasienId) => {
    setSelectedPasienId(pasienId);
    navigate('/edit-pasien');
  };

  const handleToTambahPengunjung = () => {
    navigate('/kunjungan-pasien#tambahPengunjung');
  };

  const handleToBuatLaporan = () => {
    navigate('/laporan');
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/masuk" replace />;
    }
    return children;
  };

  // Public Route wrapper (redirect to dashboard if logged in)
  const PublicRoute = ({ children }) => {
    if (isLoggedIn) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/beranda" replace />
          } />
          <Route path="/beranda" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />
          } />
          <Route path="/tentang" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <AboutPage />
          } />
          <Route path="/buat-akun" element={
            <PublicRoute>
              <BuatAkun onNavigate={handleNavigate} />
            </PublicRoute>
          } />
          <Route path="/daftar" element={<Navigate to="/buat-akun" replace />} />
          <Route path="/masuk" element={
            <PublicRoute>
              <Masuk onNavigate={handleNavigate} onLogin={handleLogin} />
            </PublicRoute>
          } />
          <Route path="/lupa-password" element={
            <PublicRoute>
              <LupaPassword
                onBack={() => navigate('/masuk')}
                onLogin={() => navigate('/masuk')}
                onToVerifikasiOTP={handleToVerifikasiOTP}
              />
            </PublicRoute>
          } />
          <Route path="/verifikasi-otp" element={
            <PublicRoute>
              <VerifikasiOTP
                onBack={() => navigate(otpData.usernameOrEmail ? '/masuk' : '/lupa-password')}
                onVerified={handleOTPVerified}
                email={otpData.email || resetEmail}
                usernameOrEmail={otpData.usernameOrEmail}
              />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/profil" element={
            <ProtectedRoute>
              <ProfilSaya
                onBack={handleBackToDashboard}
                userData={userData}
                onToUbahPassword={handleToUbahPassword}
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
            </ProtectedRoute>
          } />

          <Route path="/ubah-password" element={
            <ProtectedRoute>
              <UbahPassword
                onBack={handleToProfil}
              />
            </ProtectedRoute>
          } />

          <Route path="/informasi-pengguna" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/data-pasien" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/edit-pasien" element={
            <ProtectedRoute>
              <EditPasien
                onBack={handleToDataPasien}
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
            </ProtectedRoute>
          } />

          <Route path="/riwayat-data-masuk" element={
            <ProtectedRoute>
              <RiwayatUbahDataPasien
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
            </ProtectedRoute>
          } />

          <Route path="/riwayat-ubah-data" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/riwayat-masuk-akun" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/jadwal" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/buat-jadwal" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/laporan" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/layanan" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/kb" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/persalinan" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/anc" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/imunisasi" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          <Route path="/kunjungan-pasien" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />
        </Routes>
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
