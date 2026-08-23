const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '8889', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'marketplace',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    clientId: process.env.STRIPE_CLIENT_ID || 'ca_placeholder',
  },
};

export default config;
