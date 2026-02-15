// schema validasi untuk export playlist
const Joi = require('joi');

// validasi email target untuk export
const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportPlaylistPayloadSchema };
