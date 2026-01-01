import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import bidanYeye from '../../assets/images/bidan-yeye.jpg';
import pinkLogo from '../../assets/images/pink-logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: 'Registrasi Pasien',
      description: 'Akses untuk mendaftarkan dan memasukkan formulir pasien dan lansia',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Rekam Medis',
      description: 'Cakup data pemeriksaan pasien secara terstruktur dan detail',
      icon: '📄'
    },
    {
      id: 3,
      title: 'Data Pasien',
      description: 'Akses dan informasi database sesuai dengan pencatatan yang tersimpan',
      icon: '👥'
    },
    {
      id: 4,
      title: 'Pemantauan Ibu & Bayi',
      description: 'Monitor perkembangan keselamatan ibu hamil dan bayi dalam kandungan',
      icon: '❤️'
    },
    {
      id: 5,
      title: 'Riwayat Pelayanan',
      description: 'Lihat semua pelayanan yang telah diberikan dengan historis yang jelas',
      icon: '📚'
    },
    {
      id: 6,
      title: 'Laporan & Statistik',
      description: 'Generasi laporan pelayanan dan statistik pasien untuk evaluasi dan perencanaan yang lebih baik',
      icon: '📊'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => navigate('/beranda')}>
            <div className="logo-icon">🏥</div>
            <div className="logo-details">
              <h1 className="logo-text">Rumah Muaffa Bidan Yeye</h1>
              <p className="logo-subtitle">SISTEM INFORMASI BIDAN DIGITAL</p>
            </div>
          </div>
          <nav className="nav-menu">
            <button
              className="nav-link active"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              onClick={() => navigate('/beranda')}
            >
              Beranda
            </button>
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              onClick={() => navigate('/tentang')}
            >
              Tentang
            </button>
            <button
              className="btn-masuk"
              onClick={() => navigate('/masuk')}
            >
              Masuk
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="beranda">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-subtitle">SISTEM INFORMASI BIDAN DIGITAL</p>
            <h2 className="hero-title">Selamat Datang di Sistem Informasi Bidan Digital</h2>
            <p className="hero-description">
              Portal manajemen digital untuk mencatat dan mengelola data registrasi serta pelayanan pasien di Rumah Muaffa Bidan Yeye.
            </p>
            <button
              className="btn-daftar"
              onClick={() => navigate('/daftar')}
            >
              Daftar
            </button>
          </div>


          <div className="hero-image">
            <div className="hero-image-wrapper">
              <img src={bidanYeye} alt="Bidan Yeye" className="bidan-photo" />
              <div className="hero-image-card">
                <div className="card-logo">
                  <img src={pinkLogo} alt="Logo" />
                </div>
                <div className="card-text">
                  <span className="card-label">Rumah Muaffa</span>
                  <span className="card-name">Bidan Yeye</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modul Sistem Section */}
      <section className="modul-section" id="modul">
        <div className="modul-container">
          <h2 className="modul-title">Modul Sistem</h2>
          <p className="modul-subtitle">
            Beberapa fitur untuk memudahkan pengelolaan data pasien dan pelayanan klinik
          </p>

          <div className="modules-grid">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-icon">{module.icon}</div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informasi Klinik Section */}
      <section className="clinic-info-section">
        <div className="clinic-container">
          <h2 className="clinic-title">Informasi Klinik</h2>

          <div className="clinic-info-grid">
            <div className="clinic-info-card">
              <h3 className="info-label">NAMA KLINIK</h3>
              <p className="info-content">Rumah Muaffa Bidan Yeye</p>
            </div>

            <div className="clinic-info-card">
              <h3 className="info-label">ALAMAT</h3>
              <p className="info-content">
                Jl. Cijawura Hilir No. 123, RT.02/RW.12,<br />
                Kel. Cujaura, Kec. Buah Batu, Kota Bandung
              </p>
            </div>

            <div className="clinic-info-card">
              <h3 className="info-label">JAM OPERASIONAL</h3>
              <p className="info-content">
                Senin - Sabtu: 07.00 - 20.00<br />
                Minggu: *Lihat halaman Tentang
              </p>
            </div>

            <div className="clinic-info-card">
              <h3 className="info-label">KONTAK</h3>
              <p className="info-content">
                WhatsApp: 0853-1533-1983<br />
                Email: fahrina1983yeye@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 Klinik Bidan Yeye | Sistem Informasi Manajemen Klinik</p>
        <p>Platform digital untuk pengelolaan data pasien dan pelayanan klinik</p>
      </footer>
    </div>
  );
};

export default LandingPage;
