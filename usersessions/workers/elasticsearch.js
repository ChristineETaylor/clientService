const elasticsearch = require('elasticsearch');
const dataGenerator = require('../usersessions/dataGenerator');

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


let usersessions = dataGenerator.createSessionBundle(100);

console.log(usersessions);

console.time('insert');

// usersessions.createSessionBundle.forEach(session => {
//   elasticClient.index({
//     type: 'research',
//     index: 'usersessions',
//     body: session,
//   });
// });

console.timeEnd('insert');
