/* ===========================================================
Dependencies
=========================================================== */
const fs = require('fs');

const Chance = require('chance');
const chance = new Chance();

const topTraders = require('./topTraders.js');

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
    // let record_id = generateRecordID();
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
    addJSONSessionData(user_id, session_id, 'research', majorPair, indicator, interval);
  }
  addJSONSessionData(user_id, session_id, 'END', 'END', 'END', 'END');
}

let startingRecord = 1;

const generateRecordID = () => {
  startingRecord++;
  return startingRecord;
}

/* ===========================================================
generate random num (0-100) for number of requests in user's visit
=========================================================== */
const requestTypeFrequency = () => Math.floor((Math.random() * 275) + 30);


/* ===========================================================
create 8-digit user_id
=========================================================== */
const newUser = () => Math.floor((Math.random() * 1000000) + 1000000);

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
  // return chance.pickone(majorPairTypes); // unweighted
  return chance.weighted(majorPairTypes, [245, 68, 28, 18, 65, 20, 10, 59, 31, 8]); // weighted by volume
}

/* ===========================================================
generate research type, weighted for MACD
=========================================================== */
const generateResearchType = () => {
  const researchTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
  // return chance.weighted(researchTypes, [5, 5, 5, 5, 10, 100]);
  return chance.pickone(researchTypes);
}

/* ===========================================================
generate research interval, heavily weighted for 5s
=========================================================== */
const generateInterval = () => {
  const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
  return chance.weighted(intervalTypes, [100, 25, 25, 30, 25, 15]);
}


/* WRITES TO ES-FRIENDLY JSON
/* ===========================================================
Generates fake data in ES-friendly JSON format
=============================================================*/
const addJSONSessionData = (user_id, session_id, requestType, majorPair, indicator, interval) => {
  
    // let values = [record_id, user_id, session_id, requestType, majorPair, indicator, interval];
    // console.log(values)
  
      var index = '{"index":{"_index":"usersessions","_type":"research"}}';
      var indexParsed = JSON.parse(index);
      // console.log(indexParsed);
      // console.log(JSON.stringify(indexParsed));
      var payload = '{"majorPair":"' + majorPair + '","indicator":"' + indicator + '","interval":"' + interval + '","user":' + user_id + ',"session":' + session_id + '}';
      var payloadParsed = JSON.parse(payload);
      // console.log(payloadParsed);
      // console.log(JSON.stringify(payloadParsed));
    
  
    fs.appendFileSync('sessioninfoES7.json', JSON.stringify(indexParsed));
    // fs.appendFileSync('./elasticsearch-5.6.3/sessioninfoES.json', JSON.stringify(indexParsed));
    fs.appendFileSync('sessioninfoES7.json', JSON.stringify(payloadParsed));
  }
  

var timesRun = 0;
var interval = setInterval(() => {
  timesRun++;
  if (timesRun === 100) {
    clearInterval(interval);
  }
  createSessionBundle(numberOfSessionBundles);
}, 1000);