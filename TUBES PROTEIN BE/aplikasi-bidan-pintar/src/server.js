/**
 * Main Server Entry Point
 * Express application setup and configuration
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
require('./config/database');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const pasienRoutes = require('./routes/pasien.routes');
const pemeriksaanRoutes = require('./routes/pemeriksaan.routes');
const jadwalRoutes = require('./routes/jadwal.routes');
const laporanRoutes = require('./routes/laporan.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const kunjunganPasienRoutes = require('./routes/kunjunganPasien.routes');
const ancRoutes = require('./routes/anc.routes');
const kbRoutes = require('./routes/kb.routes');
const imunisasiRoutes = require('./routes/imunisasi.routes');
const persalinanRoutes = require('./routes/persalinan.routes');

// ============================================
// Middleware Configuration
// ============================================

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Reset-Token']
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// API Routes
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (current)
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/pemeriksaan', pemeriksaanRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kunjungan-pasien', kunjunganPasienRoutes);
app.use('/api/anc', ancRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/imunisasi', imunisasiRoutes);
app.use('/api/persalinan', persalinanRoutes);

// Legacy routes (v1 prefix for backward compatibility)
app.use('/v1/auth', authRoutes);
app.use('/v1/pasien', pasienRoutes);
app.use('/v1/pemeriksaan', pemeriksaanRoutes);
app.use('/v1/jadwal', jadwalRoutes);
app.use('/v1/laporan', laporanRoutes);
app.use('/v1/dashboard', dashboardRoutes);
app.use('/v1/kunjungan-pasien', kunjunganPasienRoutes);
app.use('/v1/anc', ancRoutes);
app.use('/v1/kb', kbRoutes);
app.use('/v1/imunisasi', imunisasiRoutes);
app.use('/v1/persalinan', persalinanRoutes);

// ============================================
// Error Handling
// ============================================

// Handle 404 - Route not found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});