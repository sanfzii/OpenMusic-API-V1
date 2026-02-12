// route buat endpoint /collaborations (semua butuh auth)
const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const routes = (handler) => {
  const router = express.Router();

  // pasang middleware auth — cuma user yang login bisa akses
  router.use(authMiddleware);

  router.post('/', handler.postCollaborationHandler);
  router.delete('/', handler.deleteCollaborationHandler);

  return router;
};

module.exports = routes;
