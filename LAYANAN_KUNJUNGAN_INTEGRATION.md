# Integrasi Layanan Kunjungan Pasien - Frontend & Backend

## 📋 Overview
Integrasi lengkap CRUD untuk Layanan Kunjungan Pasien telah berhasil diimplementasikan dengan penamaan field yang konsisten antara frontend dan backend.

## 🗄️ Database Schema

### Tabel: `layanan_kunjungan_pasien`
```sql
CREATE TABLE layanan_kunjungan_pasien (
    id_kunjungan CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    no_reg VARCHAR(50),
    jenis_kunjungan ENUM('Bayi/Anak', 'Hamil/Nifas', 'KB', 'Lansia') NOT NULL,
    nama_pasien VARCHAR(100) NOT NULL,
    nik_pasien CHAR(16),
    umur_pasien VARCHAR(20),
    bb_pasien DECIMAL(5,2),
    td_pasien VARCHAR(20),
    nama_wali VARCHAR(100),
    nik_wali CHAR(16),
    umur_wali INT,
    keluhan TEXT,
    diagnosa TEXT,
    terapi_obat TEXT,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_kunjungan_pemeriksaan FOREIGN KEY (id_pemeriksaan) 
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE
);
```

### Perubahan Database
1. ✅ Update enum `jenis_kunjungan` dari `('Bayi/Anak', 'Umum', 'Lain-lain')` menjadi `('Bayi/Anak', 'Hamil/Nifas', 'KB', 'Lansia')`
2. ✅ Tambah field `tanggal DATE NOT NULL`
3. ✅ Update sample data dengan format baru

## 🔧 Backend Implementation

### Service Layer (`kunjunganPasien.service.js`)

#### Functions:
1. **`getAllKunjunganPasien(search)`**
   - Mengambil semua data kunjungan pasien dengan optional search
   - Return: Array of kunjungan records

2. **`getKunjunganPasienById(id)`**
   - Mengambil detail kunjungan pasien by ID
   - Return: Single kunjungan record

3. **`createRegistrasiKunjunganPasien(data, userId)`**
   - Membuat registrasi kunjungan pasien baru
   - Auto-create/update pasien record
   - Auto-create pemeriksaan record dengan SOAP format
   - Transaction-safe with rollback
   - Return: Created record with IDs

4. **`updateKunjunganPasien(id, data, userId)`**
   - Update data kunjungan pasien existing
   - Update pemeriksaan record terkait
   - Transaction-safe with rollback
   - Return: Success message

5. **`deleteKunjunganPasien(id, userId)`**
   - Delete kunjungan pasien dan pemeriksaan terkait
   - Transaction-safe with rollback
   - Return: Success message

### Controller Layer (`kunjunganPasien.controller.js`)

#### Endpoints:
- `GET /api/kunjungan-pasien` - Get all with optional search
- `GET /api/kunjungan-pasien/:id` - Get by ID
- `POST /api/kunjungan-pasien` - Create new
- `PUT /api/kunjungan-pasien/:id` - Update existing
- `DELETE /api/kunjungan-pasien/:id` - Delete

### Validator (`kunjunganPasien.validator.js`)

#### Validation Rules:
```javascript
{
  jenis_layanan: 'Kunjungan Pasien' (optional),
  tanggal: ISO Date (YYYY-MM-DD) - REQUIRED,
  no_reg: String (optional),
  jenis_kunjungan: ENUM['Bayi/Anak', 'Hamil/Nifas', 'KB', 'Lansia'] - REQUIRED,
  
  // Data Pasien
  nama_pasien: String - REQUIRED,
  nik_pasien: String (optional),
  umur_pasien: Number/String - REQUIRED,
  bb_pasien: Number/String (optional),
  td_pasien: String (optional),
  
  // Data Wali
  nama_wali: String (optional),
  nik_wali: String (optional),
  umur_wali: Number/String (optional),
  
  // Informasi Klinis
  keluhan: String - REQUIRED,
  diagnosa: String - REQUIRED,
  terapi_obat: String (optional),
  keterangan: String (optional)
}
```

### Routes (`kunjunganPasien.routes.js`)
```javascript
router.get('/', getAllKunjunganPasien);              // List with search
router.get('/:id', getKunjunganPasienById);         // Detail by ID
router.post('/', validate(), createKunjunganPasien); // Create
router.put('/:id', validate(), updateKunjunganPasien); // Update
router.delete('/:id', deleteKunjunganPasien);       // Delete
```

## 🎨 Frontend Implementation

### Component (`LayananKunjunganPasien.js`)

#### State Management:
```javascript
const [formData, setFormData] = useState({
  jenis_layanan: 'Kunjungan Pasien',  // Auto-configured, readonly
  tanggal: '',
  no_reg: '',
  jenis_kunjungan: '',                // Bayi/Anak, Hamil/Nifas, KB, Lansia
  nama_pasien: '',
  nik_pasien: '',
  umur_pasien: '',
  bb_pasien: '',
  td_pasien: '',
  nama_wali: '',
  nik_wali: '',
  umur_wali: '',
  keluhan: '',
  diagnosa: '',
  terapi_obat: '',
  keterangan: ''
});
```

