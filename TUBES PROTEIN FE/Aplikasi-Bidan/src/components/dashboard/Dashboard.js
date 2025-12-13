import { useState, useEffect } from 'react';
import './Dashboard.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import Sidebar from '../shared/Sidebar';

function Dashboard({ 
  onLogout, 
  userData, 
  onToProfil, 
  onToInformasiPengguna, 
  onToDataPasien, 
  onToJadwal, 
  onToLaporan, 
  onToLayanan, 
  onToRiwayatMasukAkun, 
  onToRiwayatDataMasuk, 
  onToTambahPasien, 
  onToTambahPengunjung, 
  onToBuatLaporan, 
  onToPersalinan, 
  onToANC, 
  onToKB, 
  onToImunisasi 
}) {
  const [rekapData, setRekapData] = useState({
    total: 0,
    data: []
  });

  // Fetch data dari API /dashboard/rekap-layanan
  useEffect(() => {
    const fetchRekapLayanan = async () => {
      try {
        // TODO: Replace with actual API call GET /dashboard/rekap-layanan
        // const response = await fetch('https://api.bidan-digital.com/v1/dashboard/rekap-layanan', {
        //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        // });
        // const result = await response.json();
        // setRekapData({
        //   total: result.total,
        //   data: result.data
        // });
        
        // Mock data sesuai struktur API baru
        const mockData = {
          message: "Data rekap pasien per kategori layanan berhasil diambil",
          total: 128,
          data: [
            { layanan: "ANC", jumlah_pasien: 45, persentase: 35.15 },
            { layanan: "Persalinan", jumlah_pasien: 23, persentase: 17.97 },
            { layanan: "KB", jumlah_pasien: 26, persentase: 20.31 },
            { layanan: "Imunisasi", jumlah_pasien: 20, persentase: 15.62 },
            { layanan: "Kunjungan Pasien", jumlah_pasien: 14, persentase: 10.94 }
          ]
        };
        setRekapData(mockData);
      } catch (error) {
        console.error('Error fetching rekap layanan:', error);
      }
    };
    
    fetchRekapLayanan();
  }, []);

  const pieColors = ['#E91E8C', '#F06FA8', '#F59BC4', '#FAC7E0', '#FDE3F0'];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="header-logo-img" />
          </div>
          <h1 className="header-title">Sistem Informasi Bidan Digital</h1>
        </div>
        <button className="btn-keluar" onClick={onLogout}>Keluar</button>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <Sidebar 
          activePage="dashboard"
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

        {/* Main Content */}
        <main className="main-content">
          {/* Icon Menu Cards */}
          <div className="menu-cards">
            <div className="menu-card" onClick={onToInformasiPengguna}>
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                  <path d="M20 8C16.13 8 13 11.13 13 15C13 18.87 16.13 22 20 22C23.87 22 27 18.87 27 15C27 11.13 23.87 8 20 8ZM20 26C14.67 26 4 28.67 4 34V36H36V34C36 28.67 25.33 26 20 26Z"/>
                </svg>
              </div>
              <p className="card-label">Informasi Pengguna</p>
            </div>

            <div className="menu-card" onClick={onToLayanan}>
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                  <path d="M20 15C20 18.866 16.866 22 13 22C9.134 22 6 18.866 6 15C6 11.134 9.134 8 13 8C16.866 8 20 11.134 20 15Z"/>
                  <path d="M20 20C23.866 20 27 23.134 27 27C27 30.866 23.866 34 20 34C16.134 34 13 30.866 13 27C13 23.134 16.134 20 20 20Z"/>
                </svg>
              </div>
              <p className="card-label">Layanan</p>
            </div>

            <div className="menu-card" onClick={onToDataPasien}>
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                  <rect x="8" y="12" width="24" height="20" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M12 12V10C12 8.89543 12.8954 8 14 8H26C27.1046 8 28 8.89543 28 10V12"/>
                  <line x1="8" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <p className="card-label">Data Pasien</p>
            </div>

            <div className="menu-card" onClick={onToJadwal}>
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                  <rect x="8" y="8" width="24" height="24" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <line x1="8" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2"/>
                  <circle cx="14" cy="11" r="1" fill="white"/>
                  <circle cx="18" cy="11" r="1" fill="white"/>
                  <circle cx="22" cy="11" r="1" fill="white"/>
                </svg>
              </div>
              <p className="card-label">Jadwal</p>
            </div>

            <div className="menu-card" onClick={onToLaporan}>
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                  <path d="M8 8L20 2L32 8V18C32 26 20 34 20 34C20 34 8 26 8 18V8Z" stroke="white" strokeWidth="2" fill="none"/>
                  <polyline points="14,20 18,24 26,14" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <p className="card-label">Laporan</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-container">
              <h2 className="chart-title">Rekap Pasien Per Kategori Layanan</h2>
              
              <div className="chart-content">
                <div className="pie-chart">
                  <svg viewBox="0 0 200 200" className="pie-svg">
                    {rekapData.data.map((item, index) => {
                      const startAngle = rekapData.data
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.persentase * 3.6), 0);
                      const angle = item.persentase * 3.6;
                      
                      return (
                        <PieSlice
                          key={index}
                          startAngle={startAngle}
                          angle={angle}
                          color={pieColors[index]}
                          percentage={item.persentase}
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="chart-legend">
                  {rekapData.data.map((item, index) => (
                    <div key={index} className="legend-item">
                      <span 
                        className="legend-color" 
                        style={{ backgroundColor: pieColors[index] }}
                      ></span>
                      <span className="legend-label">
                        {item.layanan}: <span className="legend-value">X Pasien</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper component for pie chart slice
function PieSlice({ startAngle, angle, color, percentage }) {
  const radius = 80;
  const cx = 100;
  const cy = 100;
  
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (startAngle + angle - 90) * Math.PI / 180;
  
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  
  const largeArc = angle > 180 ? 1 : 0;
  
  const pathData = [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ');

  // Calculate label position
  const labelAngle = startAngle + angle / 2;
  const labelRad = (labelAngle - 90) * Math.PI / 180;
  const labelRadius = radius * 0.7;
  const labelX = cx + labelRadius * Math.cos(labelRad);
  const labelY = cy + labelRadius * Math.sin(labelRad);
  
  return (
    <g>
      <path d={pathData} fill={color} />
      <text 
        x={labelX} 
        y={labelY} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    </g>
  );
}

export default Dashboard;
