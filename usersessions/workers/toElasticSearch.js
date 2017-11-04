
/* WRITES TO ES-FRIENDLY JSON
/* ===========================================================
Generates fake data in ES-friendly JSON format
=============================================================*/
const addResearchSessionData = (record_id, user_id, session_id, requestType, majorPair, indicator, interval) => {

  // let values = [record_id, user_id, session_id, requestType, majorPair, indicator, interval];
  // console.log(values)

    var index = '{"index":{"_index":"usersessions","_type":"research","_id":' + record_id + '}}';
    var indexParsed = JSON.parse(index);
    // console.log(indexParsed);
    // console.log(JSON.stringify(indexParsed));
    var payload = '{"majorPair":"' + majorPair + '","indicator":"' + indicator + '","interval":"' + interval + '","user":' + user_id + ',"session":' + session_id + '}';
    var payloadParsed = JSON.parse(payload);
    // console.log(payloadParsed);
    // console.log(JSON.stringify(payloadParsed));
  

  fs.appendFileSync('./elasticsearch-5.6.3/sessioninfoES.json', JSON.stringify(indexParsed));
  // fs.appendFileSync('./elasticsearch-5.6.3/sessioninfoES.json', JSON.stringify(indexParsed));
  fs.appendFileSync('./elasticsearch-5.6.3/sessioninfoES.json', JSON.stringify(payloadParsed));
}
