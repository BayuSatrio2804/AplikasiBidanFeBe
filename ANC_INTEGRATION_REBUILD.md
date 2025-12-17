# ANC Integration Rebuild - Complete Documentation

## Overview
Fresh rebuild of ANC (Antenatal Care) integration to ensure frontend and backend work seamlessly without changing frontend appearance.

---

## 1. Frontend Data Flow

### Form Data Sent (LayananANC.js)
```javascript
{
  jenis_layanan: 'ANC',              // Auto-filled, readonly
  tanggal: '2025-12-17',              // Date picker
  no_reg_lama: '',                    // Optional
  no_reg_baru: '',                    // Optional
  tindakan: '',                       // Optional
  nama_istri: 'Ibu Sari',             // Required
  nik_istri: '3101011990050001',      // Required (16 digits)
  umur_istri: 40,                     // Required (converted to number)
  nama_suami: 'Bapak Joko',           // Optional
  nik_suami: '3101021990050002',      // Optional
  umur_suami: 42,                     // Optional (converted to number)
  alamat: 'Jalan Merdeka No 123',     // Required
  no_hp: '081234567890',              // Optional
  hpht: '2025-10-01',                 // Optional (Date picker)
  hpl: '2026-07-08',                  // Optional (Date picker)
  hasil_pemeriksaan: 'Kesehatan...',  // Required (Textarea)
  keterangan: 'Pasien dalam kondisi...' // Optional (Textarea)
}
```

### Frontend Service (layanan.service.js)
- `getAllANC(search)` - Get all ANC records
- `createANC(data)` - POST /api/anc
- `updateANC(id, data)` - PUT /api/anc/:id
- `deleteANC(id)` - DELETE /api/anc/:id
- `getANCById(id)` - GET /api/anc/:id

---

## 2. Backend Validation

### ANC Validator Schema (anc.validator.js)

**Required Fields:**
- `jenis_layanan` - Must be exactly 'ANC'
- `tanggal` - Any string (no strict date format required)
- `nama_istri` - Mother's name
- `nik_istri` - 16-digit NIK
- `umur_istri` - Number
- `alamat` - Address
- `hasil_pemeriksaan` - Examination results

**Optional Fields:**
- `no_hp` - Phone number
- `no_reg_lama` - Old registration number
- `no_reg_baru` - New registration number
- `nama_suami` - Spouse's name
- `nik_suami` - Spouse's NIK (16 digits)
- `umur_suami` - Spouse's age
- `hpht` - Last menstrual period date
- `hpl` - Expected delivery date
- `tindakan` - Actions/procedures
- `keterangan` - Additional notes

---

## 3. Backend Service Layer

### Database Tables Used

**pasien table:**
```sql
CREATE TABLE pasien (
  id_pasien CHAR(36) PRIMARY KEY,
  nama VARCHAR(100),
  nik CHAR(16),
  umur INT,
  alamat TEXT,
  no_hp VARCHAR(15)
)
```

**pemeriksaan table:**
```sql
CREATE TABLE pemeriksaan (
  id_pemeriksaan CHAR(36) PRIMARY KEY,
  id_pasien CHAR(36),
  jenis_layanan ENUM('ANC', ...),
  subjektif TEXT,        -- Constructed from hpht, hpl
  objektif TEXT,         -- Constructed from hasil_pemeriksaan
  analisa TEXT,          -- Constructed from keterangan
  tatalaksana TEXT,      -- Constructed from tindakan
  tanggal_pemeriksaan DATETIME
)
```

**layanan_anc table:**
```sql
CREATE TABLE layanan_anc (
  id_anc CHAR(36) PRIMARY KEY,
  id_pemeriksaan CHAR(36),
  no_reg_lama VARCHAR(50),
  no_reg_baru VARCHAR(50),
  nama_suami VARCHAR(100),
  nik_suami CHAR(16),
  umur_suami INT,
  hpht DATE,
  hpl DATE,
  hasil_pemeriksaan TEXT,
  tindakan TEXT,
  keterangan TEXT
)
```

### SOAP Field Construction
Service layer constructs SOAP fields from frontend data:

```javascript
// From frontend: hpht, hpl, hasil_pemeriksaan, tindakan, keterangan
const subjektif_final = `ANC Kunjungan${hpht ? `. HPHT: ${hpht}` : ''}${hpl ? `, HPL: ${hpl}` : ''}`;
const objektif_final = hasil_pemeriksaan ? `Hasil Pemeriksaan: ${hasil_pemeriksaan}` : '';
const analisa_final = keterangan || '';
const tatalaksana_final = tindakan ? `Tindakan: ${tindakan}` : '';
```

### Service Methods

**createRegistrasiANC(data, userId):**
1. Create/update pasien record (mother)
2. Create pemeriksaan record with SOAP fields
3. Create layanan_anc record
4. Return id_anc, id_pemeriksaan, id_pasien

