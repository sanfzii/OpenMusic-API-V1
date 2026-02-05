require('dotenv').config();
const express = require('express');
const app = express();
const ClientError = require('./exceptions/ClientError');

// Imports Albums
const albumsRouter = require('./api/albums/routes');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const AlbumsHandler = require('./api/albums/handler');

// TAMBAHAN BARU: Imports Songs
const songsRouter = require('./api/songs/routes');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const SongsHandler = require('./api/songs/handler');

app.use(express.json());

// Inisialisasi Service & Handler Albums
const albumsService = new AlbumsService();
const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);

// TAMBAHAN BARU: Inisialisasi Service & Handler Songs
const songsService = new SongsService();
const songsHandler = new SongsHandler(songsService, SongsValidator);

// Register Routes
app.use('/albums', albumsRouter(albumsHandler));
app.use('/songs', songsRouter(songsHandler)); // TAMBAHAN BARU

// Middleware Error Handling
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kegagalan pada server kami',
  });
});

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});