/**
 * Test KB API endpoints
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtYSI6IkFkbWluIiwicm9sZSI6ImFkbWluIn0.mock_token';

async function testKBAPI() {
  try {
    console.log('🔍 Testing KB API Endpoints\n');

    // Test getAllKB
    console.log('1️⃣ Testing GET /api/kb (list all KB records)');
    const listResponse = await fetch(`${API_BASE}/kb`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const listData = await listResponse.json();
    console.log(`   Status: ${listResponse.status}`);
    console.log(`   Response: ${JSON.stringify(listData, null, 2)}\n`);

    if (listData.success && listData.data && listData.data.length > 0) {
      const firstKBId = listData.data[0].id_pemeriksaan;
      
      // Test getKBById
      console.log(`2️⃣ Testing GET /api/kb/:id (get KB by ID: ${firstKBId})`);
      const detailResponse = await fetch(`${API_BASE}/kb/${firstKBId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      const detailData = await detailResponse.json();
      console.log(`   Status: ${detailResponse.status}`);
      console.log(`   Response: ${JSON.stringify(detailData, null, 2)}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testKBAPI();
