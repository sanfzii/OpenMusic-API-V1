// route buat endpoint /albums (gak butuh auth)
const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');

const routes = (handler) => {
  router.post('/', handler.postAlbumHandler);
  router.get('/:id', handler.getAlbumByIdHandler);
  router.put('/:id', handler.putAlbumByIdHandler);
  router.delete('/:id', handler.deleteAlbumByIdHandler);

  // upload cover album (pakai multer middleware)
  router.post('/:id/covers', upload.single('cover'), handler.postUploadCoverHandler);

  return router;
};

module.exports = routes;