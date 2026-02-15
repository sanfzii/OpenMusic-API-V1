class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;

    // Binding this context
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postAlbumHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { name, year } = req.body;
      const albumId = await this._service.addAlbum({ name, year });

      res.status(201).json({
        status: 'success',
        data: { albumId },
      });
    } catch (error) {
      next(error); // Lempar ke Middleware Error Handling
    }
  }

  async getAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);
      res.json({
        status: 'success',
        data: { album },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAlbumByIdHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { id } = req.params;
      await this._service.editAlbumById(id, req.body);
      res.json({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);
      res.json({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /albums/:id/covers - upload cover album
  async postUploadCoverHandler(req, res, next) {
    try {
      const { id } = req.params;

      // file sudah di-upload oleh multer middleware, tersedia di req.file
      if (!req.file) {
        return res.status(400).json({
          status: 'fail',
          message: 'Gagal upload. File tidak ditemukan',
        });
      }

      // verify album exists
      await this._service.getAlbumById(id);

      // generate full public URL
      const coverUrl = this._storageService.getPublicUrl(req.file.filename);

      // get old cover URL dan hapus file lama (kalau ada)
      const oldCoverUrl = await this._service.getOldCoverUrl(id);
      if (oldCoverUrl) {
        const oldFilename = this._storageService.getFilenameFromUrl(oldCoverUrl);
        this._storageService.deleteFile(oldFilename);
      }

      // update cover URL di database
      await this._service.updateAlbumCover(id, coverUrl);

      res.status(201).json({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (error) {
      // kalau ada error, hapus file yang sudah di-upload
      if (req.file) {
        this._storageService.deleteFile(req.file.filename);
      }
      next(error);
    }
  }
}

module.exports = AlbumsHandler;