/**
 * Database Configuration
 * MySQL connection pool setup with promise support
 */

const mysql = require('mysql2');
require('dotenv').config();

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aplikasi_bidan',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  timezone: '+00:00',
  // Enable multiple statements for migrations/setup
  multipleStatements: false,
  // Better handling of dates
  dateStrings: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.code);
    console.error('   Message:', err.message);
    
    // Provide helpful error messages
    if (err.code === 'ECONNREFUSED') {
      console.error('   → Make sure MySQL server is running');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Check your database credentials');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Database does not exist');
    }
  } else {
    console.log('✅ Connected to MySQL Database:', dbConfig.database);
    connection.release();
  }
});

// Export promise-based pool for async/await support
module.exports = pool.promise();