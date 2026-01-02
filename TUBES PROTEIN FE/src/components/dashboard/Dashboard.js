import { useState, useEffect } from 'react';
import './Dashboard.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import userIcon from '../../assets/images/icons/icons8-user-100.png';
import serviceIcon from '../../assets/images/icons/icons8-service-100.png';
import familyIcon from '../../assets/images/icons/icons8-family-100.png';
import scheduleIcon from '../../assets/images/icons/icons8-schedule-100.png';
import reportIcon from '../../assets/images/icons/icons8-graph-report-100.png';
import Sidebar from '../shared/Sidebar';
import dashboardService from '../../services/dashboard.service';

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

  useEffect(() => {
    const fetchRekapLayanan = async () => {
      try {
        const response = await dashboardService.getRekapLayanan();
        
        if (response.success) {
          setRekapData({
            total: response.data.total,
            data: response.data.data
          });
        }
      } catch (error) {
        console.error('Error fetching rekap layanan:', error);
        // Fallback ke default data jika API gagal
        setRekapData({
          total: 0,
          data: [
            { layanan: "ANC", jumlah_pasien: 0, persentase: 0 },
            { layanan: "Persalinan", jumlah_pasien: 0, persentase: 0 },
            { layanan: "KB", jumlah_pasien: 0, persentase: 0 },
            { layanan: "Imunisasi", jumlah_pasien: 0, persentase: 0 },
            { layanan: "Kunjungan Pasien", jumlah_pasien: 0, persentase: 0 }
          ]
        });
      }
    };
    
    fetchRekapLayanan();
  }, []);

  const pieColors = {
    'ANC': '#E91E8C',
    'Persalinan': '#F06FA8',
    'KB': '#F59BC4',
    'Imunisasi': '#FAC7E0',
    'Kunjungan Pasien': '#FDE3F0'
  };

  // Filter data to only show categories with patients
  const activeRekapData = rekapData.data.filter(item => item.jumlah_pasien > 0);

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
                <img src={userIcon} alt="User" style={{width: '40px', height: '40px', filter: 'brightness(0) invert(1)'}} />
              </div>
              <p className="card-label">Informasi Pengguna</p>
            </div>

            <div className="menu-card" onClick={onToLayanan}>
              <div className="card-icon">
                <img src={serviceIcon} alt="Service" style={{width: '40px', height: '40px', filter: 'brightness(0) invert(1)'}} />
              </div>
              <p className="card-label">Layanan</p>
            </div>

            <div className="menu-card" onClick={onToDataPasien}>
              <div className="card-icon">
                <img src={familyIcon} alt="Family" style={{width: '40px', height: '40px', filter: 'brightness(0) invert(1)'}} />
              </div>
              <p className="card-label">Data Pasien</p>
            </div>

            <div className="menu-card" onClick={onToJadwal}>
              <div className="card-icon">
                <img src={scheduleIcon} alt="Schedule" style={{width: '40px', height: '40px', filter: 'brightness(0) invert(1)'}} />
              </div>
              <p className="card-label">Jadwal</p>
            </div>

            <div className="menu-card" onClick={onToLaporan}>
              <div className="card-icon">
                <img src={reportIcon} alt="Report" style={{width: '40px', height: '40px', filter: 'brightness(0) invert(1)'}} />
              </div>
              <p className="card-label">Laporan</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-container">
              <h2 className="chart-title">Rekap Pasien Per Kategori Layanan</h2>
              
              <div className="chart-content">
                {rekapData.total > 0 ? (
                  <>
                    <div className="pie-chart">
                      <svg viewBox="0 0 200 200" className="pie-svg">
                        {activeRekapData.map((item, index) => {
                          const startAngle = activeRekapData
                            .slice(0, index)
                            .reduce((sum, d) => sum + (d.persentase * 3.6), 0);
                          const angle = item.persentase * 3.6;
                          
                          return (
                            <PieSlice
                              key={index}
                              startAngle={startAngle}
                              angle={angle}
                              color={pieColors[item.layanan] || '#pink'}
                              percentage={item.persentase}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <div className="chart-legend">
                      {activeRekapData.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: pieColors[item.layanan] }}
                          ></span>
                          <span className="legend-label">
                            {item.layanan}: <span className="legend-value">{item.jumlah_pasien} Pasien</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-chart-state">
                    <p>Data tidak ditemukan</p>
                  </div>
                )}
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
  
  if (percentage >= 100) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={color} />
        <text 
          x={cx} 
          y={cy} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          100%
        </text>
      </g>
    );
  }

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
