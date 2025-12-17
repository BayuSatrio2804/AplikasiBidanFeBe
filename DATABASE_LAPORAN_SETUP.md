# 📊 Database Setup Guide - Tabel Laporan

## 🎯 Overview

Database table `laporan` telah dibuat untuk menyimpan summary laporan dengan field:
- `id_laporan` (CHAR(36) PRIMARY KEY)
- `jenis_layanan` (VARCHAR(50))
- `periode` (VARCHAR(20))
- `tanggal_dibuat` (DATE)
- `jumlah_pasien` (INT)
- `jumlah_kunjungan` (INT)
- `label` (VARCHAR(100))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 🚀 Cara Setup Database

### Option 1: MySQL Command Line

```bash
# Login ke MySQL
mysql -u root -p

# Jalankan script
source "d:/APLIKASI-BIDAN/AplikasiBidanFeBe/TUBES PROTEIN BE/aplikasi-bidan-pintar/database/add-laporan-table.sql"
```

### Option 2: MySQL Workbench

1. Buka MySQL Workbench
2. Connect ke server
3. File → Open SQL Script
4. Pilih file: `add-laporan-table.sql`
5. Execute script (⚡ icon atau Ctrl+Shift+Enter)

### Option 3: Copy-Paste Query

Buka file `add-laporan-table.sql` dan copy-paste ke MySQL client/workbench.

---

## 📝 Verifikasi

Setelah menjalankan script, verifikasi dengan query:

```sql
-- Cek struktur table
DESCRIBE laporan;

-- Cek data sample
SELECT * FROM laporan ORDER BY tanggal_dibuat DESC;

-- Cek jumlah data
SELECT COUNT(*) as total FROM laporan;
```

Expected output:
- Table laporan ada dengan 10 kolom
- Ada 10 sample data
- Total count: 10

---

## 🔄 API Endpoints yang Tersedia

### GET /api/laporan/list
Get list of all laporan summaries

**Query Parameters:**
- `jenis_layanan` (optional) - Filter by service type
- `periode` (optional) - Filter by period (e.g., "01/2025")
- `search` (optional) - Search in label, jenis_layanan, or periode
- `limit` (optional) - Limit results

**Response:**
```json
{
  "status": "success",
  "message": "Data laporan berhasil diambil",
  "data": [
    {
      "id_laporan": "110e8400-e29b-41d4-a716-446655440001",
      "jenis_layanan": "ANC",
      "periode": "01/2025",
      "tanggal_dibuat": "2025-01-31",
      "jumlah_pasien": 45,
      "jumlah_kunjungan": 120,
      "label": "Laporan ANC Januari 2025",
      "created_at": "2025-12-17T..."
    }
  ]
}
```

### GET /api/laporan/:id
Get single laporan by ID

### POST /api/laporan
Create new laporan

**Body:**
```json
{
  "jenis_layanan": "ANC",
  "periode": "12/2025",
  "tanggal_dibuat": "2025-12-17",
  "jumlah_pasien": 50,
  "jumlah_kunjungan": 130,
  "label": "Laporan ANC Desember 2025"
}
```

### PUT /api/laporan/:id
Update existing laporan

### DELETE /api/laporan/:id
Delete laporan

### GET /api/laporan?format=excel&bulan=1&tahun=2025
Generate Excel report (unchanged)

---

## 🔧 Frontend Integration

Frontend sudah diupdate untuk:
1. ✅ Fetch data dari API `/laporan/list`
2. ✅ Display data real dari database
3. ✅ Export data list ke Excel
4. ✅ Generate Excel dari API

---

## 📊 Sample Data

Table sudah include 10 sample data:
- 3 laporan ANC (Januari, April, November 2025)
- 2 laporan KB (Januari, April 2025)
- 2 laporan Imunisasi (Februari, Desember 2025)
- 1 laporan Persalinan (Februari 2025)
- 1 laporan Kunjungan Pasien (Maret 2025)
- 1 laporan Semua layanan (Mei 2025)

---

## ✅ Testing

### Test Database
```sql
-- Test select all
SELECT * FROM laporan;

-- Test filter by jenis_layanan
SELECT * FROM laporan WHERE jenis_layanan = 'ANC';

-- Test search
SELECT * FROM laporan WHERE label LIKE '%Januari%';
```

### Test API
```bash
# Get list
curl -X GET "http://localhost:5000/api/laporan/list" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get by ID
curl -X GET "http://localhost:5000/api/laporan/110e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create new
curl -X POST "http://localhost:5000/api/laporan" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jenis_layanan": "ANC",
    "periode": "12/2025",
    "tanggal_dibuat": "2025-12-17",
    "jumlah_pasien": 50,
    "jumlah_kunjungan": 130,
    "label": "Test Laporan"
  }'
```

### Test Frontend
1. Login ke aplikasi
2. Navigate ke halaman Laporan
3. Data list harus load dari database (bukan mock data)
4. Test search functionality
5. Test export to Excel

---

## 🔍 Troubleshooting

### Table already exists
```sql
DROP TABLE IF EXISTS laporan;
-- Then run the script again
```

### No data showing
```sql
-- Check if data exists
SELECT COUNT(*) FROM laporan;

-- Re-insert sample data if needed
-- Copy INSERT statements from add-laporan-table.sql
```

### API returns empty array
- Check database connection
- Verify token is valid
- Check if table exists: `SHOW TABLES LIKE 'laporan'`

---

## 📦 Files Modified/Created

### Backend
1. ✅ `database/add-laporan-table.sql` - Database migration script
2. ✅ `src/services/laporan.service.js` - Added CRUD functions
3. ✅ `src/controllers/laporan.controller.js` - Added list/CRUD endpoints
4. ✅ `src/routes/laporan.routes.js` - Added new routes

### Frontend
1. ✅ `src/services/laporan.service.js` - Added API calls
2. ✅ `src/components/laporan/Laporan.js` - Fetch from API

### Documentation
1. ✅ `DATABASE_LAPORAN_SETUP.md` - This file

---

## 🎉 Summary

✅ Database table created with proper structure
✅ Sample data inserted (10 records)
✅ Backend CRUD operations implemented
✅ API endpoints ready
✅ Frontend integrated with API
✅ Excel generation still working
✅ Export list functionality working

**Next Step**: Run the SQL script to create the table!

```bash
mysql -u root -p aplikasi_bidan < "d:/APLIKASI-BIDAN/AplikasiBidanFeBe/TUBES PROTEIN BE/aplikasi-bidan-pintar/database/add-laporan-table.sql"
```
