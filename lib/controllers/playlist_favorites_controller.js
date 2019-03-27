const playlistFavorite = require('../models/playlist_favorite')
const playlist = require('../models/playlist')
const favorite = require('../models/favorite')
const pry = require('pryjs')

const create = (request, response) => {
  playlistFavorite.create(request.params.playlist_id, request.params.id)
    .then(() => {
      response.status(201).json()
    })
    .catch(error => {
      response.status(500).json({ error })
    })
}

const destroy = (request, response) => {
  Promise.all([favorite.find(request.params.id), playlist.find(request.params.playlist_id)])
    .then(data => {
      const f = data[0][0];
      const p = data[1][0][0];
      playlistFavorite.destroy(request.params.playlist_id, request.params.id)
      .then(() => {
        response.status(200).json({message: `Successfully removed ${f.name} from ${p.playlist_name}`})
      })
      .catch(error => {
        response.status(500).json({ error })
      })
    })
  
}

module.exports = {create, destroy}
