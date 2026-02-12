const Joi = require('joi');

// aturan validasi buat data album (name wajib string, year wajib angka)
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };