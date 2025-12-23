-- =============================================================================
-- Aplikasi Bidan Pintar - Database Initialization Script
-- Version: 1.0.0
-- Database: MySQL 8.0+
-- Last Updated: December 14, 2025
-- =============================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS aplikasi_bidan
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE aplikasi_bidan;

-- =============================================================================
-- DROP EXISTING TABLES (for clean reinstall)
-- =============================================================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS laporan;
DROP TABLE IF EXISTS layanan_kunjungan_pasien;
DROP TABLE IF EXISTS layanan_persalinan;
DROP TABLE IF EXISTS layanan_imunisasi;
DROP TABLE IF EXISTS layanan_anc;
DROP TABLE IF EXISTS layanan_kb;
DROP TABLE IF EXISTS pemeriksaan;
DROP TABLE IF EXISTS jadwal;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS audit_log_akses;
DROP TABLE IF EXISTS otp_codes;
DROP TABLE IF EXISTS pasien;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- TABLE: users
-- Description: User accounts (midwives/admin)
-- =============================================================================
CREATE TABLE users (
    id_user CHAR(36) NOT NULL PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_verified TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: otp_codes
-- Description: OTP codes for authentication
-- =============================================================================
CREATE TABLE otp_codes (
    id_user CHAR(36) NOT NULL PRIMARY KEY,
    otp_code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_otp_user FOREIGN KEY (id_user) 
        REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: pasien
-- Description: Patient master data
-- =============================================================================
CREATE TABLE pasien (
    id_pasien CHAR(36) NOT NULL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(20) NOT NULL,
    umur INT NOT NULL,
    alamat TEXT,
    no_hp VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nik (nik),
    INDEX idx_nama (nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: jadwal
-- Description: Appointment schedules
-- =============================================================================
CREATE TABLE jadwal (
    id_jadwal CHAR(36) NOT NULL PRIMARY KEY,
    id_pasien CHAR(36) NOT NULL,
    id_petugas CHAR(36) NOT NULL,
    jenis_layanan ENUM('ANC', 'KB', 'Imunisasi', 'Persalinan', 'Kunjungan Pasien') NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_jadwal_pasien FOREIGN KEY (id_pasien) 
        REFERENCES pasien(id_pasien) ON DELETE CASCADE,
    CONSTRAINT fk_jadwal_petugas FOREIGN KEY (id_petugas) 
        REFERENCES users(id_user) ON DELETE CASCADE,
    
    INDEX idx_tanggal (tanggal),
    INDEX idx_jenis_layanan (jenis_layanan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: pemeriksaan
-- Description: Medical examinations (SOAP format)
-- =============================================================================
CREATE TABLE pemeriksaan (
    id_pemeriksaan CHAR(36) NOT NULL PRIMARY KEY,
    id_pasien CHAR(36) NOT NULL,
    jenis_layanan ENUM('ANC', 'KB', 'Imunisasi', 'Persalinan', 'Kunjungan Pasien') NOT NULL,
    subjektif TEXT,
    objektif TEXT,
    analisa TEXT,
    tatalaksana TEXT,
    tanggal_pemeriksaan DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pemeriksaan_pasien FOREIGN KEY (id_pasien) 
        REFERENCES pasien(id_pasien) ON DELETE CASCADE,
    
    INDEX idx_tanggal_pemeriksaan (tanggal_pemeriksaan),
    INDEX idx_jenis_layanan (jenis_layanan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: layanan_kb
-- Description: Family Planning (KB) service records
-- Matches frontend field names from LayananKB component
-- =============================================================================
CREATE TABLE layanan_kb (
    id_kb CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    nomor_registrasi_lama VARCHAR(50),
    nomor_registrasi_baru VARCHAR(50),
    metode VARCHAR(50) NOT NULL,
    td_ibu VARCHAR(20),
    bb_ibu DECIMAL(5,2),
    nama_ayah VARCHAR(100),
    nik_ayah VARCHAR(20),
    umur_ayah INT,
    td_ayah VARCHAR(20),
    bb_ayah DECIMAL(5,2),
    kunjungan_ulang VARCHAR(100),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_kb_pemeriksaan FOREIGN KEY (id_pemeriksaan) 
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE,
    
    INDEX idx_metode (metode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: layanan_anc
-- Description: Antenatal Care (ANC) service records
-- =============================================================================
CREATE TABLE layanan_anc (
    id_anc CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    no_reg_lama VARCHAR(50),
    no_reg_baru VARCHAR(50),
    nama_suami VARCHAR(100),
    nik_suami CHAR(16),
    umur_suami INT,
    hpht DATE COMMENT 'Hari Pertama Haid Terakhir',
    hpl DATE COMMENT 'Hari Perkiraan Lahir',
    hasil_pemeriksaan TEXT,
    tindakan TEXT,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_anc_pemeriksaan FOREIGN KEY (id_pemeriksaan) 
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: layanan_imunisasi
-- Description: Immunization service records
-- =============================================================================
CREATE TABLE layanan_imunisasi (
    id_imunisasi CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    no_reg VARCHAR(50),
    nama_bayi_balita VARCHAR(100),
    tanggal_lahir_bayi DATE,
    tb_bayi DECIMAL(5,2) COMMENT 'Tinggi Badan dalam cm',
    bb_bayi DECIMAL(5,2) COMMENT 'Berat Badan dalam kg',
    jenis_imunisasi VARCHAR(100) NOT NULL,
    pengobatan TEXT,
    jadwal_selanjutnya VARCHAR(100),
    no_hp_kontak VARCHAR(15),
    nama_ibu VARCHAR(100),
    nik_ibu VARCHAR(20),
    umur_ibu INT,
    nama_ayah VARCHAR(100),
    nik_ayah VARCHAR(20),
    umur_ayah INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_imunisasi_pemeriksaan FOREIGN KEY (id_pemeriksaan) 
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE,
    
    INDEX idx_jenis_imunisasi (jenis_imunisasi),
    INDEX idx_nama_bayi (nama_bayi_balita)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: layanan_persalinan
-- Description: Delivery/Birth service records
-- =============================================================================
CREATE TABLE layanan_persalinan (
    id_persalinan CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    no_reg_lama VARCHAR(50),
    no_reg_baru VARCHAR(50),
    penolong VARCHAR(100) NOT NULL,
    nama_suami VARCHAR(100),
    nik_suami CHAR(16),
    umur_suami INT,
    td_ibu VARCHAR(20),
    bb_ibu DECIMAL(5,2),
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P', 'Tidak Diketahui') NOT NULL,
    anak_ke INT NOT NULL,
    jenis_partus VARCHAR(50) NOT NULL COMMENT 'Jenis persalinan',
    imd_dilakukan TINYINT(1) NOT NULL COMMENT 'Inisiasi Menyusui Dini',
    as_bayi VARCHAR(20) COMMENT 'APGAR Score',
    bb_bayi DECIMAL(7,2) COMMENT 'Berat Badan Bayi dalam gram',
    pb_bayi DECIMAL(5,2) COMMENT 'Panjang Badan Bayi dalam cm',
    lila_ibu DECIMAL(5,2) COMMENT 'Lingkar Lengan Atas Ibu',
    lida_ibu DECIMAL(5,2) COMMENT 'Lingkar Dada Ibu',
    lika_bayi DECIMAL(5,2) COMMENT 'Lingkar Kepala Bayi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_persalinan_pemeriksaan FOREIGN KEY (id_pemeriksaan) 
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE,
    
    INDEX idx_jenis_kelamin (jenis_kelamin),
    INDEX idx_tanggal_lahir (tanggal_lahir)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: layanan_kunjungan_pasien
-- Description: General patient visit records
-- =============================================================================
CREATE TABLE layanan_kunjungan_pasien (
    id_kunjungan CHAR(36) NOT NULL PRIMARY KEY,
    id_pemeriksaan CHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    no_reg VARCHAR(50),
    jenis_kunjungan ENUM('Bayi','Anak', 'Hamil','Nifas', 'KB', 'Lansia') NOT NULL,
    nama_pasien VARCHAR(100) NOT NULL,
    nik_pasien CHAR(16),
    umur_pasien VARCHAR(20) COMMENT 'Format: "6 bln" atau "2 thn"',
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
        REFERENCES pemeriksaan(id_pemeriksaan) ON DELETE CASCADE,
    
    INDEX idx_jenis_kunjungan (jenis_kunjungan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: audit_log_akses
-- Description: Login/access audit logs
-- =============================================================================
CREATE TABLE audit_log_akses (
    id_akses CHAR(36) NOT NULL PRIMARY KEY,
    id_user CHAR(36),
    username VARCHAR(50) NOT NULL,
    status ENUM('BERHASIL', 'GAGAL') NOT NULL,
    ip_address VARCHAR(45),
    tanggal_akses DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_akses_user FOREIGN KEY (id_user) 
        REFERENCES users(id_user) ON DELETE SET NULL,
    
    INDEX idx_tanggal_akses (tanggal_akses),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: audit_logs
-- Description: Data modification audit logs (CRUD)
-- =============================================================================
CREATE TABLE audit_logs (
    id_audit CHAR(36) NOT NULL PRIMARY KEY,
    id_user CHAR(36),
    action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    description VARCHAR(100) NOT NULL COMMENT 'Table name affected',
    id_data_terkait CHAR(36) NOT NULL COMMENT 'ID of affected record',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_log_user FOREIGN KEY (id_user) 
        REFERENCES users(id_user) ON DELETE SET NULL,
    
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: laporan
-- Description: Report summary data
-- =============================================================================
CREATE TABLE laporan (
    id_laporan CHAR(36) NOT NULL PRIMARY KEY,
    jenis_layanan VARCHAR(50) NOT NULL COMMENT 'Jenis layanan: ANC, KB, Imunisasi, Persalinan, Kunjungan Pasien, Semua',
    periode VARCHAR(20) NOT NULL COMMENT 'Format: MM/YYYY atau Bulan YYYY',
    tanggal_dibuat DATE NOT NULL,
    jumlah_pasien INT DEFAULT 0 COMMENT 'Total unique pasien dalam periode',
    jumlah_kunjungan INT DEFAULT 0 COMMENT 'Total kunjungan dalam periode',
    label VARCHAR(100) DEFAULT NULL COMMENT 'Label custom untuk laporan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_jenis_layanan (jenis_layanan),
    INDEX idx_periode (periode),
    INDEX idx_tanggal (tanggal_dibuat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SAMPLE DATA: Users
-- Password: "password123" (bcrypt hashed)
-- =============================================================================
INSERT INTO users (id_user, nama_lengkap, username, email, password, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Bidan Siti Nurhaliza', 'bidan_siti', 'siti.nurhaliza@bidanpintar.com', '$2b$10$rQZ8K3.Z9mZ3X3X3X3X3XO3X3X3X3X3X3X3X3X3X3X3X3X3X3X3X3', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Bidan Dewi Sartika', 'bidan_dewi', 'dewi.sartika@bidanpintar.com', '$2b$10$rQZ8K3.Z9mZ3X3X3X3X3XO3X3X3X3X3X3X3X3X3X3X3X3X3X3X3X3', 1),
('550e8400-e29b-41d4-a716-446655440003', 'Admin Klinik', 'admin', 'admin@bidanpintar.com', '$2b$10$rQZ8K3.Z9mZ3X3X3X3X3XO3X3X3X3X3X3X3X3X3X3X3X3X3X3X3X3', 1);

-- =============================================================================
-- SAMPLE DATA: Pasien
-- =============================================================================
INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Kartini Wijaya', '3201234567890001', 28, 'Jl. Merdeka No. 45, Bandung', '081234567890'),
('660e8400-e29b-41d4-a716-446655440002', 'Rahmawati Kusuma', '3201234567890002', 32, 'Jl. Sudirman No. 12, Jakarta', '081234567891'),
('660e8400-e29b-41d4-a716-446655440003', 'Sari Indah Permata', '3201234567890003', 25, 'Jl. Gatot Subroto No. 78, Surabaya', '081234567892'),
('660e8400-e29b-41d4-a716-446655440004', 'Fitri Handayani', '3201234567890004', 30, 'Jl. Ahmad Yani No. 33, Semarang', '081234567893'),
('660e8400-e29b-41d4-a716-446655440005', 'Rina Melati', '3201234567890005', 27, 'Jl. Diponegoro No. 56, Yogyakarta', '081234567894'),
('660e8400-e29b-41d4-a716-446655440006', 'Maya Anggraini', '3201234567890006', 35, 'Jl. Imam Bonjol No. 21, Malang', '081234567895'),
('660e8400-e29b-41d4-a716-446655440007', 'Putri Ayu Lestari', '3201234567890007', 29, 'Jl. Pahlawan No. 67, Medan', '081234567896'),
('660e8400-e29b-41d4-a716-446655440008', 'Wulan Sari', '3201234567890008', 24, 'Jl. Veteran No. 89, Makassar', '081234567897'),
('660e8400-e29b-41d4-a716-446655440009', 'Dian Permatasari', '3201234567890009', 31, 'Jl. Pemuda No. 34, Palembang', '081234567898'),
('660e8400-e29b-41d4-a716-446655440010', 'Nurul Hidayah', '3201234567890010', 26, 'Jl. Kartini No. 15, Denpasar', '081234567899');

-- =============================================================================
-- SAMPLE DATA: Jadwal
-- =============================================================================
INSERT INTO jadwal (id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ANC', '2025-12-16', '08:00:00', '08:30:00'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'KB', '2025-12-16', '09:00:00', '09:30:00'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Imunisasi', '2025-12-17', '08:00:00', '08:30:00'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Kunjungan Pasien', '2025-12-17', '10:00:00', '10:30:00'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'ANC', '2025-12-18', '08:00:00', '08:30:00');

-- =============================================================================
-- SAMPLE DATA: Pemeriksaan (Medical Examinations)
-- =============================================================================
INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan) VALUES
-- ANC Examinations
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'ANC', 
 'ANC Kunjungan. HPHT: 2025-06-01, HPL: 2026-03-08. Ibu merasa sehat, tidak ada keluhan berarti.',
 'Hasil Periksa: TD 110/70 mmHg, BB 58 kg, DJJ 140x/menit, TFU 20 cm.',
 'Kehamilan normal G1P0A0 UK 28 minggu',
 'Tindakan: Pemeriksaan rutin. Lanjutkan vitamin kehamilan, kontrol 2 minggu lagi.',
 '2025-12-01 08:30:00'),

('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', 'ANC',
 'ANC Kunjungan. HPHT: 2025-07-15, HPL: 2026-04-22. Keluhan mual di pagi hari.',
 'Hasil Periksa: TD 120/80 mmHg, BB 52 kg, DJJ 145x/menit, TFU 18 cm.',
 'Kehamilan normal G2P1A0 UK 22 minggu dengan morning sickness',
 'Tindakan: Edukasi diet. Vitamin B6 untuk mual, istirahat cukup.',
 '2025-12-05 09:00:00'),

-- KB Examinations
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'KB',
 'Kunjungan KB. Keluhan: Tidak ada keluhan berarti',
 'TD Ibu: 120/80 mmHg, BB Ibu: 55 kg. Hasil Periksa: Kondisi baik',
 'Akseptor KB aktif - Suntik 3 bulan',
 'Lanjutkan KB suntik, kontrol 3 bulan lagi',
 '2025-12-03 10:00:00'),

('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440006', 'KB',
 'Kunjungan KB. Keluhan: Ingin ganti metode KB',
 'TD Ibu: 115/75 mmHg, BB Ibu: 60 kg. Hasil Periksa: Tidak ada kontraindikasi IUD',
 'Konseling pergantian metode KB',
 'Pemasangan IUD dijadwalkan minggu depan setelah menstruasi',
 '2025-12-07 11:00:00'),

-- Imunisasi Examinations
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'Imunisasi',
 'Kunjungan Imunisasi. Bayi: Ahmad Fauzan. Bayi sehat, tidak ada demam.',
 'Jenis Imunisasi: DPT-HB-Hib 1. BB: 5.5 kg, TB: 58 cm. Kondisi bayi baik.',
 'Bayi sehat, layak imunisasi',
 'Pengobatan: Tidak ada. Jadwal Selanjutnya: 2026-01-10. Observasi 30 menit pasca imunisasi.',
 '2025-12-10 08:00:00'),

('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440008', 'Imunisasi',
 'Kunjungan Imunisasi. Bayi: Zahra Putri. Jadwal imunisasi campak.',
 'Jenis Imunisasi: Campak. BB: 8.2 kg, TB: 72 cm. Kondisi bayi sehat.',
 'Bayi sehat, layak imunisasi campak',
 'Pengobatan: Tidak ada. Jadwal Selanjutnya: 2026-02-01. Edukasi KIPI.',
 '2025-12-11 09:00:00'),

-- Persalinan Examinations
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 'Persalinan',
 'Persalinan Anak ke-2. Ibu datang dengan kontraksi teratur.',
 'TD Ibu: 120/80 mmHg, BB Ibu: 65 kg. Hasil persalinan: Spontan. BB Bayi: 3200g.',
 'Persalinan normal, ibu dan bayi sehat',
 'IMD dilakukan, rawat gabung, kontrol nifas 3 hari',
 '2025-12-08 14:30:00'),

-- Kunjungan Pasien Examinations
('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440007', 'Kunjungan Pasien',
 'Keluhan: Batuk dan pilek pada bayi usia 8 bulan',
 'BB: 7.5 kg, TD: -',
 'ISPA ringan',
 'Terapi: Paracetamol sirup 3x0.5ml, Ambroxol sirup 2x2.5ml. Banyak minum ASI.',
 '2025-12-09 10:00:00'),

('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', 'Kunjungan Pasien',
 'Keluhan: Konsultasi tumbuh kembang bayi',
 'BB: 9.0 kg, TD: -',
 'Tumbuh kembang sesuai usia',
 'Terapi: Tidak ada. Lanjutkan ASI eksklusif, stimulasi sesuai usia.',
 '2025-12-12 11:00:00'),

('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 'Kunjungan Pasien',
 'Keluhan: Ruam popok pada bayi',
 'BB: 6.8 kg, TD: -',
 'Dermatitis popok',
 'Terapi: Salep zinc oxide, ganti popok lebih sering, jaga kebersihan.',
 '2025-12-13 09:30:00');

-- =============================================================================
-- SAMPLE DATA: Layanan KB
-- =============================================================================
INSERT INTO layanan_kb (id_kb, id_pemeriksaan, nomor_registrasi_lama, nomor_registrasi_baru, metode, td_ibu, bb_ibu, nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah, kunjungan_ulang, catatan) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 'KB-2024-001', 'KB-2025-001', 'Suntik KB', '120/80', 55.00, 'Ahmad Hidayat', '3201234567890102', 35, '130/85', 70.00, '2026-03-03', 'Akseptor aktif sejak 2022'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', NULL, 'KB-2025-002', 'IUD', '115/75', 60.00, 'Budi Santoso', '3201234567890106', 38, '125/80', 75.00, '2026-01-07', 'Konseling pergantian metode dari pil ke IUD');

-- =============================================================================
-- SAMPLE DATA: Layanan ANC
-- =============================================================================
INSERT INTO layanan_anc (id_anc, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, hpht, hpl, hasil_pemeriksaan, tindakan, keterangan) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'ANC-2025-001', 'ANC-2025-001', 'Deni Kurniawan', '3201234567890101', 30, '2025-06-01', '2026-03-08', 'Kehamilan normal, DJJ baik, TFU sesuai usia kehamilan', 'Pemeriksaan rutin ANC', 'Kontrol rutin 2 minggu sekali'),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', NULL, 'ANC-2025-002', 'Eko Prasetyo', '3201234567890105', 32, '2025-07-15', '2026-04-22', 'Kehamilan normal dengan keluhan mual', 'Edukasi diet dan pemberian vitamin B6', 'Morning sickness, perlu follow up');

-- =============================================================================
-- SAMPLE DATA: Layanan Imunisasi
-- =============================================================================
INSERT INTO layanan_imunisasi (id_imunisasi, id_pemeriksaan, no_reg, nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi, jenis_imunisasi, pengobatan, jadwal_selanjutnya, no_hp_kontak) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440005', 'IMN-2025-001', 'Ahmad Fauzan', '2025-10-01', 58.00, 5.50, 'DPT-HB-Hib 1', NULL, '2026-01-10', '081234567892'),
('bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440006', 'IMN-2025-002', 'Zahra Putri', '2025-03-15', 72.00, 8.20, 'Campak', NULL, '2026-02-01', '081234567897');

-- =============================================================================
-- SAMPLE DATA: Layanan Persalinan
-- =============================================================================
INSERT INTO layanan_persalinan (id_persalinan, id_pemeriksaan, no_reg_lama, no_reg_baru, penolong, nama_suami, nik_suami, umur_suami, td_ibu, bb_ibu, tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan, as_bayi, bb_bayi, pb_bayi, lila_ibu, lida_ibu, lika_bayi) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440007', 'PSL-2024-001', 'PSL-2025-001', 'Bidan Siti Nurhaliza', 'Fajar Ramadhan', '3201234567890104', 33, '120/80', 65.00, '2025-12-08', 'L', 2, 'Spontan Normal', 1, '8/9', 3200.00, 49.00, 26.50, 88.00, 33.00);

-- =============================================================================
-- SAMPLE DATA: Layanan Kunjungan Pasien
-- =============================================================================
INSERT INTO layanan_kunjungan_pasien (id_kunjungan, id_pemeriksaan, tanggal, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440008', '2025-12-09', 'KP-2025-001', 'Bayi/Anak', 'Rafi Pratama', '3201234567890207', 8, 7.50, NULL, 'Putri Ayu Lestari', '3201234567890007', 29, 'Batuk dan pilek', 'ISPA ringan', 'Paracetamol sirup 3x0.5ml, Ambroxol sirup 2x2.5ml', 'Observasi di rumah, kembali jika demam tinggi'),
('dd0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440009', '2025-12-12', 'KP-2025-002', 'Bayi/Anak', 'Keyla Azzahra', '3201234567890209', 10, 9.00, NULL, 'Dian Permatasari', '3201234567890009', 31, 'Konsultasi tumbuh kembang', 'Tumbuh kembang sesuai usia', NULL, 'Lanjutkan ASI, stimulasi sesuai usia'),
('dd0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440010', '2025-12-13', 'KP-2025-003', 'Bayi/Anak', 'Arya Putra', '3201234567890210', 5, 6.80, NULL, 'Nurul Hidayah', '3201234567890010', 26, 'Ruam popok', 'Dermatitis popok', 'Salep zinc oxide', 'Jaga kebersihan area popok');

-- =============================================================================
-- SAMPLE DATA: Audit Log Akses
-- =============================================================================
INSERT INTO audit_log_akses (id_akses, id_user, username, status, ip_address, tanggal_akses) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'bidan_siti', 'BERHASIL', '192.168.1.100', '2025-12-14 07:30:00'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'bidan_dewi', 'BERHASIL', '192.168.1.101', '2025-12-14 07:45:00'),
('ee0e8400-e29b-41d4-a716-446655440003', NULL, 'unknown_user', 'GAGAL', '192.168.1.200', '2025-12-14 08:00:00'),
('ee0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'admin', 'BERHASIL', '192.168.1.102', '2025-12-14 08:15:00');

-- =============================================================================
-- SAMPLE DATA: Audit Logs
-- =============================================================================
INSERT INTO audit_logs (id_audit, id_user, action, description, id_data_terkait, created_at) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'pemeriksaan', '880e8400-e29b-41d4-a716-446655440001', '2025-12-01 08:30:00'),
('ff0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'layanan_anc', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-12-01 08:30:00'),
('ff0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'layanan_kb', '990e8400-e29b-41d4-a716-446655440001', '2025-12-03 10:00:00'),
('ff0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'CREATE', 'layanan_imunisasi', 'bb0e8400-e29b-41d4-a716-446655440001', '2025-12-10 08:00:00'),
('ff0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'CREATE', 'layanan_persalinan', 'cc0e8400-e29b-41d4-a716-446655440001', '2025-12-08 14:30:00'),
('ff0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'layanan_kunjungan_pasien', 'dd0e8400-e29b-41d4-a716-446655440001', '2025-12-09 10:00:00');

-- =============================================================================
-- SAMPLE DATA: Laporan
-- =============================================================================
INSERT INTO laporan (id_laporan, jenis_layanan, periode, tanggal_dibuat, jumlah_pasien, jumlah_kunjungan, label) VALUES
('110e8400-e29b-41d4-a716-446655440001', 'ANC', '01/2025', '2025-01-31', 45, 120, 'Laporan ANC Januari 2025'),
('110e8400-e29b-41d4-a716-446655440002', 'KB', '01/2025', '2025-01-31', 30, 45, 'Laporan KB Januari 2025'),
('110e8400-e29b-41d4-a716-446655440003', 'Imunisasi', '02/2025', '2025-02-28', 25, 50, 'Laporan Imunisasi Februari 2025'),
('110e8400-e29b-41d4-a716-446655440004', 'Persalinan', '02/2025', '2025-02-28', 15, 15, 'Laporan Persalinan Februari 2025'),
('110e8400-e29b-41d4-a716-446655440005', 'Kunjungan Pasien', '03/2025', '2025-03-31', 60, 85, 'Laporan Kunjungan Maret 2025'),
('110e8400-e29b-41d4-a716-446655440006', 'ANC', '04/2025', '2025-04-30', 52, 138, 'Laporan ANC April 2025'),
('110e8400-e29b-41d4-a716-446655440007', 'KB', '04/2025', '2025-04-30', 35, 52, 'Laporan KB April 2025'),
('110e8400-e29b-41d4-a716-446655440008', 'Semua', '05/2025', '2025-05-31', 180, 450, 'Laporan Lengkap Mei 2025'),
('110e8400-e29b-41d4-a716-446655440009', 'ANC', '11/2025', '2025-11-30', 48, 125, 'Laporan ANC November 2025'),
('110e8400-e29b-41d4-a716-446655440010', 'Imunisasi', '12/2025', '2025-12-17', 28, 56, 'Laporan Imunisasi Desember 2025 (In Progress)');

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Uncomment to verify data after import:

-- SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
-- UNION ALL SELECT 'Pasien', COUNT(*) FROM pasien
-- UNION ALL SELECT 'Jadwal', COUNT(*) FROM jadwal
-- UNION ALL SELECT 'Pemeriksaan', COUNT(*) FROM pemeriksaan
-- UNION ALL SELECT 'Layanan KB', COUNT(*) FROM layanan_kb
-- UNION ALL SELECT 'Layanan ANC', COUNT(*) FROM layanan_anc
-- UNION ALL SELECT 'Layanan Imunisasi', COUNT(*) FROM layanan_imunisasi
-- UNION ALL SELECT 'Layanan Persalinan', COUNT(*) FROM layanan_persalinan
-- UNION ALL SELECT 'Layanan Kunjungan', COUNT(*) FROM layanan_kunjungan_pasien
-- UNION ALL SELECT 'Audit Log Akses', COUNT(*) FROM audit_log_akses
-- UNION ALL SELECT 'Audit Logs', COUNT(*) FROM audit_logs
-- UNION ALL SELECT 'Laporan', COUNT(*) FROM laporan;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
