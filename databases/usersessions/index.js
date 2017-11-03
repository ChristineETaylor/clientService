/* ===========================================================
connect to usersessions PostgreSQL w/ pg.Pool
=========================================================== */

const pg = require('pg');
const Promise = require('bluebird');

const config = {};

if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
} else {
  config.user = 'macd';
  config.password = 'macd';
  config.database = 'usersessions';
}

const pool = new pg.Pool(config)
pool.connect();

module.exports = {
  pool: pool
};
