const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
  console.log('✓ Loaded .env.local');
}

console.log('🔍 Testing Database Connection...\n');
console.log('Database URL:', process.env.DATABASE_URL ? '✓ Found' : '❌ Not found\n');

// Try to read certificate
let ca;
try {
  const certPath = path.join(__dirname, 'lib', 'rds-ca-bundle.pem');
  if (fs.existsSync(certPath)) {
    ca = fs.readFileSync(certPath, 'utf8');
    console.log('✓ Certificate file found');
  } else {
    console.log('⚠️  Certificate file not found');
  }
} catch (error) {
  console.log('⚠️  Error reading certificate:', error.message);
}

// Test 1: With certificate and SSL verification
console.log('\n📋 Test 1: With SSL verification (rejectUnauthorized: true)');
const pool1 = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ca ? { ca, rejectUnauthorized: true } : undefined,
});

pool1.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.log('❌ Failed:', err.message.substring(0, 100));
  } else {
    console.log('✅ Connected! Server time:', result.rows[0].now);
  }
  pool1.end();

  // Test 2: Without SSL verification
  setTimeout(() => {
    console.log('\n📋 Test 2: Without SSL verification (rejectUnauthorized: false)');
    const pool2 = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    pool2.query('SELECT NOW()', (err, result) => {
      if (err) {
        console.log('❌ Failed:', err.message.substring(0, 100));
      } else {
        console.log('✅ Connected! Server time:', result.rows[0].now);
      }
      pool2.end();

      // Test 3: Connection string without SSL
      setTimeout(() => {
        console.log('\n📋 Test 3: Without SSL (sslmode=disable)');
        const connStr = process.env.DATABASE_URL.replace('?sslmode=require', '?sslmode=disable');
        const pool3 = new Pool({
          connectionString: connStr,
        });

        pool3.query('SELECT NOW()', (err, result) => {
          if (err) {
            console.log('❌ Failed:', err.message.substring(0, 100));
          } else {
            console.log('✅ Connected! Server time:', result.rows[0].now);
          }
          pool3.end();

          console.log('\n✅ Tests completed!');
          process.exit(0);
        });
      }, 1000);
    });
  }, 1000);
});

setTimeout(() => {
  console.log('\n⏱️  Connection test timeout - database may not be accessible');
  process.exit(1);
}, 30000);
