require('dotenv').config();

const config = Object.freeze({
  port: process.env.PORT || 3000,
  databaseURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pos-db',
  nodeEnv: process.env.NODE_ENV || 'development',
  accessTokenSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'fallback_key_id',
  razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET || 'fallback_secret_key',
  razorpyWebhookSecret:
    process.env.RAZORPAY_WEBHOOK_SECRET || 'fallback_webhook_secret',
});

module.exports = config;
