const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const pry = require('pryjs')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const favorites = require('./lib/routes/api/v1/favorites');

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

app.use('/api/v1/favorites', favorites);

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
