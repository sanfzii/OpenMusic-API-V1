const fs = require('fs');
const path = require('path');
const config = require('../../utils/config');

// service untuk handle file storage di filesystem
// auto-create folder dan generate public URL
class StorageService {
  constructor() {
    // path folder untuk simpan cover album dari config
    this._uploadsDir = config.upload.directory;

    // auto-create folder jika belum ada
    if (!fs.existsSync(this._uploadsDir)) {
      fs.mkdirSync(this._uploadsDir, { recursive: true });
      console.log(`✓ Upload directory created: ${this._uploadsDir}`);
    }
  }

  // generate full public URL dari filename
  getPublicUrl(filename) {
    const { host, port } = config.app;
    return `http://${host}:${port}/uploads/images/${filename}`;
  }

  // hapus file lama dari filesystem (dipanggil pas update cover)
  deleteFile(filename) {
    if (!filename) return false;

    const filePath = path.join(this._uploadsDir, filename);

    try {
      // cek file exist dulu sebelum hapus
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✓ File deleted: ${filename}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // extract filename dari URL lengkap
  getFilenameFromUrl(url) {
    if (!url) return null;
    // ambil bagian terakhir dari URL (setelah /uploads/images/)
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}

module.exports = StorageService;
