import { useState } from 'react';
import './DashboardLayanan.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import babyIcon from '../../assets/images/icons/icons8-infant-100.png';
import pregnantIcon from '../../assets/images/icons/icons8-health-insurance-100-2.png';
import familyIcon from '../../assets/images/icons/icons8-family-100.png';
import injectionIcon from '../../assets/images/icons/icons8-injection-100.png';
import healthIcon from '../../assets/images/icons/icons8-postnatal-yoga-100.png';

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
                  <img src={babyIcon} alt="Persalinan" style={{width: '80px', height: '80px'}} />
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Persalinan</h3>
                  <p className="dl-card-subtitle">Catatan partus</p>
                </div>
              </div>

              {/* Antenatal Care */}
              <div className="dl-layanan-card" onClick={onToANC} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <img src={pregnantIcon} alt="ANC" style={{width: '80px', height: '80px'}} />
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Antenatal Care (ANC)</h3>
                  <p className="dl-card-subtitle">ANC, Pemeriksaan, & Konseling</p>
                </div>
              </div>

              {/* Keluarga Berencana */}
              <div className="dl-layanan-card" onClick={onToKB} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <img src={familyIcon} alt="KB" style={{width: '80px', height: '80px'}} />
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
                  <img src={injectionIcon} alt="Imunisasi" style={{width: '80px', height: '80px'}} />
                </div>
                <div className="dl-card-content">
                  <h3 className="dl-card-title">Imunisasi</h3>
                  <p className="dl-card-subtitle">Pencatatan Vaksin</p>
                </div>
              </div>

              {/* Kunjungan Pasien */}
              <div className="dl-layanan-card" onClick={onToKunjunganPasien} style={{ cursor: 'pointer' }}>
                <div className="dl-card-icon-wrapper">
                  <img src={healthIcon} alt="Kunjungan" style={{width: '80px', height: '80px'}} />
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
