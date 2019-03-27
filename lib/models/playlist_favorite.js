const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (id, song_id) => database('playlist_favorites').insert({favorite_id: song_id, playlist_id: id})

module.exports = {create}
