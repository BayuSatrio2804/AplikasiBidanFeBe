# 🔧 DEBUG: Login Issues & 401 Errors

## 📋 DIAGNOSIS MASALAH

Dari screenshot dan analisis kode, masalah yang teridentifikasi:

### 1. **Backend Sudah Benar** ✅
- Backend running di `http://localhost:5000`
- User "bayu" sudah `is_verified = 1`
- API endpoint sudah correct

### 2. **Frontend Config Sudah Benar** ✅
- `apiConfig.js` sudah set ke `http://localhost:5000/api`

### 3. **MASALAH UTAMA: Browser Cache** ❌
- Console error menunjukkan request ke `http://localhost:3000` (port lama)
- Pesan "Akun belum diverifikasi" tidak ada di kode (cached dari versi lama)
- Frontend belum reload dengan config terbaru

---

## 🚀 SOLUSI LENGKAP

### Step 1: Stop & Clear Semuanya

```powershell
# Stop semua node process
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Optional: Clear npm cache
npm cache clean --force
```

### Step 2: Restart Backend

```powershell
cd "c:\Aplikasi Bidan\TUBES PROTEIN BE\aplikasi-bidan-pintar"
npm start
```

**Pastikan muncul:**
```
✅ Connected to MySQL Database: bidan_db
Server SI Bidan berjalan di http://localhost:5000
```

### Step 3: Restart Frontend

```powershell
# Di terminal baru
cd "c:\Aplikasi Bidan\TUBES PROTEIN FE\Aplikasi-Bidan"
npm start
```

**Pastikan muncul:**
```
webpack compiled successfully
On Your Network:  http://192.168.x.x:3000
```

### Step 4: Clear Browser Cache **WAJIB!**

#### Chrome/Edge:
1. Tekan **Ctrl + Shift + Delete**
2. Pilih **Cached images and files**
3. Time range: **All time**
4. Klik **Clear data**

#### Atau Hard Refresh:
- **Ctrl + Shift + R** (Windows)
- **Ctrl + F5** (Alternative)

### Step 5: Test Login

1. Buka browser baru/incognito: `http://localhost:3000`
2. Login dengan:
   - Username: **bayu**
   - Password: *(password yang kamu set)*
3. **Lihat console** - harusnya request ke `localhost:5000` sekarang

---

## 🔍 VERIFIKASI

### 1. Cek Console Network Tab
Request seharusnya ke:
```
POST http://localhost:5000/api/auth/login
```

BUKAN:
```
POST http://localhost:3000/api/auth/login  ❌
```

### 2. Response yang Benar

#### Login Success Response:
```json
{
  "success": true,
  "message": "Password benar. Kode OTP telah dikirim ke email Anda.",
  "email": "bayusatrio0235@gmail.com"
}
```

#### Kemudian Redirect ke OTP Page
- Cek email untuk kode OTP 6 digit
- Masukkan OTP
- Login berhasil!

---

## 🐛 JIKA MASIH ERROR

### Error: 401 Unauthorized

**Kemungkinan:**
1. Password salah - coba reset password
2. User tidak ada - cek database

**Test Database:**
```sql
SELECT username, email, is_verified FROM users WHERE username = 'bayu';
```

Should show:
```
username: bayu
email: bayusatrio0235@gmail.com
is_verified: 1
```

### Error: Cannot connect to backend

**Check:**
```powershell
# Test backend API
curl http://localhost:5000/api/auth/login -Method POST -ContentType "application/json" -Body '{"usernameOrEmail":"bayu","password":"test"}'
```

---

## 📝 QUICK COMMANDS

```powershell
# Terminal 1: Backend
cd "c:\Aplikasi Bidan\TUBES PROTEIN BE\aplikasi-bidan-pintar"
npm start

# Terminal 2: Frontend
cd "c:\Aplikasi Bidan\TUBES PROTEIN FE\Aplikasi-Bidan"
npm start

# Terminal 3: Database Check
cd "c:\Aplikasi Bidan\TUBES PROTEIN BE\aplikasi-bidan-pintar"
node update-verified-users.js
```

---

## ✅ EXPECTED FLOW

```
1. User buka http://localhost:3000
   ↓
2. Login dengan username: bayu
   ↓
3. Request ke http://localhost:5000/api/auth/login
   ↓
4. Backend validate password ✅
   ↓
5. Backend kirim OTP ke email ✅
   ↓
6. Frontend redirect ke halaman OTP ✅
   ↓
7. User masukkan OTP dari email
   ↓
8. Request ke http://localhost:5000/api/auth/verify-otp
   ↓
9. Login berhasil! → Dashboard 🎉
```

---

## 💡 TIPS

1. **Selalu gunakan Incognito/Private mode** untuk testing setelah code changes
2. **Check Console Network tab** untuk lihat request/response
3. **Check Email** untuk OTP code (check spam folder juga)
4. **OTP expired dalam 10 menit** - request ulang jika sudah lewat

---

## 📧 OTP EMAIL CONFIG

Pastikan `.env` punya:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

Generate Gmail App Password: https://myaccount.google.com/apppasswords

---

## 🎯 KESIMPULAN

**Masalah utama:** Browser cache masih pakai old config yang connect ke port 3000

**Solusi:** Hard refresh browser atau clear cache completely

**Status saat ini:**
- ✅ Backend running di port 5000
- ✅ Database user sudah verified
- ✅ Frontend config sudah benar
- ❌ Browser perlu hard refresh / clear cache

**WAJIB:** Clear browser cache sebelum test!
