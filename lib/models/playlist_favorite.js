const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (id, song_id) => database('playlist_favorites').insert({favorite_id: song_id, playlist_id: id})

const destroy = (playlist_id, favorite_id) => database('playlist_favorites').where({playlist_id: playlist_id, favorite_id: favorite_id}).delete()

module.exports = {create, destroy}
