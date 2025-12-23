const persalinanService = require('../src/services/persalinan.service');
const db = require('../src/config/database');
const { v4: uuidv4 } = require('uuid');

async function testPersalinanCRUD() {
    console.log('Starting Persalinan CRUD Test...');
    const userId = '550e8400-e29b-41d4-a716-446655440003'; // Admin user ID from init.sql
    let createdId = null;

    try {
        // 1. Test Create
        console.log('\n1. Testing Create...');
        const createData = {
            nama_istri: 'Test Istri',
            nik_istri: '1234567890123456',
            umur_istri: 25,
            alamat: 'Jl. Test',
            no_hp: '08123456789',
            td_ibu: '120/80',
            bb_ibu: 65.5,
            lila_ibu: 23.5,
            lida_ibu: 80,
            tanggal: '2025-12-23',
            penolong: 'Bidan Test',
            no_reg_lama: '',
            no_reg_baru: 'REG-TEST-001',
            nama_suami: 'Test Suami',
            nik_suami: '1234567890123457',
            umur_suami: 30,
            tanggal_lahir: '2025-12-23',
            jenis_kelamin: 'L',
            anak_ke: 1,
            jenis_partus: 'Spontan Normal',
            imd_dilakukan: true,
            as_bayi: '8/9',
            bb_bayi: 3000,
            pb_bayi: 50,
            lika_bayi: 33
        };

        const createResult = await persalinanService.createRegistrasiPersalinan(createData, userId);
        createdId = createResult.id_pemeriksaan;
        console.log('Create success. ID:', createdId);

        // 2. Test Get by ID
        console.log('\n2. Testing Get by ID...');
        const record = await persalinanService.getPersalinanById(createdId);

        if (!record) throw new Error('Record not found after create');

        console.log('Fetched record:', {
            td_ibu: record.td_ibu,
            bb_ibu: record.bb_ibu
        });

        if (record.td_ibu !== '120/80') throw new Error(`TD Ibu mismatch. Expected 120/80, got ${record.td_ibu}`);
        if (parseFloat(record.bb_ibu) !== 65.5) throw new Error(`BB Ibu mismatch. Expected 65.5, got ${record.bb_ibu}`);
        console.log('Verification Passed: TD and BB stored correctly.');

        // 3. Test Update
        console.log('\n3. Testing Update...');
        const updateData = {
            ...createData,
            td_ibu: '110/70',
            bb_ibu: 66.0
        };

        await persalinanService.updateRegistrasiPersalinan(createdId, updateData, userId);
        const updatedRecord = await persalinanService.getPersalinanById(createdId);

        console.log('Fetched updated record:', {
            td_ibu: updatedRecord.td_ibu,
            bb_ibu: updatedRecord.bb_ibu
        });

        if (updatedRecord.td_ibu !== '110/70') throw new Error(`Update failed. Expected 110/70, got ${updatedRecord.td_ibu}`);
        if (parseFloat(updatedRecord.bb_ibu) !== 66.0) throw new Error(`Update failed. Expected 66.0, got ${updatedRecord.bb_ibu}`);
        console.log('Verification Passed: Updates reflected correctly.');

        // 4. Test Delete
        console.log('\n4. Testing Delete...');
        await persalinanService.deleteRegistrasiPersalinan(createdId, userId);

        const deletedRecord = await persalinanService.getPersalinanById(createdId);
        if (deletedRecord) throw new Error('Delete failed. Record still exists.');
        console.log('Verification Passed: Record deleted.');

        console.log('\nALL TESTS PASSED SUCCESSFULLY!');

    } catch (error) {
        console.error('\nTEST FAILED:', error.message);
        if (createdId) {
            // cleanup attempt
            try {
                await persalinanService.deleteRegistrasiPersalinan(createdId, userId);
            } catch (e) { }
        }
    } finally {
        const conn = await db.getConnection();
        conn.release(); // release any held connection
        process.exit();
    }
}

testPersalinanCRUD();
