-- =============================================================================
-- Add Laporan Table - Database Migration Script
-- Version: 1.1.0
-- Database: MySQL 8.0+
-- Created: December 17, 2025
-- Description: Menambahkan tabel laporan untuk menyimpan summary laporan
-- =============================================================================

USE aplikasi_bidan;

-- =============================================================================
-- TABLE: laporan
-- Description: Report summary data
-- =============================================================================
CREATE TABLE IF NOT EXISTS laporan (
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
-- VERIFICATION QUERY
-- =============================================================================
-- Verify table and data
SELECT 
    id_laporan,
    jenis_layanan,
    periode,
    tanggal_dibuat,
    jumlah_pasien,
    jumlah_kunjungan,
    label
FROM laporan
ORDER BY tanggal_dibuat DESC;

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to count unique patients and visits for a period
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS sp_generate_laporan_summary(
    IN p_jenis_layanan VARCHAR(50),
    IN p_bulan INT,
    IN p_tahun INT
)
BEGIN
    DECLARE v_jumlah_pasien INT;
    DECLARE v_jumlah_kunjungan INT;
    
    -- Count unique patients and total visits
    SELECT 
        COUNT(DISTINCT p.id_pasien),
        COUNT(pe.id_pemeriksaan)
    INTO v_jumlah_pasien, v_jumlah_kunjungan
    FROM pemeriksaan pe
    JOIN pasien p ON pe.id_pasien = p.id_pasien
    WHERE 
        (p_jenis_layanan = 'Semua' OR pe.jenis_layanan = p_jenis_layanan)
        AND MONTH(pe.tanggal_pemeriksaan) = p_bulan
        AND YEAR(pe.tanggal_pemeriksaan) = p_tahun;
    
    -- Return result
    SELECT v_jumlah_pasien AS jumlah_pasien, v_jumlah_kunjungan AS jumlah_kunjungan;
END$$

DELIMITER ;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
