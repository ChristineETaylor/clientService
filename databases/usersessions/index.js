var pg = require('pg');
var Promise = require('bluebird');

var Chance = require('chance');
var chance = new Chance();

var config = {};

if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
} else {
  config.user = 'macd';
  config.password = 'macd';
  config.database = 'usersessions';
}

var pool = new pg.Pool(config)
pool.connect();

const numberOfSessionBundles = 10000;

/* ===========================================================
createSessionBundle
-generate user_id
-generate session_id
-generate frequency of each of 3 request types
-call functions for each request type with frequency
=========================================================== */

const createSessionBundle = (numberOfSessionBundles) => {

  for (var i = 0; i < numberOfSessionBundles; i++) {
    var user_id = newUser();
    var session_id = newSession();

    // How many of each request type will this bundle generate?
    var numberOfResearch = requestTypeFrequency();
    sessionResearchActivity(numberOfResearch, user_id, session_id);
  }
}

const sessionResearchActivity = (numberOfResearch, user_id, session_id) => {
  for (var i = 0; i < numberOfResearch; i++) {
    var indicator = generateResearchType();
    var interval = generateInterval();
    addResearchSessionData(user_id, session_id, 'research', 'EURUSD', indicator, interval);
  }
  addResearchSessionData(user_id, session_id, 'END', 'END', 'END', 'END');
}

/* ===========================================================
generate random num (0-100) for frequency of each requestType in this session
=========================================================== */
const requestTypeFrequency = () => {
  return Math.floor((Math.random() * 100) + 1);
}

/* ===========================================================
create 8-digit user_id, 1000000 - 99999999
=========================================================== */
const newUser = () => {
  return Math.floor((Math.random() * 1000000) + 1000000);
}

/* ===========================================================
create 9-digit session_id, 10000000 - 999999999
=========================================================== */
const newSession = () => {
  return Math.floor((Math.random() * 10000000) + 10000000);
}

/* ===========================================================
generate research type, weighted for MACD
=========================================================== */
const generateResearchType = () => {
  var researchTypes = ['MACD', 'EMA', 'MA'];
  return chance.weighted(researchTypes, [15, 7, 5]);
}

/* ===========================================================
generate research interval, weighted for 5s
=========================================================== */
const generateInterval = () => {
  // console.log(numberOfResearch);
  var intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
  return chance.weighted(intervalTypes, [50, 20, 10, 20, 20, 5]);
}

/* ===========================================================
addResearchSessionData
Output: Promise object resolving to added row info.
=========================================================== */
const addResearchSessionData = (user_id, session_id, requestType, majorPair, indicator, interval) => {

  var query = "INSERT INTO sessioninfo (user_id, session_id, requestType, majorPair, indicator, interval) VALUES ($1, $2, $3, $4, $5, $6)";
  var values = [user_id, session_id, requestType, majorPair, indicator, interval];

  return new Promise(function (resolve, reject) {
    pool.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}

module.exports = {
  pool: pool,
  generateInterval: generateInterval,
  generateResearchType: generateResearchType,
  addResearchSessionData: addResearchSessionData
};

createSessionBundle(numberOfSessionBundles);