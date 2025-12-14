/**
 * Laporan Service - Report API calls
 */

import { downloadFile } from './api';

/**
 * Download monthly report in Excel format
 * @param {number} bulan - Month (1-12)
 * @param {number} tahun - Year
 * @returns {Promise<void>}
 */
export const downloadLaporanBulanan = async (bulan, tahun) => {
  const params = new URLSearchParams({
    format: 'excel',
    bulan: bulan.toString(),
    tahun: tahun.toString(),
  });
  
  const filename = `Laporan_Detil_${String(bulan).padStart(2, '0')}_${tahun}.xlsx`;
  return downloadFile(`/laporan?${params.toString()}`, filename);
};

export default {
  downloadLaporanBulanan,
};
