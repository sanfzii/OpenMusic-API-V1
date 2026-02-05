const express = require('express');
const router = express.Router();

const routes = (handler) => {
  router.post('/', handler.postAlbumHandler);
  router.get('/:id', handler.getAlbumByIdHandler);
  router.put('/:id', handler.putAlbumByIdHandler);
  router.delete('/:id', handler.deleteAlbumByIdHandler);
  
  return router; 
};

module.exports = routes; 