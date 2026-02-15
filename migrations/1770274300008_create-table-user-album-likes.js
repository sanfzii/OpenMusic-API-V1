/* eslint-disable camelcase */
// migration: buat tabel user_album_likes untuk fitur like/unlike album
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // tambah foreign key ke tabel users dan albums
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });

  // tambah unique constraint biar user ga bisa like album yang sama 2x
  pgm.addConstraint('user_album_likes', 'unique_user_album_like', {
    unique: ['user_id', 'album_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
