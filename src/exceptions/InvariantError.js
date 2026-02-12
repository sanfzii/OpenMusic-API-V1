const ClientError = require('./ClientError');
// error buat validasi / data yang salah, status code 400
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}
module.exports = InvariantError;