const topTraders = require('./topTraders.js');

const Chance = require('chance');
const chance = new Chance();


/* ===========================================================
create 8-digit user_id or pull from existing top trader ids
=========================================================== */
const newUser = () => Math.floor((Math.random() * 1000000) + 1000000);

const existingUser = () => chance.pickone(topTraders.leadingTraders); // from pool of 100 traders
//const existingUser = () => chance.pickone(topTraders.topTenTraders); // from pool of 10 most profitable


/* ===========================================================
create 9-digit session_id
=========================================================== */
const newSession = () => Math.floor((Math.random() * 10000000) + 10000000);

/* ===========================================================
generate Major Pair
=========================================================== */
const generateMajorPair = () => {
  const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
  // return chance.pickone(majorPairTypes); // unweighted for new users
  return chance.weighted(majorPairTypes, [50, 10, 5, 5, 40, 10, 10, 5, 25, 35]); // weighted for topTraders
}

/* ===========================================================
generate research type, weighted lightly for MACD
=========================================================== */
const generateResearchType = () => {
  const researchTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
  return chance.weighted(researchTypes, [20, 12, 5, 5, 10, 12]);
}

/* ===========================================================
generate research interval, heavily weighted for 5s (default)
=========================================================== */
const generateInterval = () => {
  const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
  return chance.weighted(intervalTypes, [100, 20, 10, 20, 20, 5]);
}

/* ===========================================================
sessionResearchActivity
- create payload of research activity for one session/user
- for each new research activity
  -retrieve random major pair from generateMajorPair
  -retrieve random indicator from generateResearchType
  -retrieve random interval from generateInterval
- push each research activity to payload
=========================================================== */

const sessionResearchActivity = () => {
  let thisPayload = [];
  let numberOfResearchActivity = Math.floor((Math.random() * 100) + 1);

  for (let i = 0; i < numberOfResearchActivity; i++) {
    let oneResearchActivity = {
      majorPair: generateMajorPair(),
      interval: generateInterval(),
      indicator: generateResearchType()
    }
    thisPayload.push(oneResearchActivity);
  }
  return thisPayload;
}


module.exports = {
  newUser: newUser,
  existingUser: existingUser,
  newSession: newSession,
  sessionResearchActivity: sessionResearchActivity
}