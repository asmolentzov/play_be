const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const pry = require('pryjs')

const environment = 'test';
const server = require('../index.js').app;
const config = require('../knexfile.js')[environment];
const database = require('knex')(config);
chai.use(chaiHttp);


describe('Client Routes', () => {

})

describe('API Routes', () => {
  before(done => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach(done => {
    database.raw("TRUNCATE playlist_favorites restart identity;")
      .then(() => database.raw("TRUNCATE playlists restart identity CASCADE;"))
        .then(() => database.raw("TRUNCATE favorites restart identity CASCADE;"))
          .then(() => database.seed.run()
            .then(() => done())
            .catch(error => {
              throw error;
            }))
          .catch(error => {
            throw error;
    });
  });

  describe('GET /api/v1/favorites', () => {
    it('should return all of the favorites', done => {
      chai.request(server)
        .get('/api/v1/favorites')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('artist_name');
          response.body[0].should.have.property('genre');
          response.body[0].should.have.property('rating');
          done();
        });
    });
  });

  describe('GET /api/v1/playlists', () => {
    it('should return all of the playlists', done => {
      chai.request(server)
        .get('/api/v1/playlists')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('playlist_name');
          response.body[0].should.have.property('favorites');
          response.body[0].favorites.should.be.a('array');
          response.body[0].favorites[0].should.have.property('id')
          response.body[0].favorites[0].should.have.property('name')
          response.body[0].favorites[0].should.have.property('artist_name')
          response.body[0].favorites[0].should.have.property('genre')
          response.body[0].favorites[0].should.have.property('rating')
          done();
        });
    });
  });

  describe('POST /api/v1/favorites', () => {
    it('should add a new favorite', done => {
      chai.request(server)
        .post('/api/v1/favorites')
          .send({
            "favorites": {
            "id": 100,
            "name": "We Will Rock You",
            "artist_name": "Queen",
            "genre": "Rock",
            "rating": 88
            }
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.be.a('array');
            response.body[0].should.be.a('object');
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('name');
            response.body[0].should.have.property('artist_name');
            response.body[0].should.have.property('genre');
            response.body[0].should.have.property('rating');
            done();
          })
    });

    it('should not create a new favorite with missing data', done => {
      chai.request(server)
        .post('/api/v1/favorites')
          .send({
            "favorites": {
              "name": "Missing stuff"
            }
          })
          .end((error, response) => {
            response.should.have.status(400);
            response.body.error.should.equal(
              `You're missing a "id" property.`
            );
            done();
          });
    });

    it('should not create a new favorite with a rating over 100', done => {
      chai.request(server)
        .post('/api/v1/favorites')
          .send({
            "favorites": {
            "id": 1,
            "name": "We Will Rock You",
            "artist_name": "Queen",
            "genre": "Rock",
            "rating": 200
            }
          })
          .end((error, response) => {
            response.should.have.status(400);
            response.body.error.should.equal(
              `Rating must be a number between 0 - 100.`
            );
            done();
          });
    });

    it('should not create a new favorite with a rating under 0', done => {
      chai.request(server)
        .post('/api/v1/favorites')
          .send({
            "favorites": {
            "id": 1,
            "name": "We Will Rock You",
            "artist_name": "Queen",
            "genre": "Rock",
            "rating": -12
            }
          })
          .end((error, response) => {
            response.should.have.status(400);
            response.body.error.should.equal(
              `Rating must be a number between 0 - 100.`
            );
            done();
          });
    });

    it('should not create a new favorite with a rating that is not a number', done => {
      chai.request(server)
      .post('/api/v1/favorites')
        .send({
          "favorites": {
          "id": 1,
          "name": "We Will Rock You",
          "artist_name": "Queen",
          "genre": "Rock",
          "rating": 'ok'
          }
        })
        .end((error, response) => {
          response.should.have.status(400);
          response.body.error.should.equal(
            `Rating must be a number between 0 - 100.`
          );
          done();
        });
    });
  });

  describe('GET /api/v1/favorites/:id', () => {
    it('should get the specified favorite information', done => {
      chai.request(server)
        .get('/api/v1/favorites/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.be.a('object');
          done();
        });
    });

    it('should return an error if the specified ID does not exist', done => {
      chai.request(server)
        .get('/api/v1/favorites/400')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });


  describe('DELETE /api/v1/favorites/:id', () => {
    it('should delete a specified favorite from the database', done => {
        chai.request(server)
        .del('/api/v1/favorites/1')
        .end((error, response) => {
          response.should.have.status(204);
          done();
        })
      })
    })


  describe('PUT /api/v1/favorites/:id', () => {
    it('should update the specified favorite', done => {
      const newName = "We Are the Champions";
      const newArtist = "Queen";
      chai.request(server)
        .put('/api/v1/favorites/1')
          .send({
              "favorites": {
                "id": 1,
                "name": newName,
                "artist_name": newArtist,
                "genre": "Rock",
                "rating": 77
              }
          })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body[0].should.be.a('object');
            response.body[0].name.should.equal(newName);
            response.body[0].artist_name.should.equal(newArtist);
            done();
          });
    });

    it('should return an error if the specified ID does not exist', done => {
      chai.request(server)
        .put('/api/v1/favorites/2000')
          .send({
            "favorites": {
              "id": 1,
              "name": "New!",
              "artist_name": "Queen",
              "genre": "Rock",
              "rating": 77
            }
          })
          .end((error, response) => {
            response.should.have.status(400);
            done();
          });
    });

    it('should return an error if all fields are not included', done => {
      chai.request(server)
        .put('/api/v1/favorites/1')
          .send({
            "favorites": {
              "name": "New!"
            }
          })
          .end((error, response) => {
            response.should.have.status(400);
            done();
          });
    })
  });

  describe('POST /api/v1/playlists', () => {
    it('should make a new playlist if data is provided', done => {
      chai.request(server)
      .post('/api/v1/playlists')
        .send({
          "playlists": {
            "playlist_name": "new_list"
          }
        })
        .end((error, response) => {
          response.should.have.status(201);
          done();
        })
    })

    it('should error if a playlist has no title', done => {
      chai.request(server)
      .post('/api/v1/playlists')
        .send({
          "playlists": {
            "playlist_name": ""
          }
        })
        .end((error, response) => {
          response.should.have.status(400);
          done();
        })
    })
  })

  describe('DELETE /api/v1/playlists/:id', () => {
    it('should delete a specified playlists from the database', done => {
        chai.request(server)
        .del('/api/v1/playlists/1')
        .end((error, response) => {
          response.should.have.status(204);
          done();
        })
      })
    })

  describe('POST /api/v1/playlists/:playlist_id/favorites/:id', () => {
    it('should update playlist_favorites', done => {
      chai.request(server)
      .post('/api/v1/playlists/1/favorites/2')
        .end((error, response) => {
          response.should.have.status(201);
          done();
      });
    })

    it('should error out if uri request params are missing or do not exist, favorite_id', done => {
      chai.request(server)
      .post('/api/v1/playlists/1/favorites/taco')
        .end((error, response) => {
          response.should.have.status(500);
          done();
      });
    })

    it('should error out if uri request params are missing or do not exist, playlist_id', done => {
      chai.request(server)
      .post('/api/v1/playlists/taco/favorites/1')
        .end((error, response) => {
          response.should.have.status(500);
          done();
      });
    })
 })

 describe('GET /api/v1/playlists/:playlist_id/favorites', () => {
   it('should get the specified playlist and its associated favorites', done => {
     chai.request(server)
      .get('/api/v1/playlists/1/favorites')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('playlist_name');
        response.body.should.have.property('favorites');
        response.body.favorites.should.be.a('array');
        response.body.favorites[0].should.be.a('object');
        response.body.favorites[0].should.have.property('id');
        response.body.favorites[0].should.have.property('name');
        response.body.favorites[0].should.have.property('artist_name');
        response.body.favorites[0].should.have.property('genre');
        response.body.favorites[0].should.have.property('rating');
        done();
      })
   })

   it('should return 404 if the specified playlist is not found', done => {
     chai.request(server)
      .get('/api/v1/playlists/1000/favorites')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
   });
 });

 describe('DELETE /api/v1/playlists/:playlist_id/favorites/:id', () => {
   it('should delete the playlist_favorite record specified', done => {
     chai.request(server)
      .delete('/api/v1/playlists/1/favorites/2')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object')
        response.body.should.have.property('message');
        response.body.message.should.equal("Successfully removed song_2 from playlist_1")
        done();
      })
   });

   it('should return a 404 if the playlist id cannot be found', done => {
     chai.request(server)
      .delete('/api/v1/playlists/100/favorites/2')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
   });

   it('should return a 404 if the favorite id cannot be found', done => {
     chai.request(server)
      .delete('/api/v1/playlists/1/favorites/200')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
   })
 })
});
