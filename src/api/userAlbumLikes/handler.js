class UserAlbumLikesHandler {
  constructor(likesService, albumsService, cacheService) {
    this._likesService = likesService;
    this._albumsService = albumsService;
    this._cacheService = cacheService;

    // binding this context
    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  // POST /albums/{id}/likes - like album
  async postLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.auth.credentials; // dari JWT payload (sudah di-decode oleh middleware auth)

      // verify album exists dulu sebelum like
      await this._albumsService.getAlbumById(albumId);

      // add like
      await this._likesService.addLike(userId, albumId);

      // invalidate cache setelah like
      await this._cacheService.delete(`album:${albumId}:likes`);

      res.status(201).json({
        status: 'success',
        message: 'Berhasil menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /albums/{id}/likes - unlike album
  async deleteLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.auth.credentials;

      // delete like
      await this._likesService.deleteLike(userId, albumId);

      // invalidate cache setelah unlike
      await this._cacheService.delete(`album:${albumId}:likes`);

      res.json({
        status: 'success',
        message: 'Berhasil batal menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /albums/{id}/likes - get likes count (dengan cache)
  async getLikesHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const cacheKey = `album:${albumId}:likes`;

      // cek cache dulu
      const cachedLikes = await this._cacheService.get(cacheKey);

      if (cachedLikes !== null) {
        // data dari cache - set header SEBELUM kirim response
        res.set('X-Data-Source', 'cache');
        return res.json({
          status: 'success',
          data: {
            likes: parseInt(cachedLikes, 10),
          },
        });
      }

      // kalo ga ada di cache, ambil dari database
      const likes = await this._likesService.getLikesCount(albumId);

      // simpan ke cache dengan TTL 30 menit (1800 detik)
      await this._cacheService.set(cacheKey, likes.toString(), 1800);

      // return dengan header X-Data-Source: database (implisit, ga perlu set header)
      return res.json({
        status: 'success',
        data: {
          likes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserAlbumLikesHandler;
