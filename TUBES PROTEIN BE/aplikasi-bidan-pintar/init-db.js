/**
 * Database Initialization Script
 * Reads and executes init.sql to reinitialize database schema
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    console.log('🔄 Connecting to MySQL server...');
    
    // Connect to MySQL without selecting database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server\n');

    // Read init.sql file
    const initSqlPath = path.join(__dirname, 'database', 'init.sql');
    console.log(`📂 Reading init.sql from: ${initSqlPath}`);
    
    if (!fs.existsSync(initSqlPath)) {
      throw new Error(`init.sql not found at ${initSqlPath}`);
    }

    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    console.log('✅ init.sql file loaded\n');

    // Execute init.sql
    console.log('🔄 Executing database initialization...');
    await connection.query(initSql);
    console.log('✅ Database initialized successfully!\n');

    // Verify database
    console.log('📋 Verifying tables...');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'aplikasi_bidan'}'`
    );
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    console.log('\n✅ Database initialization complete!');
    console.log('💡 Ready to run: npm start\n');

  } catch (error) {
    console.error('❌ Error initializing database:');
    console.error('   ', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
