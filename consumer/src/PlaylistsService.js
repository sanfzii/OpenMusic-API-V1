const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
  }

  async getSongsInPlaylist(playlistId) {
    // Query JOIN antara playlists, playlist_songs, dan songs
    const query = {
      text: `
        SELECT 
          playlists.id as playlist_id,
          playlists.name as playlist_name,
          songs.id,
          songs.title,
          songs.performer
        FROM playlists
        LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        LEFT JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new Error('Playlist tidak ditemukan');
    }

    // Format data sesuai spesifikasi
    const playlistData = {
      playlist: {
        id: result.rows[0].playlist_id,
        name: result.rows[0].playlist_name,
        songs: result.rows
          .filter((row) => row.id !== null) // Filter jika playlist kosong
          .map((row) => ({
            id: row.id,
            title: row.title,
            performer: row.performer,
          })),
      },
    };

    return playlistData;
  }
}

module.exports = PlaylistsService;
