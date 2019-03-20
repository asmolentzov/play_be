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

})
