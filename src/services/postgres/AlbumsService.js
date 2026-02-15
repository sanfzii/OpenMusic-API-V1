const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(storageService = null) {
    this._pool = new Pool();
    this._storageService = storageService; // optional, dipakai kalau butuh manage cover files
  }

  async addAlbum({ name, year }) {
    const idBaru = `album-${nanoid(16)}`;

    // Query masukin data
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [idBaru, name, year],
    };

    const hasil = await this._pool.query(query);

    // Cek apakah id berhasil kebuat
    if (!hasil.rows[0].id) {
      throw new InvariantError('Gagal nambahin album, coba cek datanya lagi.');
    }

    return hasil.rows[0].id;
  }

  async getAlbumById(id) {
    // Query 1: Ambil Album
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const albumResult = await this._pool.query(queryAlbum);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Ambil Lagu milik album ini
    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songsResult = await this._pool.query(querySongs);

    // Gabungkan hasilnya
    const album = albumResult.rows[0];
    return {
      id: album.id,
      name: album.name,
      year: album.year,
      coverUrl: album.cover || null, // cover URL (nullable)
      songs: songsResult.rows, // Masukkan array lagu ke objek album
    };
  }

  // update cover URL di database
  async updateAlbumCover(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal update cover. Album tidak ditemukan');
    }
  }

  // get old cover URL untuk delete file lama
  async getOldCoverUrl(albumId) {
    const query = {
      text: 'SELECT cover FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0].cover; // return null jika belum ada cover
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const hasil = await this._pool.query(query);

    if (hasil.rows.length === 0) {
      throw new NotFoundError('Gagal edit. ID album ga ditemukan.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const hasil = await this._pool.query(query);

    if (hasil.rows.length === 0) {
      throw new NotFoundError('Gagal hapus. ID album ga ada.');
    }
  }
}

module.exports = AlbumsService;