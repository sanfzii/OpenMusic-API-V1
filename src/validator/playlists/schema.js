const Joi = require('joi');

// schema buat bikin playlist (cuma butuh nama)
const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

// schema buat nambah/hapus lagu dari playlist (cuma butuh songId)
const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema };
