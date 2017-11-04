const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config.js');
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json('Thesis Powers Activate');
});

app.listen(port, (err) => {
  if (err) {
    console.error('Cannot connect to server on', port);
  }
  console.log('listening on', port);
});

module.exports = app;




