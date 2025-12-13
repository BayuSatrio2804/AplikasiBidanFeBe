const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./config/database'); // Memuat konfigurasi database
const PORT = process.env.PORT || 3000;

// Force unbuffered console output
console.log('='.repeat(60));
console.log('[STARTUP] Server starting...');
console.log('='.repeat(60));

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware untuk membaca JSON body
app.use(express.json());

// Middleware untuk logging semua request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, JSON.stringify(req.body));
  next();
});

// Middleware untuk error handling
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({ message: 'Unhandled error', error: err.message });
});

// --- Impor Rute ---
const authRoutes = require('./routes/auth.routes');
const pasienRoutes = require('./routes/pasien.routes');
const pemeriksaanRoutes = require('./routes/pemeriksaan.routes');
const jadwalRoutes = require('./routes/jadwal.routes');
const laporanRoutes = require('./routes/laporan.routes');
const dashboardRoutes = require('./routes/dashboard.routes'); 
const kunjunganPasienRoutes = require('./routes/kunjunganPasien.routes');
const ancroutes = require('./routes/anc.routes');
const kbRoutes = require('./routes/kb.routes');
const imunisasiRoutes = require('./routes/imunisasi.routes');
const persalinanRoutes = require('./routes/persalinan.routes');


// --- Gunakan Rute ---
// Support both /v1 dan /api prefixes
// For frontend: /api
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/pemeriksaan', pemeriksaanRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/kunjungan-pasien', kunjunganPasienRoutes);
app.use('/api/anc', ancroutes);
app.use('/api/kb', kbRoutes);
app.use('/api/imunisasi', imunisasiRoutes);
app.use('/api/persalinan', persalinanRoutes);

// Legacy support: /v1 for backward compatibility
app.use('/v1/auth', authRoutes);
app.use('/v1/pasien', pasienRoutes);
app.use('/v1/pemeriksaan', pemeriksaanRoutes);
app.use('/v1/jadwal', jadwalRoutes);
app.use('/v1/laporan', laporanRoutes);
app.use('/v1/dashboard', dashboardRoutes); 
app.use('/v1/kunjungan-pasien', kunjunganPasienRoutes);
app.use('/v1/anc', ancroutes);
app.use('/v1/kb', kbRoutes);
app.use('/v1/imunisasi', imunisasiRoutes);
app.use('/v1/persalinan', persalinanRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  console.log('[TEST] Test endpoint called');
  res.json({ message: 'Test OK', time: new Date().toISOString() });
});

app.post('/test', (req, res) => {
  console.log('[TEST] Test POST endpoint called with body:', req.body);
  res.json({ message: 'Test POST OK', received: req.body });
});

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server SI Bidan berjalan di http://localhost:${PORT}`);
});