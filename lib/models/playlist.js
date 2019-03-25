const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allPlaylist = () => database('playlists').select()

const allFavorites = () => database.from('playlist_favorites')
        .join('favorites', {'favorites.id': 'playlist_favorites.favorite_id'})
        .select('favorites.id', 'favorites.name', 'favorites.artist_name', 'favorites.genre', 'favorites.rating', 'playlist_favorites.playlist_id')

const all = () => Promise.all([allPlaylist(), allFavorites()]);

module.exports = {all}
