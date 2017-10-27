const pg = require('pg');
const Promise = require('bluebird');

const Chance = require('chance');
const chance = new Chance();

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

const numberOfSessionBundles = 5000;

/* ===========================================================
createSessionBundle
-generate user_id
-generate session_id
-generate number of research requests for this user's visit
-call sessionResearchActivity
=========================================================== */

const createSessionBundle = (numberOfSessionBundles) => {
  let startTime = new Date();

  for (let i = 0; i < numberOfSessionBundles; i++) {
    let user_id = newUser();
    let session_id = newSession();

    let numberOfResearch = requestTypeFrequency();
    sessionResearchActivity(numberOfResearch, user_id, session_id);
  }

  console.log('RUN TIME', (new Date() - startTime) / 1000);
}

/* ===========================================================
sessionResearchActivity
-add "numberOfResearch" rows to sessionInfo table
-for each new row
  -retrieve random major pair from generateMajorPair
  -retrieve random indicator from generateResearchType
  -retrieve random interval from generateInterval
  -insert current user_id and session_id; hard coded indicator & interval values
-add row to indicate end of user's visit
=========================================================== */

const sessionResearchActivity = (numberOfResearch, user_id, session_id) => {
  for (let i = 0; i < numberOfResearch; i++) {
    let majorPair = generateMajorPair();
    let indicator = generateResearchType();
    let interval = generateInterval();
    addResearchSessionData(user_id, session_id, 'research', majorPair, indicator, interval);
  }
  addResearchSessionData(user_id, session_id, 'END', 'END', 'END', 'END');
}

/* ===========================================================
generate random num (0-100) for number of requests in user's visit
=========================================================== */
const requestTypeFrequency = () => {
  return Math.floor((Math.random() * 100) + 1);
}

/* ===========================================================
create 8-digit user_id
=========================================================== */
const newUser = () => {
  return Math.floor((Math.random() * 1000000) + 1000000);
}

/* ===========================================================
create 9-digit session_id
=========================================================== */
const newSession = () => {
  return Math.floor((Math.random() * 10000000) + 10000000);
}

/* ===========================================================
generate Major Pair, no weighting
=========================================================== */
const generateMajorPair = () => {
  const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
  return chance.pickone(majorPairTypes);
}

/* ===========================================================
generate research type, weighted for MACD
=========================================================== */
const generateResearchType = () => {
  const researchTypes = ['MACD', 'EMA', 'MA'];
  return chance.weighted(researchTypes, [15, 7, 5]);
}

/* ===========================================================
generate research interval, heavily weighted for 5s
=========================================================== */
const generateInterval = () => {
  const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
  return chance.weighted(intervalTypes, [100, 20, 10, 20, 20, 5]);
}

/* ===========================================================
addResearchSessionData
Output: Promise object resolving to added row info.
=========================================================== */
const addResearchSessionData = (user_id, session_id, requestType, majorPair, indicator, interval) => {

  const query = "INSERT INTO sessioninfo (user_id, session_id, requestType, majorPair, indicator, interval) VALUES ($1, $2, $3, $4, $5, $6)";
  let values = [user_id, session_id, requestType, majorPair, indicator, interval];

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