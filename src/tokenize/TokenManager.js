const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: Number(process.env.ACCESS_TOKEN_AGE) || 1800 }),

  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (token) => {
    try {
      const artifacts = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return artifacts;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

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
