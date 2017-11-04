/* ===========================================================
Dependencies
=========================================================== */
const pg = require('pg');
const Promise = require('bluebird');
const config = require('./db/config.js');

/* ===========================================================
Connect to PostgreSQL with Pool, using settings in config.js
=========================================================== */

const pool = new pg.Pool(config);

pool.on('error', (err) => console.error(err));
pool.connect(console.log('Connected to RDS', config.database, 'on port', config.port));

module.exports = pool;
module.exports = config;
