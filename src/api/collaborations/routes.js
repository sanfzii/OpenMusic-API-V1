const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const routes = (handler) => {
  const router = express.Router();

  // Semua route collaborations butuh authentication
  router.use(authMiddleware);

  router.post('/', handler.postCollaborationHandler);
  router.delete('/', handler.deleteCollaborationHandler);

  return router;
};

module.exports = routes;
