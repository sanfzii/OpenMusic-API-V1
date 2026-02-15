// routes untuk endpoint /albums/:id/likes (butuh authentication)
const express = require('express');
const router = express.Router();

const routes = (handler, authenticator) => {
  // semua endpoint likes butuh authentication
  router.post('/:id/likes', authenticator, handler.postLikeHandler);
  router.delete('/:id/likes', authenticator, handler.deleteLikeHandler);
  router.get('/:id/likes', handler.getLikesHandler); // GET ga butuh auth sesuai spec

  return router;
};

module.exports = routes;
