class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const { id: credentialId } = req.auth.credentials;

      // Hanya owner yang bisa menambah kolaborator
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      res.status(201).json({
        status: 'success',
        data: {
          collaborationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const { id: credentialId } = req.auth.credentials;

      // Hanya owner yang bisa menghapus kolaborator
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      res.json({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CollaborationsHandler;
