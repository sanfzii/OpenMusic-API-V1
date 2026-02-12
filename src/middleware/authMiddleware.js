const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../tokenize/TokenManager');

// middleware buat ngecek apakah request punya token yang valid
// kalo valid, userId dari token disimpan di req.auth.credentials.id
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // cek dulu ada header Authorization-nya atau enggak
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Anda tidak memiliki akses. Silakan login terlebih dahulu.');
    }

    // ambil token-nya (yang setelah "Bearer ")
    const token = authHeader.split(' ')[1];
    const payload = TokenManager.verifyAccessToken(token);

    // simpan data user dari token biar bisa dipake di handler
    req.auth = {
      credentials: {
        id: payload.userId,
      },
    };

    next();
  } catch (error) {
    // kalo error-nya dari verifyAccessToken, ubah jadi AuthenticationError biar status code-nya 401
    if (error.name === 'InvariantError') {
      return next(new AuthenticationError('Access token tidak valid'));
    }
    next(error);
  }
};

module.exports = authMiddleware;
