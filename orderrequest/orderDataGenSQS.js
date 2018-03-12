/* ===========================================================
orderDataGenSQS.js
Writes generated order requests to orderrequest SQS
=========================================================== */

const express = require('express');
const app = express();
const orderFunctions = require('./orderFunctions.js'); // all data generation functions


/* ===========================================================
AWS/SQS credentials and SQS instantiation
=========================================================== */
const AWS = require('aws-sdk');
const queueUrl = "http://sqs.us-west-1.amazonaws.com/481569304347/orderrequests";

AWS.config.loadFromPath('../sqs/config.json');

const myCredentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'IDENTITY_POOL_ID' });
const myConfig = new AWS.Config({ credentials: myCredentials, region: 'us-west-1' });
const sqs = new AWS.SQS(); // Instantiate SQS

AWS.events.on('httpError', () => {
  if (this.response.error && this.response.error.code === 'UnknownEndpoint') {
    this.response.error.retryable = true;
  }
});

/* ===========================================================
Generate and send 1000 user orders to orderrequests queue
=========================================================== */
let generateBundles = () => {
  for (var n = 0; n < 1000; n++) {

    /* ===========================================================
    Attributes contains major pair (currently, Order Book is only consuming EURUSD)
    =========================================================== */
    let attributes = {
      majorPair: 'EURUSD'
    }

    /* ===========================================================
    Payload contains single order request
    =========================================================== */
    let payload = {
      payload: orderFunctions.orderRequest()
    }

    /* ===========================================================
    Message parameters contains JSON information to send to queue
    =========================================================== */
    let params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageAttributes: {
        majorPair: { DataType: 'String', StringValue: JSON.stringify(attributes.majorPair) }
      },
      DelaySeconds: 0
    };


    /* ===========================================================
    Send message with complete session info to SQS
    =========================================================== */
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  }
}

var timesRun = 0;
var interval = setInterval(() => {
  timesRun++;
  if (timesRun === 100) {
    clearInterval(interval);
  }
  generateBundles();
}, 10000);