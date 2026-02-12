/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

// utility buat urusan JWT token (bikin & verifikasi)
const TokenManager = {
  // bikin access token, ada expiry-nya (default 1800 detik / 30 menit)
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: Number(process.env.ACCESS_TOKEN_AGE) || 1800 }),

  // bikin refresh token, ini gak ada expiry-nya
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  // cek refresh token masih valid atau enggak
  verifyRefreshToken: (token) => {
    try {
      const artifacts = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return artifacts;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

  // cek access token, dipake di middleware auth
  verifyAccessToken: (token) => {
    try {
      const artifacts = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return artifacts;
    } catch (error) {
      throw new InvariantError('Access token tidak valid');
    }
  },
};

module.exports = TokenManager;
