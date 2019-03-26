const playlistFavorite = require('../models/playlist_favorite')
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

module.exports = {create}
