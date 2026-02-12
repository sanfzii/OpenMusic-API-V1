// handler buat semua endpoint playlist
// termasuk CRUD playlist, kelola lagu di playlist, dan riwayat aktivitas
class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  // POST /playlists — bikin playlist baru
  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistPayload(req.body);
      const { name } = req.body;
      // ambil userId dari token yang udah di-decode di middleware
      const { id: credentialId } = req.auth.credentials;

      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

      res.status(201).json({
        status: 'success',
        data: {
          playlistId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /playlists — ambil semua playlist milik user (termasuk yg dia kolaborator)
  async getPlaylistsHandler(req, res, next) {
    try {
      const { id: credentialId } = req.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      res.json({
        status: 'success',
        data: {
          playlists,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /playlists/:id — hapus playlist (cuma owner yang bisa)
  async deletePlaylistByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      res.json({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /playlists/:id/songs — tambahin lagu ke playlist
  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.auth.credentials;

      // cek akses dulu (owner atau kolaborator)
      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.addSongToPlaylist(id, songId);

      // catat aktivitasnya (fitur opsional)
      await this._service.addPlaylistActivity(id, songId, credentialId, 'add');

      res.status(201).json({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /playlists/:id/songs — lihat lagu-lagu di dalam playlist
  async getSongsFromPlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._service.getSongsFromPlaylist(id);

      res.json({
        status: 'success',
        data: {
          playlist,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /playlists/:id/songs — hapus lagu dari playlist
  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.deleteSongFromPlaylist(id, songId);

      // catat aktivitasnya (fitur opsional)
      await this._service.addPlaylistActivity(id, songId, credentialId, 'delete');

      res.json({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /playlists/:id/activities — lihat riwayat siapa nambah/hapus lagu
  async getPlaylistActivitiesHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistAccess(id, credentialId);
      const activities = await this._service.getPlaylistActivities(id);

      res.json({
        status: 'success',
        data: {
          playlistId: id,
          activities,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaylistsHandler;
