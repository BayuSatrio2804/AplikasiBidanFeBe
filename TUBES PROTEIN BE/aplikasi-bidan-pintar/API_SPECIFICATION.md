# API Specification - Aplikasi Bidan Pintar

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api` or `http://localhost:5000/v1`  
**Last Updated:** December 14, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Codes](#error-codes)
5. [API Endpoints](#api-endpoints)
   - [Authentication](#1-authentication-apiauth)
   - [Patient Management](#2-patient-management-apipasien)
   - [Schedule Management](#3-schedule-management-apijadwal)
   - [Medical Examination (SOAP)](#4-medical-examination-apipemeriksaan)
   - [Dashboard](#5-dashboard-apidashboard)
   - [Reports](#6-reports-apilaporan)
   - [KB (Family Planning)](#7-kb-family-planning-apikb)
   - [ANC (Antenatal Care)](#8-anc-antenatal-care-apianc)
   - [Immunization](#9-immunization-apiimunisasi)
   - [Delivery/Birth](#10-deliverybirth-apipersalinan)
   - [Patient Visit](#11-patient-visit-apikunjungan-pasien)

---

## Overview

This API provides backend services for **Aplikasi Bidan Pintar** (Smart Midwife Application), a healthcare management system for midwifery clinics. The system supports patient management, appointment scheduling, medical examinations, and various specialized services including ANC, KB, immunization, and delivery care.

### Key Features
- JWT-based authentication with OTP verification
- Patient record management
- Appointment scheduling
- Medical examination (SOAP format)
- Specialized service registration (ANC, KB, Immunization, Delivery)
- Dashboard analytics and reporting

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Token Acquisition Flow
1. User logs in with credentials → OTP sent to email
2. User verifies OTP → JWT token issued
3. Use JWT token for all subsequent requests

### Token Expiry
- Default: 1 day (configurable via `TOKEN_EXPIRY` env variable)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

---

## Error Codes

| HTTP Code | Description |
|-----------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (Invalid/Missing Token) |
| 403 | Forbidden (Token Expired/Invalid) |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## API Endpoints

---

## 1. Authentication (`/api/auth`)

### 1.1 Register User

**POST** `/api/auth/register`

**Description:** Register a new user account.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "nama_lengkap": "string (required)",
  "username": "string (required, min: 3 chars)",
  "email": "string (required, valid email format)",
  "password": "string (required, min: 6 chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login menggunakan akun Anda.",
  "data": {
    "id_user": "uuid",
    "nama_lengkap": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username sudah digunakan | Email sudah terdaftar"
}
```

---

### 1.2 Login

**POST** `/api/auth/login`

**Description:** Authenticate user and trigger OTP verification.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "usernameOrEmail": "string (required) - Username or Email",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password benar. Kode OTP telah dikirim ke email Anda.",
  "data": {
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- **404:** `"Pengguna tidak ditemukan"`
- **401:** `"Password salah"`

---

### 1.3 Verify OTP

**POST** `/api/auth/verify-otp`

**Description:** Verify OTP code and receive JWT token.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "usernameOrEmail": "string (required)",
  "otp_code": "string (required, exactly 6 digits, numeric only)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verifikasi berhasil. Anda berhasil login.",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id_user": "uuid",
      "nama_lengkap": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**
- **400:** `"Kode OTP tidak ditemukan. Silakan login ulang."`
- **400:** `"Kode OTP sudah kedaluwarsa. Silakan kirim ulang."`
- **400:** `"Kode OTP salah."`

---

### 1.4 Resend OTP

**POST** `/api/auth/resend-otp`

**Description:** Request a new OTP code.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "usernameOrEmail": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Kode OTP baru telah dikirim ke email Anda."
}
```

---

### 1.5 Request Password Reset

**POST** `/api/auth/forgot-password/request`

**Description:** Request password reset OTP.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "string (required, valid email)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Kode verifikasi untuk reset password telah dikirimkan ke email Anda"
}
```

---

### 1.6 Verify Reset Code

**POST** `/api/auth/forgot-password/verify-code`

**Description:** Verify reset OTP and get reset token.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "otp_code": "string (required, 6 digits)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Kode verifikasi berhasil",
  "data": {
    "reset_token": "jwt_reset_token",
    "id_user": "uuid"
  }
}
```

---

### 1.7 Reset Password

**POST** `/api/auth/forgot-password/reset`

**Description:** Set new password using reset token.

**Authentication:** None (Public)

**Headers:**
```
X-Reset-Token: <reset_token>
```

**Request Body:**
```json
{
  "id_user": "string (required, UUID v4)",
  "new_password": "string (required, min: 6 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diatur ulang. Silakan login dengan password baru Anda."
}
```

---

### 1.8 Get User Profile

**GET** `/api/auth/me`

**Description:** Get current authenticated user's profile.

**Authentication:** Required (Bearer Token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data profil berhasil diambil",
  "data": {
    "id_user": "uuid",
    "nama_lengkap": "string",
    "username": "string",
    "email": "string"
  }
}
```

---

### 1.9 Update User Profile

**PUT** `/api/auth/me`

**Description:** Update authenticated user's profile.

**Authentication:** Required (Bearer Token)

**Request Body (all fields optional):**
```json
{
  "nama_lengkap": "string",
  "username": "string (min: 3 chars)",
  "email": "string (valid email)",
  "password": "string (min: 6 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": {
    "id_user": "uuid",
    "nama_lengkap": "string",
    "username": "string",
    "email": "string"
  }
}
```

---

## 2. Patient Management (`/api/pasien`)

**Authentication:** All endpoints require Bearer Token

---

### 2.1 Get All Patients

**GET** `/api/pasien`

**Description:** Get list of all patients with optional search.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by name or NIK |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data pasien",
  "data": [
    {
      "id_pasien": "uuid",
      "nama": "string",
      "nik": "string (16 digits)",
      "umur": "number",
      "alamat": "string",
      "no_hp": "string"
    }
  ]
}
```

---

### 2.2 Get Patient by ID

**GET** `/api/pasien/:id`

**Description:** Get single patient by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Patient ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data pasien",
  "data": {
    "id_pasien": "uuid",
    "nama": "string",
    "nik": "string",
    "umur": "number",
    "alamat": "string",
    "no_hp": "string"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Pasien tidak ditemukan"
}
```

---

### 2.3 Create Patient

**POST** `/api/pasien`

**Description:** Create a new patient record.

**Request Body:**
```json
{
  "nama": "string (required)",
  "NIK": "string (required, exactly 16 digits, numeric only)",
  "umur": "number (required, integer, min: 1)",
  "alamat": "string (required)",
  "no_hp": "string (required, 8-15 chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Pasien berhasil ditambahkan",
  "data": {
    "id_pasien": "uuid",
    "nama": "string",
    "NIK": "string",
    "umur": "number",
    "alamat": "string",
    "no_hp": "string"
  }
}
```

---

### 2.4 Update Patient

**PUT** `/api/pasien/:id`

**Description:** Update patient information.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Patient ID |

**Request Body:**
```json
{
  "nama": "string (required)",
  "NIK": "string (required, 16 digits)",
  "umur": "number (required)",
  "alamat": "string (required)",
  "no_hp": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data pasien berhasil diperbarui",
  "data": { ... }
}
```

---

### 2.5 Delete Patient

**DELETE** `/api/pasien/:id`

**Description:** Delete a patient record.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Patient ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pasien berhasil dihapus"
}
```

---

### 2.6 Get Patient Medical History

**GET** `/api/pasien/:id/riwayat`

**Description:** Get patient's medical examination history.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Patient ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Riwayat pemeriksaan untuk <nama_pasien>",
  "data": [
    {
      "id_pemeriksaan": "uuid",
      "jenis_layanan": "string",
      "subjektif": "string",
      "objektif": "string",
      "analisa": "string",
      "tatalaksana": "string",
      "tanggal_pemeriksaan": "datetime"
    }
  ]
}
```

---

## 3. Schedule Management (`/api/jadwal`)

**Authentication:** All endpoints require Bearer Token

---

### 3.1 Get All Schedules

**GET** `/api/jadwal`

**Description:** Get list of schedules with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bulan | number | No | Month (1-12) |
| tahun | number | No | Year |
| layanan | string | No | Service type filter |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data jadwal",
  "data": [
    {
      "id_jadwal": "uuid",
      "tanggal": "YYYY-MM-DD",
      "jam_mulai": "HH:MM:SS",
      "jam_selesai": "HH:MM:SS",
      "jenis_layanan": "string",
      "nama_pasien": "string",
      "nama_petugas": "string"
    }
  ]
}
```

---

### 3.2 Get Schedule Detail

**GET** `/api/jadwal/:id`

**Description:** Get single schedule by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Schedule ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil detail jadwal",
  "data": {
    "id_jadwal": "uuid",
    "tanggal": "YYYY-MM-DD",
    "jam_mulai": "HH:MM:SS",
    "jam_selesai": "HH:MM:SS",
    "jenis_layanan": "string",
    "nama_pasien": "string",
    "nama_petugas": "string"
  }
}
```

---

### 3.3 Create Schedule

**POST** `/api/jadwal`

**Description:** Create a new appointment schedule.

**Request Body:**
```json
{
  "id_pasien": "string (required, UUID)",
  "id_petugas": "string (required, UUID)",
  "jenis_layanan": "string (required, enum: ANC|KB|Imunisasi|Persalinan|Kunjungan Pasien)",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "jam_mulai": "string (required, format: HH:MM:SS)",
  "jam_selesai": "string (optional, format: HH:MM:SS)"
}
```

**Valid Service Types (jenis_layanan):**
- `ANC`
- `KB`
- `Imunisasi`
- `Persalinan`
- `Kunjungan Pasien`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Jadwal berhasil dibuat",
  "data": {
    "id_jadwal": "uuid",
    ...
  }
}
```

---

### 3.4 Update Schedule

**PUT** `/api/jadwal/:id`

**Description:** Update schedule information.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Schedule ID |

**Request Body:** Same as Create Schedule

---

### 3.5 Delete Schedule

**DELETE** `/api/jadwal/:id`

**Description:** Delete a schedule.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Schedule ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Jadwal berhasil dihapus"
}
```

---

## 4. Medical Examination (`/api/pemeriksaan`)

**Authentication:** All endpoints require Bearer Token

---

### 4.1 Get All Examinations

**GET** `/api/pemeriksaan`

**Description:** Get list of all medical examinations.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data pemeriksaan",
  "data": [
    {
      "id_pemeriksaan": "uuid",
      "id_pasien": "uuid",
      "jenis_layanan": "string",
      "subjektif": "string",
      "objektif": "string",
      "analisa": "string",
      "tatalaksana": "string",
      "tanggal_pemeriksaan": "datetime"
    }
  ]
}
```

---

### 4.2 Get Examination Detail

**GET** `/api/pemeriksaan/:id`

**Description:** Get single examination by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Examination ID |

---

### 4.3 Create Examination

**POST** `/api/pemeriksaan`

**Description:** Create new medical examination record (SOAP format).

**Request Body:**
```json
{
  "id_pasien": "string (required, UUID)",
  "jenis_layanan": "string (required, enum: ANC|KB|Imunisasi|Persalinan|Kunjungan Pasien)",
  "subjektif": "string (required) - Patient complaints/symptoms (S)",
  "objektif": "string (required) - Physical examination findings (O)",
  "analisa": "string (required) - Diagnosis/assessment (A)",
  "tatalaksana": "string (required) - Treatment plan (P)",
  "tanggal_pemeriksaan": "string (optional, ISO date format)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Pemeriksaan berhasil disimpan",
  "data": { ... }
}
```

---

### 4.4 Update Examination

**PUT** `/api/pemeriksaan/:id`

**Description:** Update examination record.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Examination ID |

**Request Body:** Same as Create Examination

---

## 5. Dashboard (`/api/dashboard`)

**Authentication:** All endpoints require Bearer Token

---

### 5.1 Get Service Summary

**GET** `/api/dashboard/rekap-layanan`

**Description:** Get summary statistics of all services.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tahun | number | No | Filter by year |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data rekap layanan berhasil diambil",
  "data": {
    "total": 150,
    "data": [
      {
        "layanan": "ANC",
        "jumlah_pasien": 45,
        "persentase": 30.00
      },
      {
        "layanan": "KB",
        "jumlah_pasien": 38,
        "persentase": 25.33
      }
    ]
  }
}
```

---

## 6. Reports (`/api/laporan`)

**Authentication:** All endpoints require Bearer Token

---

### 6.1 Generate Monthly Report

**GET** `/api/laporan`

**Description:** Generate and download monthly report in Excel format.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | Yes | Must be "excel" |
| bulan | number | Yes | Month (1-12) |
| tahun | number | Yes | Year (min: 2020) |

**Success Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="Laporan_Detil_MM_YYYY.xlsx"`

**Error Response (400):**
```json
{
  "success": false,
  "message": "Format harus \"excel\""
}
```

---

## 7. KB (Family Planning) (`/api/kb`)

**Authentication:** All endpoints require Bearer Token

---

### 7.1 Create KB Registration

**POST** `/api/kb`

**Description:** Register a new family planning service visit.

**Request Body:**
```json
{
  // Service Information
  "jenis_layanan": "string (required, must be 'KB')",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "metode": "string (required, enum: KDM|PIL|SUNTIK|IMP|IUD|LAINNYA)",
  "no_reg_lama": "string (optional)",
  "no_reg_baru": "string (optional)",
  "kunjungan_ulang": "string (optional, format: YYYY-MM-DD)",
  
  // Mother Data
  "nama_istri": "string (required)",
  "nik_istri": "string (required, 16 digits)",
  "umur_istri": "number (required, integer, min: 1)",
  "td_ibu": "string (required) - Blood pressure",
  "bb_ibu": "number (required, min: 1) - Body weight",
  "alamat": "string (required)",
  "no_hp": "string (required, 8-15 chars)",
  
  // Father Data
  "nama_suami": "string (required)",
  "nik_suami": "string (optional, 16 digits)",
  "umur_suami": "number (optional)",
  "td_ayah": "string (optional)",
  "bb_ayah": "number (optional)",
  
  // Additional
  "catatan": "string (optional)",
  
  // SOAP Fields (optional)
  "subjektif": "string (optional)",
  "objektif": "string (optional)",
  "analisa": "string (optional)",
  "tatalaksana": "string (optional)"
}
```

**KB Methods (metode):**
| Code | Description |
|------|-------------|
| KDM | Kalender/Metode Alamiah |
| PIL | Pil KB |
| SUNTIK | Suntik KB |
| IMP | Implan |
| IUD | IUD (Spiral) |
| LAINNYA | Metode Lainnya |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi KB berhasil disimpan",
  "data": {
    "id_kb": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid",
    ...
  }
}
```

---

## 8. ANC (Antenatal Care) (`/api/anc`)

**Authentication:** All endpoints require Bearer Token

---

### 8.1 Create ANC Registration

**POST** `/api/anc`

**Description:** Register a new antenatal care visit.

**Request Body:**
```json
{
  // Service Information
  "jenis_layanan": "string (required, must be 'ANC')",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "tindakan": "string (optional) - Action taken",
  "no_reg_lama": "string (optional)",
  "no_reg_baru": "string (optional)",
  
  // Mother Data
  "nama_istri": "string (required)",
  "nik_istri": "string (required, 16 digits)",
  "umur_istri": "number (required, integer, min: 1)",
  "alamat": "string (required)",
  "no_hp": "string (required, 8-15 chars)",
  
  // Father Data
  "nama_suami": "string (required)",
  "nik_suami": "string (optional, 16 digits)",
  "umur_suami": "number (optional)",
  
  // Pregnancy Information
  "hpht": "string (optional, format: YYYY-MM-DD) - Last menstrual period",
  "hpl": "string (optional, format: YYYY-MM-DD) - Estimated due date",
  "hasil_pemeriksaan": "string (required) - Examination results",
  "keterangan": "string (optional)",
  
  // SOAP Fields (optional)
  "subjektif": "string (optional)",
  "objektif": "string (optional)",
  "analisa": "string (optional)",
  "tatalaksana": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi ANC berhasil disimpan",
  "data": {
    "id_anc": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid",
    ...
  }
}
```

---

## 9. Immunization (`/api/imunisasi`)

**Authentication:** All endpoints require Bearer Token

---

### 9.1 Create Immunization Registration

**POST** `/api/imunisasi`

**Description:** Register a new immunization visit.

**Request Body:**
```json
{
  // Service Information
  "jenis_layanan": "string (required, must be 'Imunisasi')",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "no_reg": "string (optional)",
  "jenis_imunisasi": "string (required) - Vaccine type",
  
  // Mother Data (Guardian)
  "nama_istri": "string (required)",
  "nik_istri": "string (required, 16 digits)",
  "umur_istri": "number (required, integer, min: 1)",
  "alamat": "string (required)",
  
  // Father Data
  "nama_suami": "string (required)",
  "nik_suami": "string (optional, 16 digits)",
  "umur_suami": "number (optional)",
  
  // Baby/Toddler Data
  "nama_bayi_balita": "string (required)",
  "tanggal_lahir_bayi": "string (required, format: YYYY-MM-DD)",
  "tb_bayi": "number (required, min: 1) - Height in cm",
  "bb_bayi": "number (required, min: 1) - Weight in kg",
  
  // Additional Information
  "jadwal_selanjutnya": "string (required, format: YYYY-MM-DD)",
  "no_hp": "string (required, 8-15 chars)",
  "pengobatan": "string (optional)",
  
  // SOAP Fields (optional)
  "subjektif": "string (optional)",
  "objektif": "string (optional)",
  "analisa": "string (optional)",
  "tatalaksana": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi Imunisasi berhasil disimpan",
  "data": {
    "id_imunisasi": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid",
    ...
  }
}
```

---

## 10. Delivery/Birth (`/api/persalinan`)

**Authentication:** All endpoints require Bearer Token

---

### 10.1 Create Delivery Registration

**POST** `/api/persalinan`

**Description:** Register a new delivery/birth record.

**Request Body:**
```json
{
  // Service Information
  "jenis_layanan": "string (required, must be 'Persalinan')",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "penolong": "string (required) - Birth attendant name",
  "no_reg_lama": "string (optional)",
  "no_reg_baru": "string (optional)",
  
  // Mother Data
  "nama_istri": "string (required)",
  "nik_istri": "string (required, 16 digits)",
  "umur_istri": "number (required, integer, min: 1)",
  "alamat": "string (required)",
  "no_hp": "string (required, 8-15 chars)",
  "td_ibu": "string (required) - Blood pressure",
  "bb_ibu": "number (required, min: 1) - Body weight",
  
  // Father Data
  "nama_suami": "string (required)",
  "nik_suami": "string (optional, 16 digits)",
  "umur_suami": "number (optional)",
  
  // Delivery Information
  "tanggal_lahir": "string (required, format: YYYY-MM-DD)",
  "jenis_kelamin": "string (required, enum: L|P|Tidak Diketahui)",
  "anak_ke": "number (required, integer, min: 1)",
  "jenis_partus": "string (required) - Delivery type",
  "imd_dilakukan": "boolean (required) - Early breastfeeding initiation",
  
  // Baby Clinical Data
  "as_bayi": "string (optional) - APGAR score",
  "bb_bayi": "number (required, min: 1) - Baby weight in grams",
  "pb_bayi": "number (required, min: 1) - Baby length in cm",
  "lika_bayi": "number (required, min: 1) - Baby head circumference",
  
  // Mother Clinical Data
  "lila_ibu": "number (required, min: 1) - Upper arm circumference",
  "lida_ibu": "number (required, min: 1) - Chest circumference",
  
  // SOAP Fields (optional)
  "subjektif": "string (optional)",
  "objektif": "string (optional)",
  "analisa": "string (optional)",
  "tatalaksana": "string (optional)"
}
```

**Gender Values (jenis_kelamin):**
| Value | Description |
|-------|-------------|
| L | Laki-laki (Male) |
| P | Perempuan (Female) |
| Tidak Diketahui | Unknown |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi Persalinan berhasil disimpan",
  "data": {
    "id_persalinan": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid",
    ...
  }
}
```

---

## 11. Patient Visit (`/api/kunjungan-pasien`)

**Authentication:** All endpoints require Bearer Token

---

### 11.1 Create Patient Visit Registration

**POST** `/api/kunjungan-pasien`

**Description:** Register a general patient visit (for baby/child/adult general checkups).

**Request Body:**
```json
{
  // Service Information
  "jenis_layanan": "string (required, must be 'Kunjungan Pasien')",
  "tanggal": "string (required, format: YYYY-MM-DD)",
  "no_reg": "string (optional)",
  "jenis_kunjungan": "string (required, enum: Bayi/Anak|Umum|Lain-lain)",
  
  // Patient Data
  "nama_pasien": "string (required) - Actual patient name",
  "nik_pasien": "string (required, 16 digits)",
  "umur_pasien": "string (required) - Age (e.g., '6 bln' or '2 thn')",
  "bb_pasien": "number (optional, min: 0) - Patient weight",
  "td_pasien": "string (optional) - Blood pressure",
  
  // Guardian Data
  "nama_wali": "string (required) - Parent/guardian name",
  "nik_wali": "string (optional, 16 digits)",
  "umur_wali": "number (optional)",
  
  // Clinical Information
  "keluhan": "string (required) - Chief complaint",
  "diagnosa": "string (required) - Diagnosis",
  "terapi_obat": "string (optional) - Medication therapy",
  "keterangan": "string (optional) - Notes",
  
  // SOAP Fields (optional, auto-generated from clinical info if empty)
  "subjektif": "string (optional)",
  "objektif": "string (optional)",
  "analisa": "string (optional)",
  "tatalaksana": "string (optional)"
}
```

**Visit Types (jenis_kunjungan):**
| Value | Description |
|-------|-------------|
| Bayi/Anak | Baby/Child visit |
| Umum | General visit |
| Lain-lain | Other |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi Kunjungan Pasien berhasil disimpan",
  "data": {
    "id_kunjungan": "uuid",
    "id_pemeriksaan": "uuid",
    "id_pasien": "uuid",
    ...
  }
}
```

---

## Health Check

### Check Server Status

**GET** `/health`

**Description:** Check if the server is running.

**Authentication:** None (Public)

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

---

## Appendix

### A. Valid Service Types (VALID_LAYANAN)

```javascript
[
  'ANC',           // Antenatal Care
  'KB',            // Family Planning (Keluarga Berencana)
  'Imunisasi',     // Immunization
  'Persalinan',    // Delivery/Birth
  'Kunjungan Pasien' // General Patient Visit
]
```

### B. NIK Validation Rules
- Exactly 16 characters
- Numeric only (0-9)

### C. Phone Number (no_hp) Rules
- Minimum 8 characters
- Maximum 15 characters

### D. OTP Rules
- Exactly 6 digits
- Numeric only
- Expires after 10 minutes (configurable)

### E. Password Rules
- Minimum 6 characters

### F. Date Formats
- All dates use ISO 8601 format: `YYYY-MM-DD`
- Timestamps include time: `YYYY-MM-DDTHH:mm:ss.sssZ`

---

## Changelog

### Version 1.0.0 (December 14, 2025)
- Initial API specification release
- Complete documentation for all 11 route modules
- Authentication with OTP verification
- Patient management CRUD operations
- Schedule management
- Medical examination (SOAP format)
- Specialized services: KB, ANC, Immunization, Delivery, Patient Visit
- Dashboard analytics
- Excel report generation
