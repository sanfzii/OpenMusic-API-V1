// config.js - central configuration untuk semua environment variables
// memudahkan akses konfigurasi dari berbagai service

require('dotenv').config();

const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5001,
  },
  database: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER || 'amqp://localhost',
  },
  redis: {
    host: process.env.REDIS_SERVER || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  upload: {
    directory: process.env.UPLOAD_DIR || './uploads/images/',
    maxFileSize: process.env.MAX_FILE_SIZE || 512000, // 512KB default
  },
};

module.exports = config;

