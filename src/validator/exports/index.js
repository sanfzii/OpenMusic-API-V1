const InvariantError = require('../../exceptions/InvariantError');
const { ExportPlaylistPayloadSchema } = require('./schema');

// validator buat export playlist (cuma validasi email)
const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
