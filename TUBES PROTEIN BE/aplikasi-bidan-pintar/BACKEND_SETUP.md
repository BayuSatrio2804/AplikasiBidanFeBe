# BACKEND SETUP - CORS & Environment

## 🔧 Setup CORS (Critical untuk Integration)

Backend HARUS mengatur CORS agar frontend bisa mengakses API.

### Check server.js

**File:** `src/server.js`

Pastikan CORS sudah dikonfigurasi:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',      // Frontend development
    'http://127.0.0.1:3000',
    'http://localhost:5000',      // Backend development
    // Tambah URL production jika diperlukan
    // 'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
// ... routes lainnya

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 📦 Install CORS Package

Jika belum terinstall:

```bash
npm install cors
```

Pastikan di package.json ada:
```json
"dependencies": {
  "cors": "^2.8.5"
  // ... dependencies lainnya
}
```

---

## 🔐 Environment Variables

**File:** `src/.env` (di folder backend)

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aplikasi_bidan
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here_minimum_32_chars
TOKEN_EXPIRY=7d

# Email Configuration (untuk OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@bidandigital.com

# OTP Configuration
OTP_EXPIRY=5
OTP_LENGTH=6
```

---

## 📋 Environment Variables Explanation

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DB_HOST` | Database server address | `localhost` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `password123` |
| `DB_NAME` | Database name | `aplikasi_bidan` |
| `DB_PORT` | Database port | `3306` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `development` / `production` |
| `JWT_SECRET` | Secret key untuk JWT | Generate unique string |
| `TOKEN_EXPIRY` | Token expiration time | `7d`, `24h` |
| `SMTP_HOST` | Email SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` atau `465` |
| `SMTP_USER` | Email sender | `your_email@gmail.com` |
| `SMTP_PASS` | Email app password | Generated from Gmail |
| `SMTP_FROM` | Email dari address | `noreply@domain.com` |
| `OTP_EXPIRY` | OTP expiration in minutes | `5` |
| `OTP_LENGTH` | OTP code length | `6` |

---

## 🔑 Generate JWT Secret

**Terminal bash/PowerShell:**

```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 32
```

Copy hasil dan paste ke `.env`:
```bash
JWT_SECRET=your_generated_hex_string_here
```

---

## 📧 Setup Gmail untuk OTP

### Step 1: Enable 2-Factor Authentication
1. Go to myaccount.google.com
2. Security → 2-Step Verification
3. Follow setup

### Step 2: Generate App Password
1. Go to myaccount.google.com
2. Security → App passwords
3. Select "Mail" dan "Windows Computer" (atau device yang digunakan)
4. Google akan generate 16-character password
5. Copy ke `.env` sebagai `SMTP_PASS`

### Step 3: Update .env
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  (generated app password)
SMTP_FROM=your_email@gmail.com
```

---

## 🚀 Run Backend

```bash
# Development dengan auto-reload
npm run dev

# Production
npm start
```

---

## ✅ Verification Checklist

- [ ] CORS dikonfigurasi di `server.js`
- [ ] `.env` file sudah ada dengan semua variables
- [ ] Database connection working
- [ ] Backend running di port 5000
- [ ] Frontend bisa mengakses API (check Network tab)
- [ ] Email/OTP service berfungsi

---

## 🐛 Debugging

### Test API Endpoint

**Gunakan Postman / Insomnia:**

1. **Register**
```
POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json

{
  "nama_lengkap": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

2. **Login**
```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

### Check Server Console

```bash
# Lihat di terminal backend
[timestamp] Server running on http://localhost:5000
```

### Check Browser Network Tab

1. F12 → Network tab
2. Refresh page
3. Lihat request ke `/api/auth/*`
4. Check status code dan response

---

## 🔗 Frontend Backend Connection

Setelah backend setup selesai, frontend harus pointing ke backend:

**File:** `src/config/apiConfig.js` (Frontend)

```javascript
const API_CONFIG = {
  BASE_URL_DEV: 'http://localhost:5000/api',  // ← Sesuaikan dengan backend port
  ...
};
```

---

## Port References

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| Database | 3306 | localhost:3306 |
| SMTP | 587 | smtp.gmail.com:587 |

---

## Common Issues

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest at 'http://localhost:5000/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
1. Pastikan CORS sudah di-install: `npm install cors`
2. Tambah di `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

### ❌ .env tidak dibaca
**Solution:**
1. Install dotenv: `npm install dotenv`
2. Tambah di awal `server.js`:
```javascript
require('dotenv').config();
```

### ❌ Email tidak terkirim
**Solution:**
1. Cek SMTP credentials di `.env`
2. Pastikan 2FA enabled di Gmail
3. Generate app password baru

---

## Ready for Frontend Integration! ✅

Setelah setup selesai, frontend sudah bisa mengakses semua auth endpoints.

Next: Follow `INTEGRATION_GUIDE.md` di frontend folder untuk testing.

