const ClientError = require('./ClientError');
// error kalo resource yang dicari gak ketemu, status code 404
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
module.exports = NotFoundError;