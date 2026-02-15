const multer = require('multer');
const path = require('path');
const InvariantError = require('../exceptions/InvariantError');
const PayloadTooLargeError = require('../exceptions/PayloadTooLargeError');

// konfigurasi multer untuk handle upload file cover album
// file disimpan di ./uploads/images/ dengan filename unik
const storage = multer.diskStorage({
  destination: './uploads/images/',
  filename: (req, file, cb) => {
    // generate filename unik: cover-timestamp-random.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `cover-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 512000, // 512KB max
  },
  fileFilter: (req, file, cb) => {
    // validasi: harus image/*
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // lempar InvariantError agar status code 400, bukan 500
      cb(new InvariantError('File harus berupa gambar'), false);
    }
  },
});

// wrapper middleware untuk handle error multer LIMIT_FILE_SIZE
const upload = {
  single: (fieldName) => {
    return (req, res, next) => {
      multerUpload.single(fieldName)(req, res, (err) => {
        if (err) {
          // jika error adalah LIMIT_FILE_SIZE, throw PayloadTooLargeError dengan status 413
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new PayloadTooLargeError('Ukuran file melebihi batas maksimum (512KB)'));
          }
          // error lain tetap dilempar sebagaimana adanya
          return next(err);
        }
        next();
      });
    };
  },
};

module.exports = upload;
