const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'play_app';

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

module.exports = {
  app: app
}
