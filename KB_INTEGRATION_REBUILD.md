# KB (Keluarga Berencana) Integration Rebuild - Complete Documentation

## Overview
Complete rebuild of KB (Family Planning) integration to align frontend and backend seamlessly. Frontend form data is now properly mapped to database schema with automatic `jenis_layanan` configuration.

---

## 1. Frontend Data Flow

### Form Data Sent (LayananKB.js)
Frontend sends exactly these fields (matching HTML input names):
```javascript
{
  tanggal: '2025-12-17',                        // Date of service
  nomor_registrasi_lama: 'REG001',              // Optional old registration
  nomor_registrasi_baru: 'REG002',              // Optional new registration
  metode: 'Pil KB',                             // KB method
  nama_ibu: 'Ibu Sari',                         // Mother's name (required)
  nik_ibu: '3101011990050001',                  // Mother's NIK (required)
  umur_ibu: 35,                                 // Mother's age (required)
  td_ibu: '120/80',                             // Mother's blood pressure (optional)
  bb_ibu: '60.5',                               // Mother's weight (optional)
  nama_ayah: 'Bapak Joko',                      // Spouse's name (required)
  nik_ayah: '3101021990050002',                 // Spouse's NIK (optional)
  umur_ayah: 37,                                // Spouse's age (optional)
  td_ayah: '120/80',                            // Spouse's blood pressure (optional)
  bb_ayah: '75.5',                              // Spouse's weight (optional)
  alamat: 'Jalan Merdeka No 123',               // Address (required)
  nomor_hp: '081234567890',                     // Phone number (optional)
  kunjungan_ulang: '2026-01-17',                // Next appointment date (optional)
  catatan: 'Pasien dalam kondisi sehat'        // Notes (optional)
}
```

### Auto-added by Frontend Service
```javascript
jenis_layanan: 'KB'  // Auto-added by layanan.service.js
```

### Frontend Service (layanan.service.js)
- `getAllKB(search)` - Get all KB records
- `createKB(data)` - POST /api/kb with auto jenis_layanan
- `updateKB(id, data)` - PUT /api/kb/:id
- `deleteKB(id)` - DELETE /api/kb/:id
- `getKBById(id)` - GET /api/kb/:id

---

## 2. Backend Validation

### KB Validator Schema (kb.validator.js)

**Required Fields:**
- `jenis_layanan` - Must be exactly 'KB'
- `tanggal` - Date of service
- `metode` - KB method
- `nama_ibu` - Mother's name
- `nik_ibu` - 16-digit mother's NIK
- `umur_ibu` - Mother's age (number)
- `nama_ayah` - Spouse's name
- `alamat` - Address

**Optional Fields:**
- `nomor_registrasi_lama` - Old registration number
- `nomor_registrasi_baru` - New registration number
- `td_ibu` - Mother's blood pressure
- `bb_ibu` - Mother's weight
- `nik_ayah` - Spouse's NIK (16 digits)
- `umur_ayah` - Spouse's age
- `td_ayah` - Spouse's blood pressure
- `bb_ayah` - Spouse's weight
- `nomor_hp` - Phone number
- `kunjungan_ulang` - Next visit date
- `catatan` - Notes

---

## 3. Backend Service Layer

### Database Tables Used

**pasien table:**
```sql
CREATE TABLE pasien (
  id_pasien CHAR(36) PRIMARY KEY,
  nama VARCHAR(100),        -- Mother's name (dari nama_ibu)
  nik CHAR(16),             -- Mother's NIK (dari nik_ibu)
  umur INT,                 -- Mother's age (dari umur_ibu)
  alamat TEXT,
  no_hp VARCHAR(15)         -- From nomor_hp
)
```

