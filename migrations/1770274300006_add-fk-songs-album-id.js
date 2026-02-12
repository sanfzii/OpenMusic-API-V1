// migrasi: tambahin foreign key di songs.album_id → albums.id
exports.up = (pgm) => {
  // Tambah FK constraint pada album_id di tabel songs
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
