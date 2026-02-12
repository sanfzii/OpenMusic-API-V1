// route buat endpoint /playlists (semua butuh auth)
const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const routes = (handler) => {
  const router = express.Router();

  // pasang middleware auth — semua endpoint playlist wajib login
  router.use(authMiddleware);

  // CRUD playlist
  router.post('/', handler.postPlaylistHandler);
  router.get('/', handler.getPlaylistsHandler);
  router.delete('/:id', handler.deletePlaylistByIdHandler);

  // kelola lagu di dalam playlist
  router.post('/:id/songs', handler.postSongToPlaylistHandler);
  router.get('/:id/songs', handler.getSongsFromPlaylistHandler);
  router.delete('/:id/songs', handler.deleteSongFromPlaylistHandler);

  // riwayat aktivitas playlist (fitur opsional)
  router.get('/:id/activities', handler.getPlaylistActivitiesHandler);

  return router;
};

module.exports = routes;
