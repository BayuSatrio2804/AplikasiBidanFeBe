-- Migration: Add time columns for automatic schedules

ALTER TABLE layanan_anc
ADD COLUMN jam_hpl TIME DEFAULT '08:00:00';

ALTER TABLE layanan_kb
ADD COLUMN jam_kunjungan_ulang TIME DEFAULT '08:00:00';

ALTER TABLE layanan_imunisasi
ADD COLUMN jam_jadwal_selanjutnya TIME DEFAULT '09:00:00';
