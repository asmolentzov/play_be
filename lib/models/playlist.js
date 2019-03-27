const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allPlaylist = () => database('playlists').select()

const singlePlaylist = (id)=> database('playlists').where({id: id}).select();

const playlistFavorites = (id) => database.from('playlist_favorites')
        .join('favorites', {'favorites.id': 'playlist_favorites.favorite_id'})
        .where({'playlist_favorites.playlist_id': id})
        .select('favorites.id', 'favorites.name', 'favorites.artist_name', 'favorites.genre', 'favorites.rating',)

const allFavorites = () => database.from('playlist_favorites')
        .join('favorites', {'favorites.id': 'playlist_favorites.favorite_id'})
        .select('favorites.id', 'favorites.name', 'favorites.artist_name', 'favorites.genre', 'favorites.rating', 'playlist_favorites.playlist_id')

const all = () => Promise.all([allPlaylist(), allFavorites()]);

const find = (id) => Promise.all([singlePlaylist(id), playlistFavorites(id)]);

const create = (playlist) => database('playlists').insert(playlist, ['playlist_name'])

const delete = (id) => database('playlists').where({"id": id})

module.exports = {all, find, create, delete}
