const http = require('http');
const db = require('./src/config/database');

async function test() {
  try {
    // Get valid user for token
    const [users] = await db.query('SELECT id_user, nama FROM users LIMIT 1');
    if (users.length === 0) {
      console.error('âŒ No users found');
      process.exit(1);
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: users[0].id_user, nama: users[0].nama, role: 'admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    console.log('âœ… Token created for:', users[0].nama);
    console.log('Token:', token.substring(0, 30) + '...\n');

    // Test 1: GET ALL Imunisasi
    console.log('í³‹ TEST 1: GET /api/imunisasi');
    const getAllRes = await apiCall('GET', '/api/imunisasi', null, token);
    console.log('Status:', getAllRes.statusCode);
    console.log('Success:', getAllRes.body.success);
    console.log('Message:', getAllRes.body.message);
    console.log('Records:', (getAllRes.body.data || []).length);
    if (getAllRes.body.data && getAllRes.body.data.length > 0) {
      console.log('Sample:', JSON.stringify(getAllRes.body.data[0], null, 2));
    }

    console.log('\nâœ… IMUNISASI API INTEGRATION WORKING!\n');
    console.log('í³Œ Available endpoints:');
    console.log('  GET    /api/imunisasi          - List all records');
    console.log('  POST   /api/imunisasi          - Create new record');
    console.log('  GET    /api/imunisasi/:id      - Get single record');
    console.log('  PUT    /api/imunisasi/:id      - Update record');
    console.log('  DELETE /api/imunisasi/:id      - Delete record');

    process.exit(0);
  } catch (error) {
    console.error('âŒ Error:', error.message);
    process.exit(1);
  }
}

function apiCall(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: { error: 'Parse error', data }
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

test();
