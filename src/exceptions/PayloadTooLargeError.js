const ClientError = require('./ClientError');

// error untuk file upload yang terlalu besar (> max file size)
class PayloadTooLargeError extends ClientError {
  constructor(message) {
    super(message, 413);
    this.name = 'PayloadTooLargeError';
  }
}

module.exports = PayloadTooLargeError;
