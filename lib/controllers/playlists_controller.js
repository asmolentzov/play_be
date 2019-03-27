const playlist = require('../models/playlist')
const pry = require('pryjs')

function Favorite(id,name,artist_name,genre,rating) {
  this.id = id;
  this.name = name;
  this.artist_name = artist_name;
  this.genre = genre;
  this.rating = rating
}

function Playlist(id, playlist_name, favorites) {
  this.id = id;
  this.playlist_name = playlist_name;
  this.favorites = favorites
}

const index = (request, response) => {
  playlist.all()
    .then(data => {
      let playlists = data[0].map(playData => {
        let favs = data[1].filter(song => song.playlist_id === playData.id).map(rawFav => new Favorite(rawFav.id, rawFav.name, rawFav.artist_name, rawFav.genre, rawFav.rating))
        return new Playlist(playData.id, playData.playlist_name, favs)})
      response.status(200).json(playlists);
    })
    .catch(error => {
      response.status(500).json({ error })
    })
}

const show = (request, response) => {
  playlist.find(request.params.playlist_id)
    .then(data => {
      let playlistData = data[0][0];
      let favs = data[1].map(rawFav => {
        return new Favorite(rawFav.id, rawFav.name, rawFav.artist_name, rawFav.genre, rawFav.rating)
      })
      let playlist =  new Playlist(playlistData.id, playlistData.playlist_name, favs)
      response.status(200).json(playlist);
    })
    .catch(error => {
      response.status(404).json({ error })
    })
}

const create = (request, response) => {
  const newPlaylist = request.body.playlists;
    for(let requiredParameter of ['playlist_name']) {
      if(!newPlaylist[requiredParameter]) {
        return response
          .status(400)
          .send({ error: `You're missing a "${requiredParameter}" property.` });
      }
    }
    playlist.create(newPlaylist)
      .then(playlist => {
        response.status(201).json(playlist)
      })
      .catch(error => {
        response.status(500).json({ error })
      });
}

const destroy = (request, response) => {
  playlist.destroy(request.params.id)
    .then(() => response.status(204).json())
    .catch(error => {
      response.status(404).json({ error })
    });
}


module.exports = {index, show, create, destroy}