**pemeriksaan table:**
```sql
CREATE TABLE pemeriksaan (
  id_pemeriksaan CHAR(36) PRIMARY KEY,
  id_pasien CHAR(36),
  jenis_layanan ENUM('KB', ...),
  subjektif TEXT,           -- Constructed from metode
  objektif TEXT,            -- Constructed from td_ibu, bb_ibu
  analisa TEXT,             -- Constructed from catatan
  tatalaksana TEXT,         -- Constructed from metode
  tanggal_pemeriksaan DATETIME  -- From tanggal
)
```

**layanan_kb table:**
```sql
CREATE TABLE layanan_kb (
  id_kb CHAR(36) PRIMARY KEY,
  id_pemeriksaan CHAR(36),
  no_reg_lama VARCHAR(50),      -- From nomor_registrasi_lama
  no_reg_baru VARCHAR(50),      -- From nomor_registrasi_baru
  nama_suami VARCHAR(100),      -- From nama_ayah
  nik_suami CHAR(16),           -- From nik_ayah
  umur_suami INT,               -- From umur_ayah
  td_ayah VARCHAR(20),          -- From td_ayah
  bb_ayah DECIMAL(5,2),         -- From bb_ayah
  metode_kb ENUM(...),          -- From metode
  kunjungan_ulang DATE,         -- From kunjungan_ulang
  catatan TEXT                  -- From catatan
)
```

### SOAP Field Construction
Service layer constructs SOAP fields from frontend data:

