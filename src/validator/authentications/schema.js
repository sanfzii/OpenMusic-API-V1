const Joi = require('joi');

// schema buat login (username + password)
const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// schema buat refresh access token (kirim refreshToken)
const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// schema buat logout (kirim refreshToken yang mau dihapus)
const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
