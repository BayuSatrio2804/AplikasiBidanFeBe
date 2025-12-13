# INTEGRATION GUIDE - Frontend Auth

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Konfigurasi API](#konfigurasi-api)
3. [Alur Integrasi](#alur-integrasi)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Persiapan

### Backend Requirements
- ✅ Backend sudah berjalan di `http://localhost:5000`
- ✅ Semua endpoint auth telah diimplementasikan:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/verify-otp`
  - `POST /api/auth/forgot-password/request`
  - `POST /api/auth/forgot-password/verify-code`
  - `POST /api/auth/forgot-password/reset`

### Frontend Files yang Sudah Diintegrasikan
✅ `src/services/authService.js` - API Service untuk auth
✅ `src/components/auth/Masuk.js` - Login page
✅ `src/components/auth/BuatAkun.js` - Register page
✅ `src/components/auth/VerifikasiOTP.js` - OTP verification page
✅ `src/components/auth/LupaPassword.js` - Forgot password page
✅ `src/components/auth/ResetPassword.js` - Reset password page (NEW)
✅ `src/config/apiConfig.js` - API configuration
✅ `src/App.js` - Updated with new routes

---

## Konfigurasi API

### 1. Setup API Base URL

**File:** `src/config/apiConfig.js`

```javascript
const API_CONFIG = {
  BASE_URL_DEV: 'http://localhost:5000/api',    // Development
  BASE_URL_PROD: 'https://api.your-domain.com/api', // Production
  
  get BASE_URL() {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return this.BASE_URL_DEV;
  }
};
```

**Opsi Konfigurasi:**

#### Opsi 1: Direct URL (Development)
Tidak perlu setup, default sudah ke `http://localhost:5000/api`

#### Opsi 2: Environment Variable
Buat file `.env` di root folder frontend:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

Untuk production:
```bash
REACT_APP_API_URL=https://api.your-domain.com/api
```

#### Opsi 3: Update Langsung di apiConfig.js
```javascript
const API_CONFIG = {
  BASE_URL_DEV: 'http://your-ip:5000/api',
  ...
};
```

---

## Alur Integrasi

### 1. REGISTRASI (Register Account)

**Flow:**
```
User isi form registrasi
    ↓
Click "Buat Akun"
    ↓
API: POST /auth/register
    ↓
Backend kirim OTP ke email
    ↓
Frontend navigasi ke Verifikasi OTP
    ↓
User masukkan kode OTP
    ↓
API: POST /auth/verify-otp
    ↓
Login berhasil → Dashboard
```

**Data yang dikirim:**
```javascript
{
  nama_lengkap: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  password: "secure_password123"
}
```

**Response Sukses:**
```javascript
{
  message: "Registrasi berhasil. Silakan cek email Anda untuk kode verifikasi (OTP).",
  data: {
    id_user: "uuid-xxx",
    nama_lengkap: "John Doe",
    username: "johndoe",
    email: "john@example.com"
  }
}
```

---

### 2. LOGIN

**Flow:**
```
User isi username/email + password
    ↓
Click "Masuk"
    ↓
API: POST /auth/login
    ↓
Backend kirim OTP ke email
    ↓
Frontend navigasi ke Verifikasi OTP
    ↓
User masukkan kode OTP
    ↓
API: POST /auth/verify-otp
    ↓
Simpan token ke localStorage
    ↓
Login berhasil → Dashboard
```

**Data yang dikirim:**
```javascript
{
  usernameOrEmail: "johndoe",  // atau "john@example.com"
  password: "secure_password123"
}
```

**Response Sukses:**
```javascript
{
  message: "Login berhasil. Kode OTP telah dikirim ke email Anda.",
  email: "john@example.com"
}
```

---

### 3. LUPA PASSWORD

**Flow:**
```
User klik "Lupa password"
    ↓
Masukkan email
    ↓
Click "Kirim"
    ↓
API: POST /auth/forgot-password/request
    ↓
Backend kirim OTP ke email
    ↓
Frontend navigasi ke Verifikasi OTP
    ↓
User masukkan kode OTP
    ↓
API: POST /auth/forgot-password/verify-code
    ↓
Backend return reset token
    ↓
Frontend navigasi ke Reset Password
    ↓
User isi password baru
    ↓
API: POST /auth/forgot-password/reset (dengan reset token)
    ↓
Password berhasil direset
    ↓
Kembali ke Login
```

**Step 1: Request Reset**
```javascript
{
  email: "john@example.com"
}
```

**Step 2: Verify Code**
```javascript
{
  email: "john@example.com",
  otp_code: "123456"
}
```

**Response:**
```javascript
{
  reset_token: "token-xxx"
}
```

**Step 3: Reset Password**
```javascript
{
  email: "john@example.com",
  new_password: "new_password123",
  confirm_password: "new_password123"
}
```

---

## Testing

### Test Checklist

#### ✅ Register
- [ ] Buka halaman register
- [ ] Isi semua field (nama, username, email, password)
- [ ] Click "Buat Akun"
- [ ] Lihat error message jika ada
- [ ] Jika berhasil, akan navigasi ke OTP verification
- [ ] Masukkan OTP yang diterima di email
- [ ] Seharusnya login berhasil dan masuk ke dashboard

#### ✅ Login
- [ ] Buka halaman login
- [ ] Isi username/email dan password
- [ ] Click "Masuk"
- [ ] Lihat error message jika ada
- [ ] Jika berhasil, akan navigasi ke OTP verification
- [ ] Masukkan OTP yang diterima di email
- [ ] Seharusnya login berhasil dan masuk ke dashboard

#### ✅ Forgot Password
- [ ] Dari halaman login, click "Lupa password"
- [ ] Masukkan email terdaftar
- [ ] Click "Kirim"
- [ ] Akan navigasi ke halaman verifikasi OTP
- [ ] Masukkan OTP yang diterima di email
- [ ] Akan navigasi ke halaman reset password
- [ ] Isi password baru dan konfirmasi password
- [ ] Click "Reset Password"
- [ ] Seharusnya kembali ke halaman login
- [ ] Login dengan password baru

### Testing Tools

**1. Browser DevTools Network Tab**
- Lihat request/response di tab Network
- Pastikan status response 200/201 untuk sukses
- Lihat payload yang dikirim

**2. Console
- Lihat console untuk error messages
- Check console.log untuk debugging

**3. Postman / Insomnia**
Test API endpoint langsung:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

---

## LocalStorage Keys

Aplikasi menggunakan localStorage untuk menyimpan data:

| Key | Deskripsi | Format |
|-----|-----------|--------|
| `token` | JWT auth token | String |
| `user` | User data | JSON |
| `loginEmail` | Email untuk login OTP | String |
| `registerEmail` | Email untuk register OTP | String |
| `resetEmail` | Email untuk reset password | String |
| `resetToken` | Token untuk reset password | String |

---

## API Endpoints Reference

### 1. Register
```
POST /auth/register
Content-Type: application/json

Request:
{
  "nama_lengkap": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201):
{
  "message": "string",
  "data": {
    "id_user": "string",
    "nama_lengkap": "string",
    "username": "string",
    "email": "string"
  }
}
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "usernameOrEmail": "string",
  "password": "string"
}

Response (200):
{
  "message": "string",
  "email": "string"
}
```

### 3. Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

Request:
{
  "usernameOrEmail": "string",
  "otp_code": "string"
}

Response (200):
{
  "message": "string",
  "token": "string",
  "user": {
    "id_user": "string",
    "nama_lengkap": "string",
    "username": "string",
    "email": "string"
  }
}
```

### 4. Forgot Password Request
```
POST /auth/forgot-password/request
Content-Type: application/json

Request:
{
  "email": "string"
}

Response (200):
{
  "message": "string"
}
```

### 5. Forgot Password Verify Code
```
POST /auth/forgot-password/verify-code
Content-Type: application/json

Request:
{
  "email": "string",
  "otp_code": "string"
}

Response (200):
{
  "message": "string",
  "reset_token": "string"
}
```

### 6. Forgot Password Reset
```
POST /auth/forgot-password/reset
Authorization: Bearer <reset_token>
Content-Type: application/json

Request:
{
  "email": "string",
  "new_password": "string",
  "confirm_password": "string"
}

Response (200):
{
  "message": "string"
}
```

---

## Troubleshooting

### ❌ Error: "Cannot reach API"

**Solusi:**
1. Pastikan backend sudah running di port 5000
```bash
# Di terminal backend
npm start
```

2. Cek API_BASE_URL di `src/config/apiConfig.js`
```javascript
BASE_URL_DEV: 'http://localhost:5000/api'
```

3. Pastikan tidak ada firewall yang memblokir

### ❌ Error: "CORS Error"

**Solusi:**
Backend harus mengatur CORS headers. Di `server.js` backend:
```javascript
const cors = require('cors');
app.use(cors());
```

### ❌ Error: "Email sudah digunakan"

**Solusi:**
- Email sudah terdaftar di database
- Gunakan email yang belum terdaftar
- Atau reset database jika dalam development

### ❌ Error: "OTP tidak valid"

**Solusi:**
1. Pastikan OTP benar
2. Cek email inbox untuk OTP terbaru
3. Jika sudah lama, click "Kirim ulang" untuk OTP baru

### ❌ Token tidak tersimpan

**Solusi:**
1. Cek browser localStorage (F12 > Application > localStorage)
2. Pastikan tidak ada error saat menyimpan
3. Cek console untuk error messages

### ❌ Halaman tidak navigasi setelah login

**Solusi:**
1. Cek console untuk errors
2. Pastikan OTP verification berhasil (response status 200)
3. Cek token tersimpan di localStorage

---

## Env Variables (Optional)

**File:** `.env`

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Debug
REACT_APP_DEBUG=true
```

**Menggunakan di kode:**
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const isDebug = process.env.REACT_APP_DEBUG === 'true';
```

---

## Next Steps

1. ✅ Jalankan backend: `npm start` (di folder backend)
2. ✅ Jalankan frontend: `npm start` (di folder frontend)
3. ✅ Test registrasi, login, dan lupa password
4. ✅ Integrasi halaman dashboard dengan API
5. ✅ Implementasi protected routes dengan JWT

---

## Files Modified/Created

**Modified:**
- ✅ `src/App.js` - Added ResetPassword route
- ✅ `src/components/auth/Masuk.js` - API integration
- ✅ `src/components/auth/BuatAkun.js` - API integration
- ✅ `src/components/auth/VerifikasiOTP.js` - API integration
- ✅ `src/components/auth/LupaPassword.js` - API integration

**Created:**
- ✅ `src/services/authService.js` - Auth API service
- ✅ `src/components/auth/ResetPassword.js` - Reset password component
- ✅ `src/config/apiConfig.js` - API configuration

---

## Support

Jika ada pertanyaan atau error, check:
1. Backend console logs
2. Frontend console logs (F12)
3. Browser Network tab (F12 > Network)
4. Backend error response

Happy coding! 🚀
