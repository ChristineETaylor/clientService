const elasticsearch = require('elasticsearch');
const generateFakeData = require('../dataGenerator');

const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200'
});

elasticClient.ping({
  requestTimeout: 1000
}, (error) => {
  if (error) {
    console.log('Elasticsearch is not accepting this connection.');
  } else {
    console.log('Elasticsearch is go!');
  }
});


let usersessions = dataGenerator.createSessionData(100);

console.time('insert');

usersessions.bids.forEach(session => {
  elasticClient.index({
    type: 'bid',
    index: 'orders',
    body: session,
  });
});

console.timeEnd('insert');
