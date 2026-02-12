// route buat endpoint /songs (gak butuh auth)
const express = require('express');
const router = express.Router();

const routes = (handler) => {
  router.post('/', handler.postSongHandler);
  router.get('/', handler.getSongsHandler);
  router.get('/:id', handler.getSongByIdHandler);
  router.put('/:id', handler.putSongByIdHandler);
  router.delete('/:id', handler.deleteSongByIdHandler);
  return router;
};

module.exports = routes;