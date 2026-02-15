
// migration: tambah kolom cover di tabel albums untuk simpan URL cover album
exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
      notNull: false, // nullable, karena album bisa belum punya cover
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};
