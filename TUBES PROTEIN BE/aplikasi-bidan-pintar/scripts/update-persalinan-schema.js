const db = require('../src/config/database');

async function updateSchema() {
    const connection = await db.getConnection();
    try {
        console.log('Running schema update for layanan_persalinan...');

        // Check if columns exist
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'aplikasi_bidan' 
      AND TABLE_NAME = 'layanan_persalinan' 
      AND COLUMN_NAME IN ('td_ibu', 'bb_ibu')
    `);

        const existingColumns = columns.map(c => c.COLUMN_NAME);

        if (!existingColumns.includes('td_ibu')) {
            console.log('Adding column td_ibu...');
            await connection.query(`
        ALTER TABLE layanan_persalinan 
        ADD COLUMN td_ibu VARCHAR(20) AFTER umur_suami
      `);
            console.log('Column td_ibu added.');
        } else {
            console.log('Column td_ibu already exists.');
        }

        if (!existingColumns.includes('bb_ibu')) {
            console.log('Adding column bb_ibu...');
            await connection.query(`
        ALTER TABLE layanan_persalinan 
        ADD COLUMN bb_ibu DECIMAL(5,2) AFTER td_ibu
      `);
            console.log('Column bb_ibu added.');
        } else {
            console.log('Column bb_ibu already exists.');
        }

        console.log('Schema update completed successfully.');

    } catch (error) {
        console.error('Schema update failed:', error);
    } finally {
        connection.release();
        process.exit();
    }
}

updateSchema();
