const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
});

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.generated.js');
