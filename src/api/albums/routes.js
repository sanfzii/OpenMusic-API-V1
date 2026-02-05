const express = require('express');
const router = express.Router();

// Perhatikan: export FUNCTION yang menerima 'handler'
const routes = (handler) => {
  router.post('/', handler.postAlbumHandler);
  router.get('/:id', handler.getAlbumByIdHandler);
  router.put('/:id', handler.putAlbumByIdHandler);
  router.delete('/:id', handler.deleteAlbumByIdHandler);
  
  return router; // Kembalikan router setelah route didefinisikan
};

module.exports = routes; 