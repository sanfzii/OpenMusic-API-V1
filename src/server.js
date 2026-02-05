require('dotenv').config();
const express = require('express');
const app = express();
const ClientError = require('./exceptions/ClientError');

// Import modul-modul yang udah dibikin
const albumsRouter = require('./api/albums/routes');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const AlbumsHandler = require('./api/albums/handler');

const songsRouter = require('./api/songs/routes');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const SongsHandler = require('./api/songs/handler');

// Biar bisa baca JSON dari body request
app.use(express.json());

// --- Instansiasi Service & Handler ---

// Bagian Albums
const serviceAlbum = new AlbumsService();
const handlerAlbum = new AlbumsHandler(serviceAlbum, AlbumsValidator);

// Bagian Songs
const serviceLagu = new SongsService();
const handlerLagu = new SongsHandler(serviceLagu, SongsValidator);

// --- Register Routes ---
// Masukin routernya ke server
app.use('/albums', albumsRouter(handlerAlbum));
app.use('/songs', songsRouter(handlerLagu));

// --- Error Handling (Penting biar ga crash) ---
app.use((err, req, res, next) => {
  // Cek dulu errornya dari client (salah input dsb) atau bukan
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Kalau error server (codingan error / db mati)
  console.log("Ada Error Server: ", err); // Buat ngecek di terminal
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi gangguan di server kami.',
  });
});

const port = process.env.PORT || 5000; 
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server jalan di http://${host}:${port}`);
});