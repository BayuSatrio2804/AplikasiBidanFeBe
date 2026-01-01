import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import './RiwayatUbahData.css';
import pinkLogo from '../../assets/images/pink-logo.png';
import auditService from '../../services/audit.service';

function RiwayatUbahData({ onBack, onToRiwayatDataMasuk, onToRiwayatMasukAkun, onToProfil, onToTambahPasien, onToTambahPengunjung, onToBuatLaporan, onToPersalinan, onToANC, onToKB, onToImunisasi }) {
  const [riwayatList, setRiwayatList] = useState([]);
  const [allRiwayat, setAllRiwayat] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayatList();
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const fetchRiwayatList = async () => {
    try {
      setLoading(true);
      const response = await auditService.getDetailedDataLogs();
      
      // Extract data from response wrapper
      const logs = response && response.data ? response.data : response;
      
      if (logs && Array.isArray(logs)) {
        const formattedData = logs.map((item, idx) => ({
          id: item.id_audit || idx,
          tanggal: formatDate(item.tanggal),
          tanggal_raw: item.tanggal,
          nama_pasien: item.nama_pasien || '-',
          nomor_registrasi: item.nomor_registrasi || '-',
          kategori: item.kategori || '-',
          action: item.action || 'CREATE',
          keterangan: getKeterangan(item.action),
          diubah_oleh: item.diubah_oleh || '-'
        }));
        setAllRiwayat(formattedData);
        setRiwayatList(formattedData);
      } else {
        setAllRiwayat([]);
        setRiwayatList([]);
      }
    } catch (error) {
      console.error('Error fetching riwayat ubah data:', error);
      setAllRiwayat([]);
      setRiwayatList([]);
    } finally {
      setLoading(false);
    }
  };

  const getKeterangan = (action) => {
    switch (action) {
      case 'CREATE':
        return 'Dibuat';
      case 'UPDATE':
        return 'Diubah';
      case 'DELETE':
        return 'Dihapus';
      case 'RESTORE':
        return 'Dipulihkan';
      case 'DELETE_PERMANEN':
      case 'DELETE_PERMANENT':
        return 'Hapus Permanen';
      default:
        return action;
    }
  };

  // Filter data berdasarkan search dan filter yang dipilih
  const applyFilter = () => {
    let filtered = allRiwayat;

    // Filter berdasarkan nama pasien, nomor registrasi, atau username
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nomor_registrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.diubah_oleh.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan action (CREATE, UPDATE, DELETE)
    if (filterAction) {
      filtered = filtered.filter(item => item.action === filterAction);
    }

    // Filter berdasarkan kategori
    if (filterKategori) {
      filtered = filtered.filter(item => item.kategori === filterKategori);
    }

    // Filter berdasarkan tanggal mulai
    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal_raw);
        return itemDate >= startDate;
      });
    }

    // Filter berdasarkan tanggal akhir
    if (filterEndDate) {
      const endDate = new Date(filterEndDate);
      endDate.setHours(23, 59, 59); // Termasuk seluruh hari
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal_raw);
        return itemDate <= endDate;
      });
    }

    setRiwayatList(filtered);
  };

  // Gunakan applyFilter ketika ada perubahan di filter atau search
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterAction, filterKategori, filterStartDate, filterEndDate, allRiwayat]);

  return (
    <div className="riwayat-ubah-data-page">
      {/* Header */}
      <div className="rud-header">
        <div className="rud-header-left">
          <div className="rud-header-icon">
            <img src={pinkLogo} alt="Pink Logo" className="rud-header-logo-img" />
          </div>
          <h1 className="rud-header-title">Riwayat Ubah Data</h1>
        </div>
        <button className="btn-kembali-rud" onClick={onBack}>Kembali</button>
      </div>

      {/* Main Content */}
      <div className="rud-content">
        {/* Sidebar */}
        <Sidebar
          activePage="riwayat-ubah-data"
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

        {/* Main Area */}
        <main className="rud-main-area">
          {/* Search Section */}
          <div className="rud-search-section">
            <div className="rud-search-bar">
              <input
                type="text"
                className="rud-search-input"
                placeholder="Cari nama pasien, no registrasi, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="rud-filter-btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M3 6h14M6 10h8M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Filter Panel */}
            {showFilter && (
              <div className="rud-filter-panel">
                <div className="filter-group">
                  <label>Tipe Aksi</label>
                  <select 
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                  >
                    <option value="">Semua Aksi</option>
                    <option value="CREATE">Dibuat</option>
                    <option value="UPDATE">Diubah</option>
                    <option value="DELETE">Dihapus</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Kategori</label>
                  <select 
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                  >
                    <option value="">Semua Kategori</option>
                    <option value="pemeriksaan">Pemeriksaan</option>
                    <option value="layanan_anc">Layanan ANC</option>
                    <option value="layanan_kb">Layanan KB</option>
                    <option value="layanan_imunisasi">Layanan Imunisasi</option>
                    <option value="layanan_persalinan">Layanan Persalinan</option>
                    <option value="layanan_kunjungan_pasien">Layanan Kunjungan Pasien</option>
                    <option value="jadwal">Jadwal</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Dari Tanggal</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Sampai Tanggal</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </div>

                <button 
                  className="btn-reset-filter"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterAction('');
                    setFilterKategori('');
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setShowFilter(false);
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rud-table-container">
            <table className="rud-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pasien</th>
                  <th>Nomor Registrasi</th>
                  <th>Kategori</th>
                  <th>Keterangan</th>
                  <th>Diubah Oleh</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : riwayatList.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Belum ada riwayat ubah data</td></tr>
                ) : (
                  riwayatList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.tanggal}</td>
                      <td>{item.nama_pasien}</td>
                      <td>{item.nomor_registrasi}</td>
                      <td>{item.kategori}</td>
                      <td>
                        <span className={`rud-status ${
                          item.action === 'UPDATE' ? 'status-diubah' : 
                          (item.action === 'DELETE' || item.action === 'DELETE_PERMANENT' || item.action === 'DELETE_PERMANEN') ? 'status-dihapus' : 
                          item.action === 'RESTORE' ? 'status-dibuat' : 'status-dibuat'
                        }`}>
                          {item.keterangan}
                        </span>
                      </td>
                      <td>
                        <div className="rud-user">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#E5E5E5"/>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999"/>
                          </svg>
                          <span>{item.diubah_oleh}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RiwayatUbahData;