#### Key Features:
1. ✅ Auto-configured `jenis_layanan` = "Kunjungan Pasien" (readonly)
2. ✅ Dropdown `jenis_kunjungan` dengan 4 opsi sesuai database enum
3. ✅ Form sections: Informasi Layanan, Data Pasien, Data Wali, Informasi Tambahan
4. ✅ CRUD operations: Create, Read, Update, Delete
5. ✅ Search functionality
6. ✅ Notification system untuk feedback user

### Service Layer (`layanan.service.js`)

#### API Functions:
```javascript
// GET all with search
getAllKunjunganPasien(search)

// GET by ID
getKunjunganPasienById(id)

// POST create
createKunjunganPasien(data)

// PUT update
updateKunjunganPasien(id, data)

// DELETE
deleteKunjunganPasien(id)
```

## 📊 Data Flow

### Create Flow:
```
Frontend Form Submit
    ↓
layanan.service.createKunjunganPasien(data)
    ↓
POST /api/kunjungan-pasien
    ↓
kunjunganPasien.controller.createRegistrasiKunjunganPasien()
    ↓
kunjunganPasien.service.createRegistrasiKunjunganPasien()
    ↓
[Database Transaction]
    1. Find/Create Pasien record
    2. Create Pemeriksaan record (SOAP format)
    3. Create Layanan_kunjungan_pasien record
    4. Record Audit Log
    ↓
Return success + IDs
    ↓
Frontend: Show notification + Refresh list
```

### Read Flow:
```
Frontend Component Mount / Search
    ↓
layanan.service.getAllKunjunganPasien(search)
    ↓
GET /api/kunjungan-pasien?search=xxx
    ↓
kunjunganPasien.controller.getAllKunjunganPasien()
    ↓
kunjunganPasien.service.getAllKunjunganPasien(search)
    ↓
Query Database with JOIN
    ↓
Return list of records
    ↓
Frontend: Display in riwayat list
```

### Update Flow:
```
Frontend Edit Button → Load data by ID
    ↓
layanan.service.getKunjunganPasienById(id)
    ↓
Populate form with existing data
    ↓
User modifies data → Submit
    ↓
layanan.service.updateKunjunganPasien(id, data)
    ↓
PUT /api/kunjungan-pasien/:id
    ↓
[Database Transaction]
    1. Update Pemeriksaan record
    2. Update Layanan_kunjungan_pasien record
    3. Record Audit Log
    ↓
Return success message
    ↓
Frontend: Show notification + Refresh list
```

### Delete Flow:
```
Frontend Delete Button → Confirm dialog
    ↓
layanan.service.deleteKunjunganPasien(id)
    ↓
DELETE /api/kunjungan-pasien/:id
    ↓
[Database Transaction]
    1. Delete Layanan_kunjungan_pasien record
    2. Delete Pemeriksaan record (cascade)
    3. Record Audit Log
    ↓
Return success message
    ↓
Frontend: Show notification + Refresh list
```

## 🔒 Security

1. ✅ All endpoints protected with `verifyToken` middleware
2. ✅ Input validation using Joi schema
3. ✅ SQL injection prevention with parameterized queries
4. ✅ Transaction rollback on errors
5. ✅ Audit logging for all operations

## 📝 Field Mapping

| Frontend Field    | Backend Field     | Database Column   | Type          | Required |
|-------------------|-------------------|-------------------|---------------|----------|
| jenis_layanan     | jenis_layanan     | -                 | String        | Auto     |
| tanggal           | tanggal           | tanggal           | Date          | Yes      |
| no_reg            | no_reg            | no_reg            | String        | No       |
| jenis_kunjungan   | jenis_kunjungan   | jenis_kunjungan   | ENUM          | Yes      |
| nama_pasien       | nama_pasien       | nama_pasien       | String        | Yes      |
| nik_pasien        | nik_pasien        | nik_pasien        | String        | No       |
| umur_pasien       | umur_pasien       | umur_pasien       | Varchar/Int   | Yes      |
| bb_pasien         | bb_pasien         | bb_pasien         | Decimal       | No       |
| td_pasien         | td_pasien         | td_pasien         | String        | No       |
| nama_wali         | nama_wali         | nama_wali         | String        | No       |
| nik_wali          | nik_wali          | nik_wali          | String        | No       |
| umur_wali         | umur_wali         | umur_wali         | Int           | No       |
| keluhan           | keluhan           | keluhan           | Text          | Yes      |
| diagnosa          | diagnosa          | diagnosa          | Text          | Yes      |
| terapi_obat       | terapi_obat       | terapi_obat       | Text          | No       |
| keterangan        | keterangan        | keterangan        | Text          | No       |

## ✅ Testing Checklist

