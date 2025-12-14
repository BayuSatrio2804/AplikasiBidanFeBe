import React, { useState } from 'react';
import './Sidebar.css';
import pinkLogo from '../../assets/images/pink-logo.png';

function Sidebar({ 
  activePage, 
  onTambahPasien,
  onTambahPengunjung,
  onBuatLaporan,
  onRiwayatDataMasuk,
  onRiwayatMasukAkun,
  onProfilSaya,
  onToPersalinan,
  onToANC,
  onToKB,
  onToImunisasi
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };
  
  return (
    <aside className={`sidebar ${isLocked ? 'sidebar-locked' : ''}`}>
      <button className="sidebar-lock-btn" onClick={toggleLock} title={isLocked ? 'Unlock Sidebar' : 'Lock Sidebar'}>
        {isLocked ? '🔒' : '🔓'}
      </button>
      <div className="sidebar-profile">
        <div className="sidebar-profile-icon">
          <img src={pinkLogo} alt="Pink Logo" className="sidebar-logo-img" />
        </div>
        <button className="sidebar-btn-profile" onClick={onProfilSaya}>
          Profil Saya
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-menu-section">
          <h3 className="sidebar-menu-title">Menu</h3>
          
          <div className="sidebar-dropdown">
            <button 
              className={`sidebar-menu-item ${isDropdownOpen ? 'sidebar-dropdown-active' : ''}`}
              onClick={toggleDropdown}
            >
              <span className="sidebar-menu-icon">⊕</span>
              Tambah Pasien
              <span className="sidebar-dropdown-arrow">{isDropdownOpen ? '▼' : '›'}</span>
            </button>
            
            {isDropdownOpen && (
              <div className="sidebar-dropdown-content">
                <button 
                  className={`sidebar-dropdown-item ${activePage === 'persalinan' ? 'sidebar-menu-item-active' : ''}`}
                  onClick={onToPersalinan}
                >
                  <span className="sidebar-menu-arrow">›</span>
                  Persalinan
                </button>
                <button 
                  className={`sidebar-dropdown-item ${activePage === 'anc' ? 'sidebar-menu-item-active' : ''}`}
                  onClick={onToANC}
                >
                  <span className="sidebar-menu-arrow">›</span>
                  Antenatal Care (ANC)
                </button>
                <button 
                  className={`sidebar-dropdown-item ${activePage === 'kb' ? 'sidebar-menu-item-active' : ''}`}
                  onClick={onToKB}
                >
                  <span className="sidebar-menu-arrow">›</span>
                  Keluarga Berencana
                </button>
                <button 
                  className={`sidebar-dropdown-item ${activePage === 'imunisasi' ? 'sidebar-menu-item-active' : ''}`}
                  onClick={onToImunisasi}
                >
                  <span className="sidebar-menu-arrow">›</span>
                  Imunisasi
                </button>
              </div>
            )}
          </div>
          
          <button 
            className={`sidebar-menu-item ${activePage === 'tambah-pengunjung' ? 'sidebar-menu-item-active' : ''}`}
            onClick={onTambahPengunjung}
          >
            <span className="sidebar-menu-icon">⊕</span>
            Tambah Pengunjung
          </button>
          <button 
            className={`sidebar-menu-item ${activePage === 'buat-laporan' ? 'sidebar-menu-item-active' : ''}`}
            onClick={onBuatLaporan}
          >
            <span className="sidebar-menu-icon">⊕</span>
            Buat Laporan
          </button>
        </div>

        <div className="sidebar-menu-section">
          <h3 className="sidebar-menu-title">Riwayat</h3>
          <button 
            className={`sidebar-menu-item ${activePage === 'riwayat-ubah-data' ? 'sidebar-menu-item-active' : ''}`}
            onClick={onRiwayatDataMasuk}
          >
            <span className="sidebar-menu-icon-clock">🕐</span>
            Riwayat Ubah Data
          </button>
          <button 
            className={`sidebar-menu-item ${activePage === 'riwayat-masuk-akun' ? 'sidebar-menu-item-active' : ''}`}
            onClick={onRiwayatMasukAkun}
          >
            <span className="sidebar-menu-icon-clock">🕐</span>
            Riwayat Masuk Akun
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
