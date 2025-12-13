const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constant');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // 1. Cek keberadaan token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ada atau format salah.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Simpan data user (id, username) ke request untuk digunakan di Controller/Service
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        // 3. Penanganan error jika token tidak valid/expired
        return res.status(403).json({ message: 'Akses ditolak. Token tidak valid.' });
    }
};

module.exports = { 
    verifyToken 
};