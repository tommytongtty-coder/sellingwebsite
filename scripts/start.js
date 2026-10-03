require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.generated.js');
