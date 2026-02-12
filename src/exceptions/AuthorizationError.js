const ClientError = require('./ClientError');

// error kalo user coba akses resource yang bukan haknya, status code 403
class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
