// route buat endpoint /export (butuh auth)
const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const routes = (handler) => {
  const router = express.Router();

  // pasang middleware auth — endpoint export wajib login
  router.use(authMiddleware);

  // POST /export/playlists/:playlistId — request export playlist
  router.post('/playlists/:playlistId', handler.postExportPlaylistHandler);

  return router;
};

module.exports = routes;
