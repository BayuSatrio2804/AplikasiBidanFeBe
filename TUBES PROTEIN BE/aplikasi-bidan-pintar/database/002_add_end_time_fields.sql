-- =============================================================================
-- Migration: Add End Time Fields for Schedule Appointments
-- Date: 2025-12-30
-- Description: Add jam_selesai columns to layanan_anc, layanan_kb, and layanan_imunisasi
--              to allow flexible appointment duration instead of fixed 1-hour default
-- =============================================================================

USE aplikasi_bidan;

-- Add jam_hpl_selesai to layanan_anc
ALTER TABLE layanan_anc 
ADD COLUMN jam_hpl_selesai TIME DEFAULT NULL 
COMMENT 'Jam selesai HPL (opsional, jika NULL maka otomatis +1 jam dari jam_hpl)'
AFTER jam_hpl;

-- Add jam_kunjungan_ulang_selesai to layanan_kb
ALTER TABLE layanan_kb 
ADD COLUMN jam_kunjungan_ulang_selesai TIME DEFAULT NULL 
COMMENT 'Jam selesai kunjungan ulang (opsional, jika NULL maka otomatis +1 jam)'
AFTER jam_kunjungan_ulang;

-- Add jam_jadwal_selanjutnya_selesai to layanan_imunisasi
ALTER TABLE layanan_imunisasi 
ADD COLUMN jam_jadwal_selanjutnya_selesai TIME DEFAULT NULL 
COMMENT 'Jam selesai jadwal selanjutnya (opsional, jika NULL maka otomatis +1 jam)'
AFTER jam_jadwal_selanjutnya;

-- Verify the changes
SELECT 'Migration completed successfully' AS status;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
