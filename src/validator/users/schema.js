const Joi = require('joi');

// aturan validasi data user (username, password, fullname wajib diisi)
const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
