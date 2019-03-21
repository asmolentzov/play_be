const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index.js').app;
const config = require('../knexfile.js')['test'];
const database = require('knex')(config);

chai.use(chaiHttp);


describe('Client Routes', () => {

})

describe('API Routes', () => {
  describe('GET /api/v1/favorites', () => {
    it('should return all of the favorites', done => {
      chai.request(server)
        .get('/api/v1/favorites')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('artist_name');
          response.body[0].should.have.property('genre');
          response.body[0].should.have.property('rating');
          done();
        });
    });
  });
});
