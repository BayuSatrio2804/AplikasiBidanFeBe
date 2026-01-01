import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/api';
import './Laporan.css';
import Sidebar from '../shared/Sidebar';
import pinkLogo from '../../assets/images/pink-logo.png';
import Notifikasi from '../notifikasi/NotifikasiComponent';
import { useNotifikasi } from '../notifikasi/useNotifikasi';

function Laporan({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  // Ambil tanggal saat ini untuk default
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [selectedLayanan, setSelectedLayanan] = useState('Semua');
  const [selectedBulan, setSelectedBulan] = useState(currentMonth);
  const [selectedTahun, setSelectedTahun] = useState(currentYear);

  const [searchQuery, setSearchQuery] = useState('');
  const [dataLaporan, setDataLaporan] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total_pasien: 0,
    total_kunjungan: 0,
    layanan_terbanyak: '-'
  });

  const [isLoading, setIsLoading] = useState(false);
  const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();

  const layananOptions = [
    { value: 'Semua', label: 'Semua Layanan' },
    { value: 'ANC', label: 'Layanan ANC' },
    { value: 'KB', label: 'Layanan KB' },
    { value: 'Imunisasi', label: 'Layanan Imunisasi' },
    { value: 'Persalinan', label: 'Layanan Persalinan' },
    { value: 'Kunjungan Pasien', label: 'Kunjungan Pasien' }
  ];

  const bulanOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  // Generate opsi tahun (tahun saat ini - 5 tahun ke belakang)
  const tahunOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: String(year) };
  });

  const fetchLaporanData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        bulan: selectedBulan,
        tahun: selectedTahun,
        jenis_layanan: selectedLayanan === 'Semua' ? '' : selectedLayanan
      });

      const response = await fetch(`${API_BASE_URL}/laporan/summary?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setDataLaporan(result.data.data);
        setSummaryStats(result.data.stats);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showNotifikasi({
        type: 'error',
        message: 'Gagal memuat data laporan',
        onConfirm: hideNotifikasi
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load saat dipasang dan saat filter berubah
  useEffect(() => {
    fetchLaporanData();
  }, [selectedBulan, selectedTahun, selectedLayanan]);

  const handleDownloadExcel = () => {
    if (dataLaporan.length === 0) {
      showNotifikasi({
        type: 'error',
        message: 'Tidak ada data untuk didownload',
        onConfirm: hideNotifikasi
      });
      return;
    }

    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      format: 'excel',
      bulan: selectedBulan,
      tahun: selectedTahun,
      jenis_layanan: selectedLayanan
    });

    // Tentukan nama file yang disederhanakan
    const serviceName = selectedLayanan === 'Semua' ? 'Bulanan' : selectedLayanan.replace(/\s+/g, '_');
    const filename = `Laporan_${serviceName}_${selectedBulan}_${selectedTahun}.xlsx`;

    // Lakukan download
    import { API_BASE_URL } from '../../services/api';
    import { useState, useEffect } from 'react';
    // ... (keep existing lines)

    // Lakukan download
    fetch(`${API_BASE_URL}/laporan/export?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showNotifikasi({
          type: 'success',
          message: 'Laporan berhasil didownload',
          autoClose: true,
          onConfirm: hideNotifikasi
        });
      })
      .catch(error => {
        console.error('Download error:', error);
        showNotifikasi({
          type: 'error',
          message: 'Gagal mendownload laporan',
          onConfirm: hideNotifikasi
        });
      });
  };

  // Filter di sisi klien berdasarkan query pencarian
  const filteredData = dataLaporan.filter(item =>
    item.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jenis_layanan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="laporan-page">
      <div className="laporan-header">
        <div className="laporan-header-left">
          <div className="laporan-header-logo">
            <img src={pinkLogo} alt="Pink Logo" className="laporan-header-logo-img" />
          </div>
          <h1 className="laporan-header-title">Laporan Bulanan</h1>
        </div>
        <button className="btn-kembali-laporan" onClick={onBack}>Kembali</button>
      </div>

      <div className="laporan-content">
        <Sidebar
          activePage="laporan"
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

        <main className="laporan-main-area">
          {/* Dashboard Cards Section */}
          <div className="dashboard-cards">
            <div className="dashboard-card card-pink">
              <div className="card-title">Total Pasien</div>
              <div className="card-value">{summaryStats.total_pasien}</div>
              <div className="card-desc">Orang</div>
            </div>
            <div className="dashboard-card card-purple">
              <div className="card-title">Total Kunjungan</div>
              <div className="card-value">{summaryStats.total_kunjungan}</div>
              <div className="card-desc">Kali</div>
            </div>
            <div className="dashboard-card card-blue">
              <div className="card-title">Layanan Terbanyak</div>
              <div className="card-value small">{summaryStats.layanan_terbanyak}</div>
              <div className="card-desc">Bulan Ini</div>
            </div>
          </div>

          <div className="laporan-filter-section">
            <div className="filter-tabs">
              <div className="filter-group">
                <label>Filter Bulan:</label>
                <select
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(Number(e.target.value))}
                  className="filter-select"
                >
                  {bulanOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(Number(e.target.value))}
                  className="filter-select"
                >
                  {tahunOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Jenis Layanan:</label>
                <select
                  value={selectedLayanan}
                  onChange={(e) => setSelectedLayanan(e.target.value)}
                  className="filter-select"
                >
                  {layananOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="laporan-search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari Nama Pasien / Layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="btn-download-excel"
              onClick={handleDownloadExcel}
              title="Download Excel"
            >
              Export Excel
            </button>
          </div>

          <div className="laporan-data-section">
            {isLoading ? (
              <div className="loading-state">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="no-data-message">
                <p>Tidak ada data ditemukan untuk periode {bulanOptions[selectedBulan - 1].label} {selectedTahun}.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="laporan-table">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>TANGGAL</th>
                      <th>NAMA PASIEN</th>
                      <th>JENIS LAYANAN</th>
                      <th>DIAGNOSA/ANALISA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                        <td><strong>{item.nama_pasien}</strong></td>
                        <td>
                          <span className="service-badge">
                            {item.jenis_layanan}
                          </span>
                        </td>
                        <td>{item.analisa || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Notifikasi
        show={notifikasi.show}
        type={notifikasi.type}
        message={notifikasi.message}
        onConfirm={notifikasi.onConfirm}
        autoClose={notifikasi.autoClose}
      />
    </div>
  );
}

export default Laporan;
