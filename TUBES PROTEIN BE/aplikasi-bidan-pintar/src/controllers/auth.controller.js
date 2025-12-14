// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/auth.service'); 
const auditService = require('../services/audit.service');
const otpService = require('../services/otp.service');
const { JWT_SECRET, SALT_ROUNDS, TOKEN_EXPIRY } = require('../utils/constant'); // Pastikan ini di-import

// 1. Fungsi REGISTER (Tanpa OTP, langsung aktif)
const register = async (req, res) => {
    const { nama_lengkap, username, email, password } = req.body;
    try {
        console.log('[REGISTER] Attempting to register:', { nama_lengkap, username, email });
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const id_user = uuidv4();

        console.log('[REGISTER] Password hashed, calling authService.registerUser');
        const newUser = await authService.registerUser(id_user, nama_lengkap, username, email, hashedPassword);
        console.log('[REGISTER] User registered successfully:', newUser);

        // Registrasi berhasil tanpa OTP, akun langsung aktif
        console.log('[REGISTER] User account is now active (no OTP required)');

        return res.status(201).json({ 
            success: true,
            message: 'Registrasi berhasil! Silakan login menggunakan akun Anda.',
            data: { id_user: newUser.id_user, nama_lengkap: newUser.nama_lengkap, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        console.error('[REGISTER ERROR STACK]', error.stack);
        process.stderr.write(`\n[REGISTER ERROR DETAILS]\nMessage: ${error.message}\nCode: ${error.code}\nStack: ${error.stack}\n`);
        
        if (error.code === 'ER_DUP_ENTRY') {
            const message = error.sqlMessage.includes('username') ? 'Username sudah digunakan.' : 'Email sudah terdaftar.';
            return res.status(400).json({ success: false, message: message });
        }
        return res.status(500).json({ 
            success: false,
            message: 'Server Error', 
            error: error.message,
            details: error.toString()
        });
    }
};

// 2. Fungsi LOGIN (Kirim OTP setiap kali login)
const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    let user = null;
    const ipAddress = req.ip; 
    
    try {
        console.log('[LOGIN] Attempting login for:', usernameOrEmail);
        
        // 1. Cari user
        user = await authService.getUserByUsernameOrEmail(usernameOrEmail);

        if (!user) {
            console.log('[LOGIN] User not found');
            await auditService.recordLoginAttempt(null, usernameOrEmail, 'GAGAL', ipAddress);
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // 2. Bandingkan Password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('[LOGIN] Password mismatch');
            await auditService.recordLoginAttempt(user.id_user, user.username, 'GAGAL', ipAddress);
            return res.status(401).json({ message: 'Password salah.' });
        }

        // 3. Password cocok, kirim OTP untuk verifikasi
        console.log('[LOGIN] Password correct, sending OTP to:', user.email);
        try {
            await otpService.saveAndSendOTP(user.id_user, user.email);
            console.log('[LOGIN] OTP sent successfully');
        } catch (otpError) {
            console.error('[LOGIN] Failed to send OTP:', otpError.message);
            return res.status(500).json({ message: 'Gagal mengirim kode OTP. Silakan coba lagi.' });
        }

        // 4. Return success, user harus verifikasi OTP
        res.status(200).json({
            success: true,
            message: 'Password benar. Kode OTP telah dikirim ke email Anda.',
            email: user.email
        });
        
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        if (user) {
            await auditService.recordLoginAttempt(user.id_user, user.username, 'GAGAL', ipAddress);
        } else {
            await auditService.recordLoginAttempt(null, usernameOrEmail, 'GAGAL', ipAddress);
        }
        res.status(500).json({ message: 'Server Error. Login gagal.', error: error.message });
    }
};

// 3. Fungsi verifyOTP (Langkah Akhir Login/Verifikasi Akun)
const verifyOTP = async (req, res) => {
    const { usernameOrEmail, otp_code } = req.body;
    let user = null;

    try {
        console.log('[VERIFY-OTP] Starting verification for:', { usernameOrEmail, otp_code });
        
        // 1. Cari user
        user = await authService.getUserByUsernameOrEmail(usernameOrEmail);
        console.log('[VERIFY-OTP] Found user:', { user: user ? { id: user.id_user, email: user.email } : null });

        if (!user) {
            console.log('[VERIFY-OTP] User not found');
            return res.status(400).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // 2. Verifikasi OTP (Asumsi: service akan menghapus OTP setelah berhasil)
        console.log('[VERIFY-OTP] Calling authService.verifyOTP');
        const verifiedUser = await authService.verifyOTP(user, otp_code);
        console.log('[VERIFY-OTP] OTP verified successfully, creating token');

        // 3. Jika VERIFIED, buat JWT
        const token = jwt.sign(
            { id: verifiedUser.id_user, username: verifiedUser.username },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        console.log('[VERIFY-OTP] Token created, sending response');
        res.status(200).json({
            message: 'Verifikasi berhasil. Anda berhasil login.',
            token: token,
            user: { 
                id_user: verifiedUser.id_user, 
                nama_lengkap: verifiedUser.nama_lengkap, 
                username: verifiedUser.username, 
                email: verifiedUser.email 
            }
        });

    } catch (error) {
        console.log('[VERIFY-OTP ERROR]', { message: error.message, stack: error.stack });
        // Error penanganan dari service (Kode Salah/Expired)
        if (error.message.includes('Kode OTP') || error.message.includes('Pengguna')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// 4. Fungsi getProfile
const getProfile = async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await authService.getUserById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Profil berhasil diambil', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 5. Fungsi updateProfile
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body; 
    let hashedPassword = null;
    try {
        if (password) {
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        }
        // req.body sudah divalidasi oleh Joi, jadi aman dikirim
        const updatedData = await authService.updateProfile(userId, req.body, hashedPassword);
        res.status(200).json({ message: 'Profil berhasil diperbarui', data: updatedData });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const message = error.sqlMessage.includes('username') ? 'Username sudah digunakan.' : 'Email sudah terdaftar.';
            return res.status(400).json({ message: message });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 6. Fungsi requestPasswordReset (Langkah 1: Kirim Kode OTP)
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await authService.getUserByEmail(email); 
        
        // Praktik terbaik: Beri respon samar untuk alasan keamanan
        if (!user) {
            // Berikan penundaan singkat untuk mempersulit serangan enumerasi
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            return res.status(200).json({ 
                message: 'Jika email terdaftar, kode reset password telah dikirimkan ke email Anda.' 
            });
        }

        // Hasilkan, simpan OTP ke tabel otp_codes, dan kirimkan email.
        await otpService.saveAndSendOTP(user.id_user, email); 

        res.status(200).json({ 
            message: 'Kode verifikasi (OTP) untuk reset password telah dikirimkan ke email Anda.' 
        });

    } catch (error) {
        // Logika untuk error seperti gagal kirim email.
        res.status(500).json({ 
            message: 'Gagal memproses permintaan reset password.', 
            error: error.message 
        });
    }
};

// 7. Fungsi verifyResetCode (Langkah 2: Verifikasi Kode)
const verifyResetCode = async (req, res) => {
    const { email, otp_code } = req.body;
    try {
        const user = await authService.getUserByEmail(email); 
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // 1. Validasi kode OTP
        await otpService.validateOTP({ id_user: user.id_user }, otp_code);
        
        // 2. Hapus OTP setelah sukses
        await otpService.deleteOTP(user.id_user);
        
        // 3. Buat token sementara (reset_token) dengan masa berlaku singkat (misal 5 menit)
        const resetToken = jwt.sign(
            { id: user.id_user, is_reset: true }, // payload khusus
            JWT_SECRET, 
            { expiresIn: '5m' } 
        );

        res.status(200).json({ 
            message: 'Kode verifikasi berhasil. Silakan gunakan token ini di header X-Reset-Token untuk mengatur ulang password Anda.',
            reset_token: resetToken, 
            id_user: user.id_user // Diperlukan untuk endpoint reset
        });
        
    } catch (error) {
        // Penanganan error dari otp.service (Kode Salah/Expired)
        const status = error.message.includes('kedaluwarsa') || error.message.includes('tidak valid') ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};


// 8. Fungsi resetPassword (Langkah 3: Mengatur Ulang Password)
const resetPassword = async (req, res) => {
    // Ambil token reset dari header X-Reset-Token (standar yang lebih baik)
    const resetToken = req.headers['x-reset-token'] || req.body.reset_token; 
    const { id_user, new_password } = req.body; 

    if (!resetToken) {
        return res.status(401).json({ message: 'Token reset tidak ditemukan.' });
    }

    try {
        // 1. Verifikasi reset token
        const decoded = jwt.verify(resetToken, JWT_SECRET);

        // 2. Validasi payload khusus (is_reset=true) dan pastikan ID user cocok
        if (!decoded.is_reset || decoded.id !== id_user) {
            return res.status(403).json({ message: 'Token reset tidak valid atau tidak cocok dengan ID pengguna.' });
        }
        
        // 3. Hash password baru
        const hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);

        // 4. Update password di database
        await authService.updatePassword(id_user, hashedPassword);
        
        // 5. Opsi: Hapus semua OTP (tidak perlu karena sudah dihapus di verifyResetCode)
        // await otpService.deleteOTP(id_user); 

        res.status(200).json({ 
            message: 'Password berhasil diatur ulang. Silakan login dengan password baru Anda.' 
        });

    } catch (error) {
        // Penanganan error JWT (Token Expired, JsonWebTokenError)
        let status = 403;
        let message = 'Token reset sudah kedaluwarsa atau tidak valid.';
        if (error.name === 'TokenExpiredError') {
            status = 401;
            message = 'Token reset sudah kedaluwarsa. Silakan ulangi langkah lupa password.';
        } else if (error.name === 'JsonWebTokenError') {
            status = 403;
            message = 'Token reset tidak valid.';
        } else {
            status = 500;
            message = 'Server Error. Gagal reset password.';
        }

        res.status(status).json({ 
            message: message, 
            error: error.message 
        });
    }
};

module.exports = {
    register,
    login,
    verifyOTP,
    getProfile,
    updateProfile,
    requestPasswordReset,
    verifyResetCode, // Tambahkan ini
    resetPassword,
};