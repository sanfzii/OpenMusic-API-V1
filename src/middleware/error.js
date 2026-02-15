// Global Error Handler Middleware untuk Express.js
// Middleware ini harus dipasang di akhir semua routes
const errorHandler = (err, req, res) => {
  // Cek apakah error berasal dari ClientError (400-499)
  // Menggunakan duck typing: cek apakah ada property statusCode dan isClientError
  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Log error untuk debugging (hanya untuk server error)
  console.error('Server Error:', err);

  // Default ke 500 Internal Server Error
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};

module.exports = errorHandler;

