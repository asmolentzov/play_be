const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('favorites').select()
const create = (favorite) => database('favorites').insert(favorite, ['id', 'name', 'artist_name', 'genre', 'rating'])
const find = (id) => database('favorites').where('id', id).select()

module.exports = {all, create, find}