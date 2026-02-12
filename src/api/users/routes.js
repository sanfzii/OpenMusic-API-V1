// route buat endpoint /users (registrasi, gak butuh auth)
const express = require('express');

const routes = (handler) => {
  const router = express.Router();

  router.post('/', handler.postUserHandler);

  return router;
};

module.exports = routes;
