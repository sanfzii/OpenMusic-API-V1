const Joi = require('joi');

// schema buat nambah/hapus kolaborator (playlistId + userId)
const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
