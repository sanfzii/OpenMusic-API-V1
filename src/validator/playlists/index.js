const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');

// validasi payload playlist (ada 2: bikin playlist & kelola lagu)
const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