### Backend Testing:
- [ ] Test GET /api/kunjungan-pasien (with/without search)
- [ ] Test GET /api/kunjungan-pasien/:id
- [ ] Test POST /api/kunjungan-pasien (create)
- [ ] Test PUT /api/kunjungan-pasien/:id (update)
- [ ] Test DELETE /api/kunjungan-pasien/:id
- [ ] Test validation errors
- [ ] Test authentication (with/without token)
- [ ] Test database transaction rollback

### Frontend Testing:
- [ ] Test form display
- [ ] Test jenis_layanan (readonly)
- [ ] Test jenis_kunjungan dropdown (4 options)
- [ ] Test form submission (create)
- [ ] Test edit existing record
- [ ] Test delete with confirmation
- [ ] Test search functionality
- [ ] Test notification system
- [ ] Test form reset/cancel

## 🚀 Deployment Steps

### 1. Database Migration:
```bash
cd "TUBES PROTEIN BE/aplikasi-bidan-pintar"
mysql -u root -p aplikasi_bidan < database/init.sql
```

### 2. Backend:
```bash
cd "TUBES PROTEIN BE/aplikasi-bidan-pintar"
npm install
npm start
```

### 3. Frontend:
```bash
cd "TUBES PROTEIN FE"
npm install
npm start
```

## 📚 API Documentation

### GET /api/kunjungan-pasien
**Description:** Get all patient visits with optional search

**Query Parameters:**
- `search` (optional): Search by patient name

**Response:**
```json
{
  "success": true,
  "message": "Data kunjungan pasien berhasil diambil",
  "data": [
    {
      "id_pemeriksaan": "uuid",
      "tanggal": "2025-12-18",
      "nama_pasien": "Nama Pasien",
      "jenis_layanan": "Kunjungan Pasien",
      "tanggal_pemeriksaan": "2025-12-18 10:00:00"
    }
  ]
}
```

### GET /api/kunjungan-pasien/:id
**Description:** Get patient visit details by ID

**Response:**
```json
{
  "success": true,
  "message": "Data kunjungan pasien berhasil diambil",
  "data": {
    "id_kunjungan": "uuid",
    "tanggal": "2025-12-18",
    "no_reg": "KP-2025-001",
    "jenis_kunjungan": "Bayi/Anak",
    "nama_pasien": "Nama Pasien",
    "nik_pasien": "1234567890123456",
    "umur_pasien": 6,
    "bb_pasien": 7.5,
    "td_pasien": null,
    "nama_wali": "Nama Wali",
    "nik_wali": "6543210987654321",
    "umur_wali": 30,
    "keluhan": "Batuk dan pilek",
    "diagnosa": "ISPA ringan",
    "terapi_obat": "Paracetamol sirup",
    "keterangan": "Observasi di rumah"
  }
}
```

### POST /api/kunjungan-pasien
**Description:** Create new patient visit

**Request Body:**
```json
{
  "jenis_layanan": "Kunjungan Pasien",
  "tanggal": "2025-12-18",
  "no_reg": "KP-2025-004",
  "jenis_kunjungan": "Bayi/Anak",
  "nama_pasien": "Nama Pasien",
  "nik_pasien": "1234567890123456",
  "umur_pasien": 6,
  "bb_pasien": 7.5,
  "td_pasien": "",
  "nama_wali": "Nama Wali",
  "nik_wali": "6543210987654321",
  "umur_wali": 30,
  "keluhan": "Batuk dan pilek",
  "diagnosa": "ISPA ringan",
  "terapi_obat": "Paracetamol sirup",
  "keterangan": "Observasi di rumah"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi Kunjungan Pasien berhasil disimpan",
  "data": {
    "id_kunjungan": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid"
  }
}
```

### PUT /api/kunjungan-pasien/:id
**Description:** Update existing patient visit

**Request Body:** Same as POST

**Response:**
```json
{
  "success": true,
  "message": "Data kunjungan berhasil diupdate"
}
```

### DELETE /api/kunjungan-pasien/:id
**Description:** Delete patient visit

**Response:**
```json
{
  "success": true,
  "message": "Data kunjungan berhasil dihapus"
}
```

## 🐛 Known Issues & Solutions

### Issue 1: NIK Validation
**Problem:** NIK tidak selalu 16 digit untuk bayi
**Solution:** NIK dibuat optional di validator

### Issue 2: Umur Format
**Problem:** Umur bisa berupa angka atau string ("6 bln")
**Solution:** Field `umur_pasien` menerima varchar di database

### Issue 3: Transaction Safety
**Problem:** Partial data save jika terjadi error
**Solution:** Semua operations wrapped dalam database transaction dengan rollback

## 📞 Support

Jika ada pertanyaan atau issues, silakan dokumentasikan di:
- File terkait: `LAYANAN_KUNJUNGAN_INTEGRATION.md`
- Backend: `TUBES PROTEIN BE/aplikasi-bidan-pintar/src/`
- Frontend: `TUBES PROTEIN FE/src/components/layanan/LayananKunjunganPasien.js`

---
**Last Updated:** December 18, 2025
**Status:** ✅ Fully Integrated & Ready for Testing
