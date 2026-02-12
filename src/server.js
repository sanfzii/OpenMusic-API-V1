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

// Biar bisa baca JSON dari body request
app.use(express.json());

// --- Instansiasi Service & Handler ---

// Albums
const serviceAlbum = new AlbumsService();
const handlerAlbum = new AlbumsHandler(serviceAlbum, AlbumsValidator);

// Songs
const serviceLagu = new SongsService();
const handlerLagu = new SongsHandler(serviceLagu, SongsValidator);

// Users
const usersService = new UsersService();
const usersHandler = new UsersHandler(usersService, UsersValidator);

// Authentications
const authenticationsService = new AuthenticationsService();
const authenticationsHandler = new AuthenticationsHandler(
  authenticationsService,
  usersService,
  TokenManager,
  AuthenticationsValidator,
);

// Collaborations (instansiasi dulu sebelum playlists)
const collaborationsService = new CollaborationsService();
const collaborationsHandler = new CollaborationsHandler(
  collaborationsService,
  null, // PlaylistsService akan di-set setelah ini
  CollaborationsValidator,
);

// Playlists (inject collaborationsService)
const playlistsService = new PlaylistsService(collaborationsService);
const playlistsHandler = new PlaylistsHandler(playlistsService, PlaylistsValidator);

// Set playlistsService ke collaborationsHandler
collaborationsHandler._playlistsService = playlistsService;

// --- Register Routes ---
app.use('/albums', albumsRouter(handlerAlbum));
app.use('/songs', songsRouter(handlerLagu));
app.use('/users', usersRouter(usersHandler));
app.use('/authentications', authenticationsRouter(authenticationsHandler));
app.use('/playlists', playlistsRouter(playlistsHandler));
app.use('/collaborations', collaborationsRouter(collaborationsHandler));

// --- Error Handling ---
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Kalau error server
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