const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  // like album - tambah record ke tabel user_album_likes
  async addLike(userId, albumId) {
    // cek dulu apakah user udah pernah like album ini
    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const checkResult = await this._pool.query(checkQuery);

    // kalo udah pernah like, lempar error
    if (checkResult.rows.length > 0) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }

    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan like');
    }

    return result.rows[0].id;
  }

  // unlike album - hapus record dari tabel
  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus like. Like tidak ditemukan');
    }
  }

  // get total likes untuk album tertentu
  async getLikesCount(albumId) {
    const query = {
      text: 'SELECT COUNT(*) as count FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    // return integer count, bukan string
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = UserAlbumLikesService;
