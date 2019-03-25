const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const pry = require('pryjs')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'play_app';

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

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

const allPlaylist = () => database('playlists').select()

const allFavorites = () => database.from('playlist_favorites')
        .join('favorites', {'favorites.id': 'playlist_favorites.favorite_id'})
        .select('favorites.id', 'favorites.name', 'favorites.artist_name', 'favorites.genre', 'favorites.rating', 'playlist_favorites.playlist_id')

app.get('/api/v1/playlists', (request, response) => {
  Promise.all([allPlaylist(), allFavorites()])
  .then(data => {
    let playlists = data[0].map(playData => {
      let favs = data[1].filter(song => song.playlist_id === playData.id).map(rawFav => new Favorite(rawFav.id, rawFav.name, rawFav.artist_name, rawFav.genre, rawFav.rating))
      return new Playlist(playData.id, playData.playlist_name, favs)})
    response.status(200).json(playlists);
  })
  .catch(error => {
    response.status(500).json({ error })
  })
})


app.get('/api/v1/favorites', (request, response) => {
  database('favorites').select()
    .then(favorites => {
      response.status(200).json(favorites);
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.post('/api/v1/favorites', (request, response) => {
  const favorite = request.body.favorites;
  for(let requiredParameter of ['id', 'name', 'artist_name', 'genre', 'rating']) {
    if(!favorite[requiredParameter]) {
      return response
        .status(400)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    } else if(isNaN(favorite['rating']) || favorite['rating'] > 100 || favorite['rating'] < 0) {
      return response
        .status(400)
        .send({ error: 'Rating must be a number between 0 - 100.' })
    }
  }
  database('favorites').insert(favorite, ['id', 'name', 'artist_name', 'genre', 'rating'])
    .then(favorite => {
      response.status(201).json(favorite)
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then(favorite => {
      if(favorite.length) {
        response.status(200).json(favorite);
      } else {
        response.status(404).json({ error: `Could not find Favorite with ID: ${request.params.id}.` });
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.put('/api/v1/favorites/:id', (request, response) => {
  const newFavorite = request.body.favorites;
  for(let requiredParameter of ['id', 'name', 'artist_name', 'genre', 'rating']) {
    if(!newFavorite[requiredParameter]) {
      return response.status(400).send({ error: `You're missing a ${requiredParameter} property.` })
    }
  };
  database('favorites').where('id', request.params.id)
    .update(newFavorite, ['id', 'name', 'artist_name', 'genre', 'rating'])
      .then(newFavorite => {
        if(newFavorite.length) {
          response.status(200).json(newFavorite);
        } else {
          response.status(400).json({ error: `Could not find Favorite with ID: ${request.params.id}.`});
        }
      })
      .catch(error => {
        response.status(500).json({ error });
      });
});

app.delete('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).del()
    .then(() => {
      response.status(204).json()
    })
    .catch(error => {
      response.status(404).json({ error: `Could not find Favorite with ID: ${request.params.id}.` })
    });
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})

module.exports = {
  app: app
}
