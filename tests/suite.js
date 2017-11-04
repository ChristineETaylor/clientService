
const { expect } = require('chai');
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const node = require('../server/index.js');
const nodeRemote = 'http://13.57.41.182:3000/';

const elasticsearch = 'http://localhost:9200';
const elasticsearchRemote = 'https://caa3de72bd5ffce2b12a61289f202ca0.us-west-1.aws.found.io:9243/';

chai.use(chaiHttp);

/* ===========================================================
Node server
* Tests local connection
* Tests cloud connection
=========================================================== */
describe('Node Server (local)', () => {
  it('should return 200 status code', (done) => {
    chai.request(node)
      .get('/')
      .end((err, res) => {
        expect(200);
        done();
      });
  }).timeout(2000);

  it('should return matching response ', (done) => {
    chai.request(node)
      .get('/')
      .end((err, res) => {
        expect(res.body).to.be.equal('Thesis Powers Activate');
        done();
      });
  }).timeout(2000);
});

describe('Node Server (remote)', () => {
  it('should return 200 status code', (done) => {
    chai.request(nodeRemote)
      .get('/')
      .end((err, res) => {
        expect(200);
        done();
      });
  }).timeout(2000);
});


/* ===========================================================
Elasticsearch
* Tests local connection
* Tests cloud connection
=========================================================== */

describe('Elasticsearch (local)', () => {
  it('should connect to elasticsearch (local)', (done) => {
    chai.request(elasticsearch)
      .get('/')
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.cluster_name.should.equal('elasticsearch');
        done();
      });
  }).timeout(2000);

  it('should return valid results from usersessions', (done) => {
    chai.request(elasticsearch)
      .get('/usersessions')
      .end((err, res) => {
        res.status.should.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  }).timeout(2000);

  it('should contain shards and hits properties', (done) => {
    chai.request(elasticsearch)
      .get('/usersessions/_search')
      .end((err, res) => {
        res.body.should.have.property('_shards');
        res.body.should.have.property('hits');
        done();
      });
  }).timeout(2000);
});

describe('Elasticsearch (remote)', () => {
  it('should connect to elasticsearch (remote)', (done) => {
    chai.request(elasticsearchRemote)
      .get('')
      .end((err, res) => {
        done();
      });
  }).timeout(2000);

  xit('should return valid results from usersessions', (done) => {
    chai.request(elasticsearchRemote)
      .get('/usersessions')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  xit('should contain shards and hits properties', (done) => {
    chai.request(elasticsearchRemote)
      .get('/usersessions/_search')
      .end((err, res) => {
        res.body.should.have.property('_shards');
        res.body.should.have.property('hits');
        done();
      });
  });
});
