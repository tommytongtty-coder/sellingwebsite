const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mysql: {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '8889', 10),
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'marketplace',
    ssl: String(process.env.MYSQL_SSL || process.env.DB_SSL || '').toLowerCase() === 'true',
  },
  jwtSecret: process.env.JWT_SECRET || 'marketplace-dev-secret-key-change-in-production',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    clientId: process.env.STRIPE_CLIENT_ID || 'ca_placeholder',
  },
};

export default config;
