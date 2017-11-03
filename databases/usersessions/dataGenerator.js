/* ===========================================================
Dependencies
=========================================================== */
const pg = require('pg');
const Promise = require('bluebird');

const Chance = require('chance');
const chance = new Chance();

const topTraders = require('./topTraders.js');
const config = require('./config.js');

/* ===========================================================
Connect to PostgreSQL with Pool, using settings in config.js
=========================================================== */

const pool = new pg.Pool(config);

pool.on('error', (err) => console.error(err));
pool.connect();


/* ===========================================================
numberOfSessionBundles
Defines the number of user visits to simulate
* Each visit is assigned to one user
* Each visit contains 1-100 research behaviors
=========================================================== */


const numberOfSessionBundles = 10;


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
    let user_id = newUser(); // generates new ids and visits
    // let user_id = existingUser(); // create new visits for existing users
    let session_id = newSession(); 
    let numberOfResearch = requestTypeFrequency();
    sessionResearchActivity(numberOfResearch, user_id, session_id);
  }
}

/* ===========================================================
sessionResearchActivity
-add "numberOfResearch" rows to sessionInfo table
-for each new row
  -retrieve random major pair from generateMajorPair
  -retrieve random indicator from generateResearchType
  -retrieve random interval from generateInterval
  -insert current user_id and session_id
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
const requestTypeFrequency = () => Math.floor((Math.random() * 100) + 1);


/* ===========================================================
create 8-digit user_id
=========================================================== */
const newUser = () =>  Math.floor((Math.random() * 1000000) + 1000000);

const existingUser = () => chance.pickone(topTraders.leadingTraders); // from pool of 100 traders
  // chance.pickone(topTraders.topTenTraders); // from pool of 10 most profitable


/* ===========================================================
create 9-digit session_id
=========================================================== */
const newSession = () => Math.floor((Math.random() * 10000000) + 10000000);


/* ===========================================================
generate Major Pair, no weighting
=========================================================== */
const generateMajorPair = () => {
  const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
  return chance.pickone(majorPairTypes); // unweighted
  // return chance.weighted(majorPairTypes, [50, 10, 5, 5, 40, 10, 10, 5, 25, 35]); // weighted for topTraders
}

/* ===========================================================
generate research type, weighted for MACD
=========================================================== */
const generateResearchType = () => {
  const researchTypes = ['MACD', 'EMA', 'MA'];
  return chance.weighted(researchTypes, [15, 12, 5]);
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

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, result) => {
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
  addResearchSessionData: addResearchSessionData,
  createSessionBundle: createSessionBundle
};

// createSessionBundle(numberOfSessionBundles);