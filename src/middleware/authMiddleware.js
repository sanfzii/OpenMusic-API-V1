const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../tokenize/TokenManager');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Anda tidak memiliki akses. Silakan login terlebih dahulu.');
    }

    const token = authHeader.split(' ')[1];
    const payload = TokenManager.verifyAccessToken(token);

    // Simpan credential user di request
    req.auth = {
      credentials: {
        id: payload.userId,
      },
    };

    next();
  } catch (error) {
    // Jika error dari verifyAccessToken (InvariantError), ubah jadi AuthenticationError
    if (error.name === 'InvariantError') {
      return next(new AuthenticationError('Access token tidak valid'));
    }
    next(error);
  }
};

module.exports = authMiddleware;
