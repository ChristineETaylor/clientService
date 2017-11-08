const Chance = require('chance');
const chance = new Chance();


/* ===========================================================
create 8-digit user_id
=========================================================== */
const newUser = () => Math.floor((Math.random() * 1000000) + 1000000);


/* ===========================================================
generate Major Pair (currently using only EURUSD)
=========================================================== */
const generateMajorPair = () => {
  const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
  return chance.pickone(majorPairTypes);
}

/* ===========================================================
generate Type
=========================================================== */
const generateType = () => {
  const types = ['BUY', 'SELL'];
  return chance.pickone(types);
}

/* ===========================================================
generate Price (EURUSD only, 1-2)
=========================================================== */
const generatePrice = () => {
  return chance.floating({ min: 1, max: 2 });
}

/* ===========================================================
generate Volume (1-1m)
=========================================================== */
const generateVolume = () => {
  return chance.integer({ min: 1, max: 1000000 });
}

/* ===========================================================
Order Request
- create single order request
=========================================================== */

const orderRequest = () => {
  let oneRequest = {
    type: generateType(),
    order: {
      user_id: newUser(),
      volume: generateVolume(),
      price: generatePrice()
    }
  }
  return oneRequest;
}


module.exports = {
  newUser: newUser,
  generateType: generateType,
  orderRequest: orderRequest
}