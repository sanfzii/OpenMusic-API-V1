const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const routes = (handler) => {
  const router = express.Router();

  // Semua route playlist butuh authentication
  router.use(authMiddleware);

  router.post('/', handler.postPlaylistHandler);
  router.get('/', handler.getPlaylistsHandler);
  router.delete('/:id', handler.deletePlaylistByIdHandler);

  // Songs in playlist
  router.post('/:id/songs', handler.postSongToPlaylistHandler);
  router.get('/:id/songs', handler.getSongsFromPlaylistHandler);
  router.delete('/:id/songs', handler.deleteSongFromPlaylistHandler);

  // Opsional 2: Activities
  router.get('/:id/activities', handler.getPlaylistActivitiesHandler);

  return router;
};

module.exports = routes;
