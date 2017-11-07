const Chance = require('chance');
const chance = new Chance();


/* ===========================================================
create 8-digit user_id
=========================================================== */
const newUser = () => Math.floor((Math.random() * 1000000) + 1000000);


/* ===========================================================
generate Major Pair
=========================================================== */
const generateMajorPair = () => {
  const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
  return chance.pickone(majorPairTypes); // unweighted for new users
  // return chance.weighted(majorPairTypes, [50, 10, 5, 5, 40, 10, 10, 5, 25, 35]); // weighted for topTraders
}

/* ===========================================================
generate research type, weighted lightly for MACD
=========================================================== */
const generateResearchType = () => {
  const researchTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
  return chance.weighted(researchTypes, [20, 12, 5, 5, 10, 12]);
}

/* ===========================================================
generate research interval without 5s
(5s is served by default, no requests will be made on this interval)
=========================================================== */
const generateInterval = () => {
  const intervalTypes = ['1', '30', '1h', '1d', '1m'];
  return chance.weighted(intervalTypes, [20, 10, 20, 20, 15]);
}

/* ===========================================================
historiclIndicatorRequest
- create payload of single request for major pair research
=========================================================== */

const hiRequest = () => {
  let thisPayload = [];

  let oneRequest = {
    majorPair: generateMajorPair(),
    interval: generateInterval(),
    indicator: generateResearchType()
  }
  thisPayload.push(oneRequest);

  return thisPayload;
}


module.exports = {
  newUser: newUser,
  hiRequest: hiRequest
}