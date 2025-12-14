# Panduan Formulir Layanan Terintegrasi

## Fitur Utama ✨

### 1. **Tab Switching untuk Jenis Layanan**
- Satu formulir untuk 4 jenis layanan:
  - 🤰 **Persalinan** (Delivery/Childbirth)
  - 🤱 **ANC** (Antenatal Care)
  - 💊 **KB** (Keluarga Berencana/Family Planning)
  - 💉 **Imunisasi** (Immunization)
- User bisa switch antar layanan **tanpa keluar form**
- Klik tab untuk langsung pindah jenis layanan

### 2. **Pencarian & Pemilihan Pasien**
- **Autocomplete Search**: Ketik minimal 2 karakter
- Search by: Nama, NIK, No HP
- Dropdown menampilkan:
  - Nama Lengkap
  - NIK
  - Umur
- **Auto-fill Form**: Pilih pasien → form otomatis terisi dengan data:
  - ID Pasien
  - Nama
  - Umur
  - NIK
  - No HP
  - Alamat

### 3. **Dynamic Form Fields**
Form fields berubah otomatis sesuai jenis layanan yang dipilih:

#### Persalinan
- Tanggal Persalinan
- Jenis Persalinan (Normal/Caesar)
- Berat Bayi (gram)
- Panjang Bayi (cm)
- Kondisi Ibu
- Kondisi Bayi

#### ANC
- Tanggal Pemeriksaan
- Usia Kehamilan (minggu)
- Berat Badan (kg)
- Tekanan Darah Sistolik
- Tekanan Darah Diastolik
- Tinggi Fundus (cm)
- Denyut Jantung Janin (DJJ)
- Keluhan
- Catatan

#### KB (Keluarga Berencana)
- Tanggal Kunjungan
- Metode KB (Pil, Suntik, IUD, Implant, Kondom, dll)
- Kunjungan Berikutnya
- Berat Badan
- Tekanan Darah Sistolik
- Tekanan Darah Diastolik
- Keluhan
- Catatan

#### Imunisasi
- Tanggal Imunisasi
- Jenis Vaksin (BCG, DPT, Polio, Campak, Hepatitis B, dll)
- Nama Anak
- Tanggal Lahir Anak
- Berat Badan Anak (kg)
- Kondisi Anak
- Reaksi Imunisasi
- Catatan

## Cara Penggunaan 📝

### Langkah 1: Pilih/Ganti Jenis Layanan
```
Klik tab yang diinginkan:
[Persalinan] [ANC] [KB] [Imunisasi]
```

### Langkah 2: Cari & Pilih Pasien
```
1. Ketik di field "Cari Pasien (Nama/NIK/No HP)"
2. Dropdown muncul setelah 2 karakter
3. Klik pasien yang diinginkan
4. Form otomatis terisi dengan data pasien
```

### Langkah 3: Isi Data Layanan
```
- Field yang berkaitan dengan pasien sudah terisi otomatis
- Isi field tambahan sesuai jenis layanan
- Semua field dengan tanda (*) wajib diisi
```

### Langkah 4: Submit
```
Klik tombol "Simpan Data [Jenis Layanan]"
```

### Langkah 5: Konfirmasi
```
✅ Sukses: Muncul pesan dengan Nomor Registrasi
❌ Gagal: Muncul pesan error
```

## Technical Details 🔧

### Arsitektur
```
FormulirLayanan Component
├── State Management
│   ├── jenisLayanan (active tab)
│   ├── formData (form values)
│   ├── selectedPasien (selected patient)
│   └── daftarPasien (search results)
│
├── Services
│   ├── pasienService (patient search)
│   ├── persalinanService (delivery API)
│   ├── ancService (ANC API)
│   ├── kbService (family planning API)
│   └── imunisasiService (immunization API)
│
└── Features
    ├── Tab Switching
    ├── Patient Search & Autocomplete
    ├── Dynamic Form Rendering
    └── Unified Submit Handler
```

### API Endpoints
```
GET  /pasien?search={query}     - Search patients
POST /persalinan                 - Create delivery record
POST /anc                        - Create ANC record
POST /kb                         - Create family planning record
POST /imunisasi                  - Create immunization record
```

### Routing
```javascript
/formulir-persalinan  → FormulirLayanan (initialJenisLayanan: 'Persalinan')
/formulir-anc         → FormulirLayanan (initialJenisLayanan: 'ANC')
/formulir-kb          → FormulirLayanan (initialJenisLayanan: 'KB')
/formulir-imunisasi   → FormulirLayanan (initialJenisLayanan: 'Imunisasi')
```

## Migration Notes 🚀

### Axios → Fetch API
Semua service telah dikonversi dari axios ke native fetch API untuk menghindari webpack 5 polyfill issues:

**Before:**
```javascript
const response = await axios.post(url, data, { headers });
return { success: true, data: response.data };
```

**After:**
```javascript
const response = await fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify(data)
});
if (!response.ok) throw new Error(await response.json().message);
const result = await response.json();
return { success: true, data: result };
```

### Benefits
✅ No external dependencies untuk HTTP client  
✅ Lebih kecil bundle size  
✅ Native browser API, lebih cepat  
✅ No webpack configuration needed  
✅ No polyfill errors  

## Files Created/Modified 📁

### New Files
```
src/components/layanan/FormulirLayanan.js      (738 lines)
src/components/layanan/FormulirLayanan.css     (Complete styling)
src/services/persalinan.service.js              (Fetch API)
src/services/anc.service.js                     (Fetch API)
src/services/kb.service.js                      (Fetch API)
src/services/imunisasi.service.js               (Fetch API)
```

### Modified Files
```
src/App.js                                      (Added routing)
```

## Testing Checklist ✔️

- [ ] Tab switching works (Persalinan ↔️ ANC ↔️ KB ↔️ Imunisasi)
- [ ] Patient search shows results after 2 characters
- [ ] Selecting patient auto-fills form
- [ ] Form fields change based on active tab
- [ ] Submit Persalinan record
- [ ] Submit ANC record
- [ ] Submit KB record
- [ ] Submit Imunisasi record
- [ ] Success message shows nomor_registrasi
- [ ] Error handling works
- [ ] Form reset after successful submit

## Known Issues & TODOs 🔨

### Backend Verification Needed
Pastikan backend memiliki endpoints berikut dengan field yang sesuai:
```
POST /persalinan
POST /anc
POST /kb
POST /imunisasi
```

### Future Enhancements
- [ ] Add edit mode untuk existing records
- [ ] Add history view untuk patient's previous services
- [ ] Add print/export functionality
- [ ] Add advanced search filters
- [ ] Add bulk registration
- [ ] Add notification system

## Support 💬

Jika menemukan bug atau butuh bantuan, bisa:
1. Check console browser untuk error messages
2. Verify backend API responses
3. Check network tab di DevTools
4. Pastikan token authentication valid

---

**Created by:** GitHub Copilot  
**Date:** 2024  
**Version:** 1.0  
