const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const pry = require('pryjs')

const environment = process.env.NODE_ENV || 'test';
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
    database.seed.run()
      .then(() => done())
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
  
  describe('POST /api/v1/favorites', () => {
    it('should add a new favorite', done => {
      chai.request(server)
        .post('/api/v1/favorites')
          .send({
            "favorites": {
            "id": 1,
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
  });
});
