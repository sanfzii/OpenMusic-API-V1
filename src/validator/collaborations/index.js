const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

// validasi payload kolaborasi
const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