**updateANCRegistrasi(id_pemeriksaan, data, userId):**
1. Verify pemeriksaan exists
2. Update pasien record
3. Update pemeriksaan with new SOAP fields
4. Update layanan_anc record
5. Return updated record

**deleteANCRegistrasi(id_pemeriksaan, userId):**
1. Delete layanan_anc record
2. Delete pemeriksaan record
3. Record audit log

**getANCById(id_pemeriksaan):**
1. Join pemeriksaan, pasien, layanan_anc tables
2. Return complete record with all data

---

## 4. API Endpoints

### Create ANC Registration
```
POST /api/anc
Headers: Authorization: Bearer {token}
Body: { ...frontendFormData }
Response: { success: true, message: "...", data: { id_anc, id_pemeriksaan, id_pasien } }
```

### Get All ANC Records
```
GET /api/pemeriksaan?jenis_layanan=ANC&search={query}
Returns: List of ANC records with patient info
```

### Get Single ANC Record
```
GET /api/anc/{id_pemeriksaan}
Returns: Complete ANC record with all details
```

### Update ANC Registration
```
PUT /api/anc/{id_pemeriksaan}
Headers: Authorization: Bearer {token}
Body: { ...frontendFormData }
Response: { success: true, data: { ...updatedRecord } }
```

### Delete ANC Registration
```
DELETE /api/anc/{id_pemeriksaan}
Headers: Authorization: Bearer {token}
Response: { success: true, message: "Deleted" }
```

---

## 5. Integration Checklist

### Frontend ✅
- [x] LayananANC.js form with correct field names
- [x] handleInputChange with type conversion for numeric fields
- [x] handleSubmit calls layananService.createANC/updateANC
- [x] layanan.service.js with ANC methods
- [x] jenis_layanan auto-filled and readonly
- [x] No SOAP fields (subjektif, objektif, analisa, tatalaksana) in form

### Backend ✅
- [x] anc.validator.js with correct schema matching frontend fields
- [x] anc.controller.js with 4 methods (create, read, update, delete)
- [x] anc.routes.js with 4 routes
- [x] anc.service.js with SOAP field construction
- [x] Database transactions for data consistency
- [x] Audit logging for all operations
- [x] server.js mounts routes at /api/anc and /v1/anc

### Data Flow ✅
- [x] Frontend form → layanan.service.js
- [x] layanan.service.js → API /api/anc
- [x] API → anc.controller.js
- [x] Controller → anc.validator.js (validation)
- [x] Validator → anc.service.js (if valid)
- [x] Service → Database (pasien, pemeriksaan, layanan_anc)
- [x] Response back to frontend

---

## 6. Testing Instructions

### Test Case 1: Create New ANC Registration
1. Open LayananANC component in frontend
2. Click "Tambah Registrasi"
3. Fill form with valid data:
   - Nama Istri: "Ibu Sari"
   - NIK Istri: "3101011990050001"
   - Umur Istri: 40
   - Alamat: "Jalan Merdeka No 123"
   - Hasil Pemeriksaan: "Kesehatan normal"
4. Click "Simpan"
5. Expected: "Data registrasi ANC berhasil disimpan!" notification

### Test Case 2: View ANC Records
1. Should see list of all ANC records with patient name, date, service type
2. Search function should filter records

### Test Case 3: Update ANC Registration
1. Click edit button on any record
2. Modify some fields
3. Click "Simpan"
4. Expected: "Data berhasil diupdate!" notification

### Test Case 4: Delete ANC Registration
1. Click delete button on any record
2. Confirm deletion
3. Expected: Record removed from list

---

## 7. Troubleshooting

### "Validasi input gagal" Error
- Check that all required fields are filled
- NIK must be exactly 16 digits
- Name fields must not be empty
- Address must not be empty
- Hasil Pemeriksaan must not be empty

### Data Not Saving
- Verify backend is running: http://localhost:5000/health
- Check browser console for error messages
- Verify MySQL database is connected
- Check backend logs for detailed error

### Records Not Displaying
- Verify GET /api/pemeriksaan?jenis_layanan=ANC returns data
- Check if records exist in database
- Clear browser cache and reload

---

## 8. Files Modified

- `src/validators/anc.validator.js` - Updated schema
- `src/services/anc.service.js` - Updated SOAP field construction
- No changes to frontend UI or field structure
- No changes to controller or routes

---

## 9. Database State

### Current Users (for testing)
- Username: `bidan_siti`, Email: `siti.nurhaliza@bidanpintar.com`
- Username: `bidan_dewi`, Email: `dewi.sartika@bidanpintar.com`
- Username: `admin`, Email: `admin@bidanpintar.com`

### Sample Patient Data in Database
- Will be created dynamically when ANC records are registered

---

## Summary

✅ **Complete integration rebuild finished**
- Frontend form sends exactly matching field names
- Backend validator accepts those exact fields
- Service layer constructs SOAP format for pemeriksaan table
- All required and optional fields properly handled
- No breaking changes to frontend UI or existing functionality
