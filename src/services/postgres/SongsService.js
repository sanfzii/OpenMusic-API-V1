const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const idLagu = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [idLagu, title, year, genre, performer, duration, albumId],
    };

    const hasil = await this._pool.query(query);

    if (!hasil.rows[0].id) {
      throw new InvariantError('Lagu gagal disimpan.');
    }

    return hasil.rows[0].id;
  }

  async getSongs(title, performer) {
    // 1. Logika Dynamic Query
    let text = 'SELECT id, title, performer FROM songs';
    const values = [];

    if (title) {
      text += " WHERE title ILIKE '%' || $1 || '%'";
      values.push(title);
    }

    if (performer) {
      // Cek apakah sudah ada WHERE (karena title) atau belum
      text += title ? " AND performer ILIKE '%' || $2 || '%'" : " WHERE performer ILIKE '%' || $1 || '%'";
      values.push(performer);
    }

    const result = await this._pool.query({ text, values });
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const hasil = await this._pool.query(query);

    if (hasil.rows.length === 0) {
      throw new NotFoundError('Lagu tidak ditemukan di database.');
    }

    // Mapping manual dari snake_case (DB) ke camelCase (API)
    // Biar sesuai kriteria submission tanpa file utils
    const dataDB = hasil.rows[0];
    const dataLagu = {
      id: dataDB.id,
      title: dataDB.title,
      year: dataDB.year,
      performer: dataDB.performer,
      genre: dataDB.genre,
      duration: dataDB.duration,
      albumId: dataDB.album_id, // Perhatikan ini
    };

    return dataLagu;
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const hasil = await this._pool.query(query);

    if (hasil.rows.length === 0) {
      throw new NotFoundError('Gagal update lagu. ID tidak valid.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const hasil = await this._pool.query(query);

    if (hasil.rows.length === 0) {
      throw new NotFoundError('Gagal hapus lagu. ID tidak ketemu.');
    }
  }
}

module.exports = SongsService;