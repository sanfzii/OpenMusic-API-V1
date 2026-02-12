const ClientError = require('./ClientError');

// error kalo user belum login atau token-nya invalid, status code 401
class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