```javascript
// From frontend data:
subjektif_final = `Kunjungan KB Metode: ${metode || '-'}`;
objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}`;
analisa_final = catatan || '';
tatalaksana_final = metode ? `Metode KB: ${metode}` : '';
```

### Service Methods

**createRegistrasiKB(data, userId):**
1. Create/update pasien record (mother)
2. Create pemeriksaan record with SOAP fields
3. Create layanan_kb record
4. Return id_kb, id_pemeriksaan, id_pasien

**updateRegistrasiKB(id_pemeriksaan, data, userId):**
1. Verify pemeriksaan exists
2. Update pasien record
3. Update pemeriksaan with new SOAP fields
4. Update layanan_kb record
5. Return updated record

**deleteRegistrasiKB(id_pemeriksaan, userId):**
1. Delete layanan_kb record
2. Delete pemeriksaan record
3. Record audit log

**getKBById(id_pemeriksaan):**
1. Join pemeriksaan, pasien, layanan_kb tables
2. Return complete record

---

## 4. API Endpoints

### Create KB Registration
```
POST /api/kb
Headers: Authorization: Bearer {token}
Body: { ...frontendFormData }
Response: { success: true, message: "...", data: { id_kb, id_pemeriksaan, id_pasien } }
```

### Get All KB Records
```
GET /api/pemeriksaan?jenis_layanan=KB&search={query}
Returns: List of KB records with patient info
```

### Get Single KB Record
```
GET /api/kb/{id_pemeriksaan}
Returns: Complete KB record with all details
```

### Update KB Registration
```
PUT /api/kb/{id_pemeriksaan}
Headers: Authorization: Bearer {token}
Body: { ...frontendFormData }
Response: { success: true, data: { ...updatedRecord } }
```

### Delete KB Registration
```
DELETE /api/kb/{id_pemeriksaan}
Headers: Authorization: Bearer {token}
Response: { success: true, message: "Deleted" }
```

---

## 5. Integration Checklist

### Frontend ✅
- [x] LayananKB.js form with correct field names matching HTML inputs
- [x] formData state updated to match HTML input names
- [x] handleInputChange processes all field types correctly
- [x] handleSubmit calls layananService.createKB/updateKB
- [x] layanan.service.js with complete KB methods (create, read, update, delete)
- [x] jenis_layanan auto-filled and sent by service
- [x] Form appearance unchanged

### Backend ✅
- [x] kb.validator.js with correct schema matching frontend fields
- [x] kb.controller.js with 4 methods (create, read, update, delete)
- [x] kb.routes.js with 4 routes
- [x] kb.service.js with SOAP field construction and all CRUD methods
- [x] Database transactions for data consistency
- [x] Audit logging for all operations
- [x] server.js mounts routes at /api/kb and /v1/kb

### Data Flow ✅
- [x] Frontend form → layanan.service.js (adds jenis_layanan)
- [x] layanan.service.js → API /api/kb
- [x] API → kb.controller.js
- [x] Controller → kb.validator.js (validation)
- [x] Validator → kb.service.js (if valid)
- [x] Service → Database (pasien, pemeriksaan, layanan_kb)
- [x] Response back to frontend

---

## 6. Field Name Mapping

Frontend form uses underscored names. Service maps them to database:

| Frontend Field | Database Field (pasien) | Database Field (layanan_kb) |
|---|---|---|
| nama_ibu | nama | - |
| nik_ibu | nik | - |
| umur_ibu | umur | - |
| alamat | alamat | - |
| nomor_hp | no_hp | - |
| nama_ayah | - | nama_suami |
| nik_ayah | - | nik_suami |
| umur_ayah | - | umur_suami |
| td_ayah | - | td_ayah |
| bb_ayah | - | bb_ayah |
| nomor_registrasi_lama | - | no_reg_lama |
| nomor_registrasi_baru | - | no_reg_baru |
| metode | - | metode_kb |
| td_ibu | - | (in pemeriksaan SOAP) |
| bb_ibu | - | (in pemeriksaan SOAP) |

---

## 7. Testing Instructions

### Test Case 1: Create New KB Registration
1. Open LayananKB component
2. Click "Tambah Registrasi"
3. Fill form with valid data:
   - Nama Ibu: "Ibu Sari"
   - NIK Ibu: "3101011990050001"
   - Umur Ibu: 35
   - Nama Ayah: "Bapak Joko"
   - NIK Ayah: "3101021990050002"
   - Alamat: "Jalan Merdeka No 123"
   - Metode: "Pil KB"
4. Click "Simpan"
5. Expected: "Data registrasi KB berhasil disimpan!" notification

### Test Case 2: View KB Records
1. Should see list of all KB records
2. Search function should filter records

### Test Case 3: Update KB Registration
1. Click edit button on any record
2. Modify some fields
3. Click "Simpan"
4. Expected: "Data berhasil diupdate!" notification

### Test Case 4: Delete KB Registration
1. Click delete button on any record
2. Confirm deletion
3. Expected: Record removed from list

---

## 8. Files Modified

### Frontend
- `src/components/layanan/LayananKB.js` - Updated formData field names to match HTML inputs

### Frontend Service
- `src/services/layanan.service.js` - Added getKBById, updateKB, deleteKB methods

### Backend Validator
- `src/validators/kb.validator.js` - Updated schema to match frontend field names

### Backend Service
- `src/services/kb.service.js` - Added complete CRUD methods with SOAP construction

### Backend Controller
- `src/controllers/kb.controller.js` - Added 4 controller methods

### Backend Routes
- `src/routes/kb.routes.js` - Added 4 routes (GET, POST, PUT, DELETE)

---

## 9. Troubleshooting

### "Validasi input gagal" Error
- Ensure required fields are filled:
  - nama_ibu, nik_ibu, umur_ibu, alamat (mother)
  - nama_ayah (spouse name)
  - metode (KB method)
- NIK must be exactly 16 digits
- Check console for detailed validation error

### Data Not Saving
- Verify backend running: http://localhost:5000/health
- Check browser console for error messages
- Verify MySQL database connected
- Check backend logs for detailed error

### Records Not Displaying
- Verify GET /api/pemeriksaan?jenis_layanan=KB returns data
- Check if records exist in database
- Clear browser cache and reload

---

## Summary

✅ **KB Integration Rebuild Complete**
- Frontend form sends correctly named fields
- Backend validator accepts those exact fields
- Service constructs SOAP format for pemeriksaan table
- All CRUD operations fully implemented
- jenis_layanan automatically set to 'KB'
- No frontend UI changes
- Database schema properly mapped
- Complete integration from form to database
