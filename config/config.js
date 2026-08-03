const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketplace-template',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    clientId: process.env.STRIPE_CLIENT_ID || 'ca_placeholder',
  },
};

export default config;
