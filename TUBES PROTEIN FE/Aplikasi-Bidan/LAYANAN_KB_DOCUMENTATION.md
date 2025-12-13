# Implementasi Layanan KB (Keluarga Berencana)

## Deskripsi
Halaman detail untuk layanan Keluarga Berencana (KB) yang memungkinkan pencatatan dan pengelolaan data pelayanan kontrasepsi.

## File yang Dibuat
1. **LayananKB.js** - Komponen utama untuk halaman layanan KB
2. **LayananKB.css** - Styling untuk halaman layanan KB

## File yang Dimodifikasi
1. **App.js** 
   - Menambahkan import `LayananKB`
   - Menambahkan fungsi `handleToKB()`
   - Menambahkan routing untuk page 'kb'
   - Mengirim props `onToKB` dan `userData` ke `DashboardLayanan`

2. **DashboardLayanan.js**
   - Menambahkan props `onToKB` dan `userData` pada function signature
   - Menambahkan onClick handler pada card "Keluarga Berencana (KB)"

## Fitur Layanan KB

### 1. Tampilan Utama (Riwayat Pelayanan)
- Welcome message dengan nama user
- 2 action buttons:
  - Tambah Pasien (icon: SVG user)
  - Buat Jadwal (icon: SVG calendar)
- Search bar untuk mencari data pelayanan
- List riwayat pelayanan dengan tombol edit dan delete
- Data dari endpoint: `GET /pemeriksaan?jenis_layanan=KB`

### 2. Form Registrasi KB
Dibagi menjadi 4 section:

#### **Informasi Layanan**
- Jenis Layanan (default: "KB")
- Tanggal (date picker)
- Nomor Registrasi Lama (text)
- Nomor Registrasi Baru (text)
- Metode (dropdown):
  - Pil KB
  - Suntik KB
  - IUD
  - Implan
  - Kondom
  - MOW (Tubektomi)
  - MOP (Vasektomi)

#### **Data Ibu**
- Nama Istri (text, full width, required)
- NIK (text, 16 digit, required)
- Umur/Th (number, required)
- TD/Tekanan Darah (text)
- BB/Berat Badan (text)

#### **Data Ayah**
- Nama Suami (text, full width, required)
- NIK (text, 16 digit, required)
- Umur/Th (number)
- TD/Tekanan Darah (text)
- BB/Berat Badan (text)

#### **Informasi Tambahan**
- Alamat (text, required)
- Nomor HP (tel, required)
- Kunjungan Ulang (date picker)
- Catatan (textarea)

### 3. Sidebar Menu
- **Profil Saya** - Avatar dan button profil
- **Menu Section**:
  - Tambah Pasien
  - Tambah Pengunjung
  - Buat Laporan
- **Riwayat Section**:
  - Riwayat Data Masuk
  - Riwayat Masuk Akun

## API Endpoints

### GET Riwayat Pelayanan
```
GET /pemeriksaan?jenis_layanan=KB
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "success",
  "data": [
    {
      "id": 1,
      "nama_pasien": "...",
      "tanggal": "2025-01-15"
    }
  ]
}
```

### POST Submit Registrasi KB
```
POST /pemeriksaan
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "id_pasien": 123,
  "jenis_layanan": "KB",
  "subjektif": "catatan dari form",
  "objektif": "TD Ibu: 120/80, BB Ibu: 55kg",
  "analisa": "Metode KB: Pil KB",
  "tatalaksana": "Kunjungan ulang: 2025-02-15"
}
```

### DELETE Riwayat
```
DELETE /pemeriksaan/{id}
Authorization: Bearer {token}
```

## Styling & Design

### Color Scheme
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (purple gradient background)
- **Secondary Gradient**: `linear-gradient(135deg, #E91E8C 0%, #C71874 100%)` (pink gradient for buttons)
- **Form Section Background**: Pink gradient `#E91E8C to #C71874`
- **Text Colors**: White untuk labels di form, #333 untuk text hitam
- **Card Background**: `rgba(255, 255, 255, 0.95)` with glassmorphism

### Layout Features
- **Responsive Design**: 3 breakpoints (1200px, 768px, 480px)
- **Flexbox Layout**: Sidebar + Main area
- **Form Grid**: Dynamic row layout dengan `flex: 1` untuk responsiveness
- **Glassmorphism**: `backdrop-filter: blur(10px)` pada sidebar
- **Hover Effects**: Transform translateY(-2px), shadow effects
- **Border Radius**: 8px untuk inputs, 12px untuk sections, 16px untuk containers

### Component Structure
```
LayananKB
├── Header (white background, logo, title, button kembali)
├── Content Container
│   ├── Sidebar (profile + menu)
│   └── Main Area
│       ├── Welcome Section (conditional: !showForm)
│       │   ├── Welcome Text
│       │   └── Action Buttons (Tambah Pasien, Buat Jadwal)
│       ├── Riwayat Section (conditional: !showForm)
│       │   ├── Search Bar
│       │   └── Riwayat List (edit, delete buttons)
│       └── Form Container (conditional: showForm)
│           ├── Informasi Layanan Section
│           ├── Data Ibu Section
│           ├── Data Ayah Section
│           ├── Informasi Tambahan Section
│           └── Form Actions (Batal, Simpan)
```

## Navigation Flow
```
Dashboard → Layanan → KB
                      ↓
             [Tampilan Utama]
                      ↓
            [Buat Jadwal Button]
                      ↓
              [Form Registrasi]
                      ↓
         [Submit → Back to Riwayat]
```

## Status Implementasi

✅ **Completed:**
- Component LayananKB.js dengan state management
- Styling LayananKB.css dengan responsive design
- Form dengan 4 sections sesuai gambar
- Riwayat pelayanan dengan search & CRUD actions
- Navigation integration di App.js
- Click handler di DashboardLayanan card KB
- Mock data untuk development

⏳ **Ready for API Integration:**
- GET /pemeriksaan?jenis_layanan=KB (commented TODO)
- POST /pemeriksaan (commented TODO)
- DELETE /pemeriksaan/{id} (commented TODO)
- Search functionality (TODO: implement filter)

🔄 **Future Enhancements:**
- Edit functionality (handleEdit implemented but needs form population)
- Sidebar menu navigation (buttons created but no handlers yet)
- Advanced search filters
- Pagination untuk riwayat pelayanan
- Export data KB ke Excel
- Print form registrasi

## Testing Checklist

### Manual Testing
- [ ] Klik card "Keluarga Berencana" di Dashboard Layanan
- [ ] Verifikasi tampilan riwayat pelayanan
- [ ] Klik button "Buat Jadwal" → form muncul
- [ ] Fill all required fields dan submit
- [ ] Test button "Batal" → form tertutup
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test hover effects pada buttons dan cards
- [ ] Klik button "Kembali" → kembali ke Dashboard Layanan

### Integration Testing (After API Uncommented)
- [ ] Fetch riwayat pelayanan on component mount
- [ ] Search functionality filters data
- [ ] Submit form POST ke API successfully
- [ ] Delete riwayat dengan confirmation
- [ ] Token authentication works
- [ ] Error handling displays user-friendly messages

## Notes
- NIK validation: maxLength 16 digits
- Form metode KB: 7 options available
- localStorage token required: `localStorage.getItem('token')`
- userData prop dari App.js berisi `username`, `email`, `nama_lengkap`
- All API calls ready to uncomment (marked with TODO)

---
**Last Updated:** 2025-11-20
**Version:** 1.0.0
