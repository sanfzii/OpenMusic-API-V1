/* eslint-disable no-unused-vars */
// file utama — tempat semua modul dihubungkan dan server dijalankan
require('dotenv').config();
const express = require('express');
const app = express();
const ClientError = require('./exceptions/ClientError');

// --- Import Albums ---
const albumsRouter = require('./api/albums/routes');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const AlbumsHandler = require('./api/albums/handler');

// --- Import Songs ---
const songsRouter = require('./api/songs/routes');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const SongsHandler = require('./api/songs/handler');

// --- Import Users ---
const usersRouter = require('./api/users/routes');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const UsersHandler = require('./api/users/handler');

// --- Import Authentications ---
const authenticationsRouter = require('./api/authentications/routes');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const AuthenticationsHandler = require('./api/authentications/handler');
const TokenManager = require('./tokenize/TokenManager');

// --- Import Playlists ---
const playlistsRouter = require('./api/playlists/routes');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistsHandler = require('./api/playlists/handler');

// --- Import Collaborations ---
const collaborationsRouter = require('./api/collaborations/routes');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsHandler = require('./api/collaborations/handler');

// biar bisa baca JSON dari body request
app.use(express.json());

// --- Instansiasi Service & Handler ---
// tiap fitur punya service (urusan database) dan handler (terima & kirim response)

const serviceAlbum = new AlbumsService();
const handlerAlbum = new AlbumsHandler(serviceAlbum, AlbumsValidator);

const serviceLagu = new SongsService();
const handlerLagu = new SongsHandler(serviceLagu, SongsValidator);

const usersService = new UsersService();
const usersHandler = new UsersHandler(usersService, UsersValidator);

// auth handler butuh 4 dependency: service auth, service user, token manager, validator
const authenticationsService = new AuthenticationsService();
const authenticationsHandler = new AuthenticationsHandler(
  authenticationsService,
  usersService,
  TokenManager,
  AuthenticationsValidator,
);

// collaborations dibikin dulu sebelum playlists karena playlists butuh collaborationsService
const collaborationsService = new CollaborationsService();
const collaborationsHandler = new CollaborationsHandler(
  collaborationsService,
  null, // playlistsService di-set nanti di bawah
  CollaborationsValidator,
);

// playlists butuh collaborationsService buat cek akses kolaborator
const playlistsService = new PlaylistsService(collaborationsService);
const playlistsHandler = new PlaylistsHandler(playlistsService, PlaylistsValidator);

// nah ini baru di-set playlistsService ke collaborationsHandler
collaborationsHandler._playlistsService = playlistsService;

// --- Register Routes ---
// tiap endpoint didaftarin ke express app
app.use('/albums', albumsRouter(handlerAlbum));
app.use('/songs', songsRouter(handlerLagu));
app.use('/users', usersRouter(usersHandler));
app.use('/authentications', authenticationsRouter(authenticationsHandler));
app.use('/playlists', playlistsRouter(playlistsHandler));
app.use('/collaborations', collaborationsRouter(collaborationsHandler));

// --- Error Handling Middleware ---
// semua error dari handler ditangkap disini
app.use((err, req, res, next) => {
  // kalo error-nya dari ClientError (atau turunannya), kirim status + pesan sesuai
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // kalo bukan ClientError, berarti error server (500)
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
});

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server jalan di http://${host}:${port}`);
});