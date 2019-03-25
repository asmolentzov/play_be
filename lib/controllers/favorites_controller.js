const favorite = require('../models/favorite')

const index = (request, response) => {
  favorite.all() 
    .then(favorites => {
      response.status(200).json(favorites);
    })
    .catch(error => {
      response.status(500).json({ error })
    })
}

const create  = (request, response) => {
  const newFavorite = request.body.favorites;
  for(let requiredParameter of ['id', 'name', 'artist_name', 'genre', 'rating']) {
    if(!newFavorite[requiredParameter]) {
      return response
        .status(400)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    } else if(isNaN(newFavorite['rating']) || newFavorite['rating'] > 100 || newFavorite['rating'] < 0) {
      return response
        .status(400)
        .send({ error: 'Rating must be a number between 0 - 100.' })
    }
  }
    favorite.create(newFavorite)
      .then(favorite => {
        response.status(201).json(favorite)
      })
      .catch(error => {
        response.status(500).json({ error })
      });
}

const show = (request, response) => {
  favorite.find(request.params.id)
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
}

const update = (request, response) => {
  const newFavorite = request.body.favorites;
  for(let requiredParameter of ['id', 'name', 'artist_name', 'genre', 'rating']) {
    if(!newFavorite[requiredParameter]) {
      return response.status(400).send({ error: `You're missing a ${requiredParameter} property.` })
    } 
  };
  favorite.update(request.params.id, newFavorite)
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
}

const destroy = (request, response) => {
  favorite.destroy(request.params.id)
    .then(() => {
      response.status(204).json()
    })
    .catch(error => {
      response.status(404).json({ error: `Could not find Favorite with ID: ${request.params.id}.` })
    });
}

module.exports = {index, create, show, update, destroy}