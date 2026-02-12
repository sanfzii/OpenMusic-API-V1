class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePostAuthenticationPayload(req.body);

      const { username, password } = req.body;
      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ userId: id });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId: id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      res.status(201).json({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      // Verifikasi refresh token ada di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // Verifikasi signature refresh token
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);

      // Generate access token baru
      const accessToken = this._tokenManager.generateAccessToken({ userId });

      res.json({
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      // Verifikasi refresh token ada di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // Hapus refresh token dari database
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      res.json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;
