const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', '.env');
const dotenvResult = require('dotenv').config({ path: envPath });

if (dotenvResult.error) {
  console.log(`[env] could not load ${envPath}: ${dotenvResult.error.message}`);
} else {
  console.log(`[env] loaded ${envPath}`);
}

console.log(`[env] MYSQL_HOST=${process.env.MYSQL_HOST || process.env.DB_HOST || 'NOT SET'}`);
console.log(`[env] MYSQL_PORT=${process.env.MYSQL_PORT || process.env.DB_PORT || 'NOT SET'}`);
console.log(`[env] MYSQL_DATABASE=${process.env.MYSQL_DATABASE || process.env.DB_NAME || 'NOT SET'}`);
console.log(`[env] .env exists=${fs.existsSync(envPath)}`);

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.generated.js');
