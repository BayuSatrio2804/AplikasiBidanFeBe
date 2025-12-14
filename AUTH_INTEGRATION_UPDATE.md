# Integrasi Ulang Sistem Autentikasi

## Perubahan yang Dibuat

Sistem autentikasi telah diperbarui sesuai dengan requirement:
- **Registrasi**: Tidak memerlukan OTP (akun langsung aktif)
- **Login**: Memerlukan OTP untuk masuk ke dashboard

## Perubahan Backend

### 1. Auth Controller (`src/controllers/auth.controller.js`)
- **Fungsi `register`**: Sudah ada - langsung mengaktifkan akun tanpa OTP
- **Fungsi `login`**: Sudah ada - mengirim OTP setelah password benar
- **Fungsi `verifyOTP`**: Sudah ada - verifikasi OTP dan memberikan JWT token
- **Fungsi `resendOTP`** (BARU): Mengirim ulang OTP untuk proses login

### 2. Auth Routes (`src/routes/auth.routes.js`)
- **POST `/register`**: Registrasi tanpa OTP
- **POST `/login`**: Login dengan pengiriman OTP
- **POST `/verify-otp`**: Verifikasi OTP
- **POST `/resend-otp`** (BARU): Kirim ulang OTP

## Perubahan Frontend

### 1. Komponen BuatAkun (`src/components/auth/BuatAkun.js`)
- Integrasi dengan API `/auth/register`
- Menampilkan pesan sukses dan redirect ke halaman login
- Tidak ada proses OTP dalam registrasi

### 2. Komponen Masuk (`src/components/auth/Masuk.js`)
- Integrasi dengan API `/auth/login`
- Redirect ke halaman verifikasi OTP setelah login berhasil
- Membawa data email dan usernameOrEmail untuk verifikasi OTP

### 3. Komponen VerifikasiOTP (`src/components/auth/VerifikasiOTP.js`)
- Integrasi dengan API `/auth/verify-otp`
- Menyimpan token JWT dan data user ke localStorage
- Redirect ke dashboard setelah verifikasi berhasil
- Fitur kirim ulang OTP menggunakan API `/auth/resend-otp`

### 4. App.js
- Update state management untuk menangani data OTP
- Update navigation flow antara login → OTP → dashboard
- Penanganan authentication state yang lebih baik

## Flow Autentikasi Baru

### Registrasi
1. User mengisi form registrasi
2. Frontend POST ke `/auth/register`
3. Backend langsung mengaktifkan akun (`is_verified = 1`)
4. User diarahkan ke halaman login

### Login
1. User mengisi username/email + password
2. Frontend POST ke `/auth/login`
3. Backend verifikasi password, kirim OTP ke email
4. User diarahkan ke halaman verifikasi OTP
5. User memasukkan kode OTP 6 digit
6. Frontend POST ke `/auth/verify-otp`
7. Backend verifikasi OTP, return JWT token
8. User masuk ke dashboard

## Testing

Untuk menguji sistem:
1. Jalankan backend: `cd "TUBES PROTEIN BE/aplikasi-bidan-pintar" && npm start`
2. Jalankan frontend: `cd "TUBES PROTEIN FE" && npm start`
3. Buka http://localhost:3000
4. Test registrasi dan login dengan flow baru

## Catatan Teknis

- OTP dikirim melalui email menggunakan service yang sudah ada
- Token JWT disimpan di localStorage
- OTP berlaku selama waktu yang ditentukan di konfigurasi
- Sistem mendukung resend OTP jika user tidak menerima email
- Database schema tidak berubah, hanya menggunakan field `is_verified` yang sudah ada

## Port Configuration
- Backend: http://localhost:5000
- Frontend: http://localhost:3000