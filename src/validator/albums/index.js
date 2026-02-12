const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

// validasi payload album, kalo gak sesuai schema langsung error
const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;