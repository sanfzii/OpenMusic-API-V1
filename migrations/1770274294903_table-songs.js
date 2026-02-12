/* eslint-disable camelcase */
// migrasi: bikin tabel songs (album_id bisa null kalo lagu gak masuk album)
exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    year: { type: 'INTEGER', notNull: true },
    genre: { type: 'TEXT', notNull: true },
    performer: { type: 'TEXT', notNull: true },
    duration: { type: 'INTEGER', allowNull: true },
    album_id: { type: 'TEXT', allowNull: true }, // Relasi ke album
  });
};
exports.down = (pgm) => pgm.dropTable('songs');