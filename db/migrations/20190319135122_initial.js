
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('favorites', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('artist_name');
      table.string('genre');
      table.integer('rating');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('playlists', function(table) {
      table.increments('id').primary();
      table.string('playlist_name');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('playlist_favorites', function(table) {
      table.increments('id').primary();
      table.integer('favorite_id').unsigned();
      table.foreign('favorite_id').references('id').on('favorites').onDelete('CASCADE');
      table.integer('playlist_id').unsigned();
      table.foreign('playlist_id').references('id').on('playlists').onDelete('CASCADE');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlist_favorites'),
    knex.schema.dropTable('playlists'),
    knex.schema.dropTable('favorites'),
  ])
};
