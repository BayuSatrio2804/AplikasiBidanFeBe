import { useState } from 'react';
import './DashboardLayanan.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';

function DashboardLayanan({ onBack, onToKB, onRiwayatDataMasuk, onRiwayatMasukAkun, onToProfil, onToPersalinan, onToANC, onToImunisasi, onToKunjunganPasien, userData, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan }) {
  return (
    <div className="dashboard-layanan-page">
      {/* Header */}
      <div className="dl-header">
        <div className="dl-header-left">
          <div className="dl-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="dl-header-logo-img" />
          </div>
          <h1 className="dl-header-title">Layanan</h1>
        </div>
        <button className="btn-kembali-dl" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="dl-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="anc"
          onRiwayatDataMasuk={onRiwayatDataMasuk}
          onRiwayatMasukAkun={onRiwayatMasukAkun}
          onProfilSaya={onToProfil}
          onTambahPasien={onToTambahPasien}
          onTambahPengunjung={onToTambahPengunjung}
          onBuatLaporan={onToBuatLaporan}
          onToPersalinan={onToPersalinan}
          onToANC={onToANC}
          onToKB={onToKB}
          onToImunisasi={onToImunisasi}
        />
        {/* Main Area - Layanan Cards */}
        <main className="dl-main-area">
          <div className="dl-layanan-container">
            {/* Row 1 */}
            <div className="dl-layanan-row">
              {/* Persalinan */}
              <div className="dl-layanan-card" onClick={onToPersalinan} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="white" opacity="0.3"/>
                    <path d="M35 40C35 35 38 32 42 32C46 32 49 35 49 40V45H35V40Z" fill="white"/>
                    <rect x="30" y="45" width="40" height="35" rx="5" fill="white"/>
                    <circle cx="45" cy="55" r="3" fill="#E89AC7"/>
                    <circle cx="55" cy="55" r="3" fill="#E89AC7"/>
                    <path d="M40 65C40 65 45 68 50 68C55 68 60 65 60 65" stroke="#E89AC7" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Persalinan</h3>
                  <p className="dl-card-subtitle">Catatan partus</p>
                </div>
              </div>

              {/* Antenatal Care */}
              <div className="dl-layanan-card" onClick={onToANC} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="white" opacity="0.3"/>
                    <circle cx="50" cy="35" r="12" fill="white"/>
                    <ellipse cx="50" cy="65" rx="20" ry="25" fill="white"/>
                    <path d="M50 55L50 70M50 70L45 65M50 70L55 65" stroke="#E89AC7" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Antenatal Care (ANC)</h3>
                  <p className="dl-card-subtitle">ANC, Pemeriksaan, & Konseling</p>
                </div>
              </div>

              {/* Keluarga Berencana */}
              <div className="dl-layanan-card" onClick={onToKB} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="white" opacity="0.3"/>
                    <circle cx="38" cy="40" r="8" fill="white"/>
                    <path d="M38 48C30 48 25 53 25 60V70H51V60C51 53 46 48 38 48Z" fill="white"/>
                    <circle cx="62" cy="45" r="6" fill="white"/>
                    <path d="M62 51C56 51 52 55 52 60V70H72V60C72 55 68 51 62 51Z" fill="white"/>
                    <circle cx="55" cy="55" r="4" fill="white"/>
                  </svg>
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Keluarga Berencana (KB)</h3>
                  <p className="dl-card-subtitle">Pelayanan Kontrasepsi</p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="dl-layanan-row">
              {/* Imunisasi */}
              <div className="dl-layanan-card" onClick={onToImunisasi} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="white" opacity="0.3"/>
                    <rect x="42" y="25" width="16" height="50" rx="2" fill="white"/>
                    <path d="M45 35L55 35L50 28Z" fill="white"/>
                    <circle cx="35" cy="50" r="8" fill="white"/>
                    <circle cx="38" cy="48" r="3" fill="#E89AC7"/>
                    <circle cx="60" cy="55" r="6" fill="white"/>
                    <circle cx="62" cy="54" r="2" fill="#E89AC7"/>
                  </svg>
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Imunisasi</h3>
                  <p className="dl-card-subtitle">Pencatatan Vaksin</p>
                </div>
              </div>

              {/* Kunjungan Pasien */}
              <div className="dl-layanan-card" onClick={onToKunjunganPasien} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="white" opacity="0.3"/>
                    <circle cx="45" cy="35" r="10" fill="white"/>
                    <path d="M45 45C35 45 28 52 28 62V72H62V62C62 52 55 45 45 45Z" fill="white"/>
                    <path d="M60 50L75 45V70L60 65V50Z" fill="white"/>
                    <circle cx="67" cy="57" r="3" fill="#E89AC7"/>
                  </svg>
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Kunjungan Pasien</h3>
                  <p className="dl-card-subtitle">Konsultasi Langsung di Tempat</p>
                </div>
              </div>

              {/* Empty space for grid alignment */}
              <div className="dl-layanan-card-empty"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayanan;
