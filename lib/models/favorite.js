const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('favorites').select();
const create = (favorite) => database('favorites').insert(favorite, ['id', 'name', 'artist_name', 'genre', 'rating']);
const find = (id) => database('favorites').where('id', id).select();
const update = (id, newFavorite) => database('favorites').where('id', id)
                                            .update(newFavorite, ['id', 'name', 'artist_name', 'genre', 'rating']);
const destroy = (id) => database('favorites').where('id', id).del()

module.exports = {all, create, find, update, destroy}