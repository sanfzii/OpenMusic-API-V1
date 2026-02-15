// handler buat endpoint export playlist
class ExportsHandler {
  constructor(playlistsService, producerService, validator) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  // POST /export/playlists/:playlistId — request export playlist via email
  async postExportPlaylistHandler(req, res, next) {
    try {
      // validasi payload (targetEmail wajib valid)
      this._validator.validateExportPlaylistPayload(req.body);

      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      // ambil userId dari token yang udah di-decode di middleware
      const { id: credentialId } = req.auth.credentials;

      // WAJIB: verifikasi bahwa user adalah OWNER dari playlist (bukan collaborator)
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      // bentuk object pesan untuk dikirim ke consumer
      const message = {
        playlistId,
        targetEmail,
      };

      // kirim pesan ke RabbitMQ queue 'export:playlists'
      await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

      // return success response dengan status 201
      res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExportsHandler;
