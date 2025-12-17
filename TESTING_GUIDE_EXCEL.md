# Quick Start Guide - Testing Fitur Generate Excel

## 🎯 Langkah Testing

### 1. Persiapan

#### Backend
```bash
cd "d:\APLIKASI-BIDAN\AplikasiBidanFeBe\TUBES PROTEIN BE\aplikasi-bidan-pintar"
npm start
```
✅ Server harus running di `http://localhost:5000`

#### Frontend
```bash
cd "d:\APLIKASI-BIDAN\AplikasiBidanFeBe\TUBES PROTEIN FE"
npm start
```
✅ App harus running di `http://localhost:3000`

---

### 2. Test Fitur

#### A. Generate Excel dari API (Server-side)

1. Login ke aplikasi
2. Navigasi ke halaman **Laporan**
3. Pilih **Bulan** (contoh: Januari = 1)
4. Pilih **Tahun** (contoh: 2025)
5. Klik tombol **"Generate Excel"**
6. ✅ File `Laporan_Detil_01_2025.xlsx` harus terdownload
7. Buka file Excel dan verifikasi:
   - Header ada dan ter-format (bold, background abu-abu)
   - Data ada atau pesan "Tidak ada data"
   - Kolom: No, Nama Pasien, Tanggal Periksa, Jenis Layanan, Subjektif, Objektif, Analisa, Tatalaksana

#### B. Export Data List (Client-side)

1. Masih di halaman **Laporan**
2. Data list sudah ditampilkan (mock data atau real data)
3. Klik tombol **Download** (icon panah ke bawah di sebelah search)
4. ✅ File `Laporan_List_YYYY-MM-DD.xlsx` harus terdownload
5. Buka file Excel dan verifikasi:
   - Data list yang ditampilkan ter-export semua
   - Kolom: No, Label, Jenis Layanan, Periode, dll.

---

### 3. Test Error Handling

#### Error Case 1: Bulan/Tahun kosong
- Klik "Generate Excel" tanpa pilih bulan/tahun
- ✅ Muncul notifikasi error: "Bulan dan Tahun harus dipilih"

#### Error Case 2: Tidak ada data untuk di-export
- Hapus semua data list (atau filter sampai kosong)
- Klik tombol Download
- ✅ Muncul notifikasi error: "Tidak ada data untuk di-export"

#### Error Case 3: Backend tidak running
- Stop backend server
- Klik "Generate Excel"
- ✅ Muncul notifikasi error dengan pesan yang jelas

---

### 4. Verifikasi File Excel

#### File dari API (Server-side)
```
Laporan_Detil_01_2025.xlsx
├── Sheet: "Laporan 1-2025"
├── Styling:
│   ├── Header: Bold, background #E0E0E0
│   ├── Alternate rows: #F9F9F9
│   ├── Text wrapping: Enabled
│   └── Alignment: Center/Middle
└── Data: From database (pemeriksaan + pasien tables)
```

#### File dari Export List (Client-side)
```
Laporan_List_2025-12-17.xlsx
├── Sheet: "Laporan"
├── Styling: Basic (default xlsx)
└── Data: From current displayed list
```

---

## 🔍 Troubleshooting

### Problem: File tidak terdownload

**Solusi:**
1. Check browser console (F12) untuk error
2. Check Network tab untuk response API
3. Verify token masih valid (re-login)
4. Check backend logs untuk error message

### Problem: File Excel kosong

**Solusi:**
1. Verify database memiliki data untuk periode yang dipilih
2. Check query di `laporan.service.js` (backend)
3. Check table `pemeriksaan` dan `pasien` di database

### Problem: Export list tidak bekerja

**Solusi:**
1. Verify package `xlsx` terinstall: `npm list xlsx`
2. Check browser console untuk error
3. Verify data list tidak kosong

---

## 📊 Expected Results

### Success Scenario
✅ Backend server running (port 5000)
✅ Frontend app running (port 3000)
✅ User logged in dengan token valid
✅ Data tersedia di database (atau mock data)
✅ File Excel ter-download otomatis
✅ File Excel bisa dibuka di Microsoft Excel/LibreOffice/Google Sheets
✅ Data ter-format dengan baik dan readable

### Error Scenario
✅ Error messages jelas dan informatif
✅ No application crash
✅ User dapat retry after fixing issue
✅ Loading indicator shown during process

---

## 🎨 UI/UX yang Diharapkan

1. **Loading State**: Tombol "Generate Excel" berubah menjadi "Mengunduh..." saat proses
2. **Disable State**: Tombol disabled saat proses download
3. **Success Notification**: Notifikasi sukses dengan auto-close 2 detik
4. **Error Notification**: Notifikasi error dengan opsi close manual
5. **File Naming**: Filename descriptive dan include timestamp/period

---

## 📝 Checklist Testing

- [ ] Backend server running
- [ ] Frontend app running  
- [ ] Login berhasil
- [ ] Navigate ke Laporan page
- [ ] Filter bulan/tahun working
- [ ] Tombol "Generate Excel" working
- [ ] File Excel terdownload (API)
- [ ] File Excel bisa dibuka
- [ ] Data correct dan ter-format
- [ ] Tombol Download working
- [ ] File Excel terdownload (Export List)
- [ ] Error handling working
- [ ] Loading state working
- [ ] Notifikasi working
- [ ] No console errors

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass:**
   - ✅ Feature ready for production
   - Document any findings
   - Update user manual if needed

2. **If Tests Fail:**
   - Note specific error messages
   - Check relevant files based on error
   - Fix and re-test
   - Update documentation

---

## 📞 Support Files

- Main Documentation: `EXCEL_FEATURE_DOCUMENTATION.md`
- Backend Controller: `src/controllers/laporan.controller.js`
- Backend Service: `src/services/laporan.service.js`
- Frontend Component: `src/components/laporan/Laporan.js`
- Frontend Service: `src/services/laporan.service.js`

---

**Happy Testing! 🎉**
