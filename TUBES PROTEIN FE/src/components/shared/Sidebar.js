import React, { useState } from 'react';
import './Sidebar.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import addIcon from '../../assets/images/icons/icons8-add-100.png';
import postIcon from '../../assets/images/icons/icons8-post-100.png';
import timeIcon from '../../assets/images/icons/icons8-time-machine-100.png';

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <aside className="sidebar">
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
              <span className="sidebar-menu-icon">
                <img src={addIcon} alt="Add" style={{width: '18px', height: '18px', filter: 'brightness(0) invert(1)'}} />
              </span>
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
            <span className="sidebar-menu-icon">
              <img src={addIcon} alt="Add" style={{width: '18px', height: '18px', filter: 'brightness(0) invert(1)'}} />
            </span>
            Tambah Pengunjung
          </button>
          <button 
            className={`sidebar-menu-item ${activePage === 'buat-laporan' ? 'sidebar-menu-item-active' : ''}`}
            onClick={onBuatLaporan}
          >
            <span className="sidebar-menu-icon">
              <img src={postIcon} alt="Report" style={{width: '18px', height: '18px', filter: 'brightness(0) invert(1)'}} />
            </span>
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
