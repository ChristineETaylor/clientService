/* ===========================================================
dataGenSQS.js
Writes generated session bundles to sessioninfo SQS
=========================================================== */

const express = require('express');
const app = express();
const dataGenFunctions = require('./dataGenFunctions'); // all data generation functions


/* ===========================================================
AWS/SQS credentials and SQS instanciation
=========================================================== */
const AWS = require('aws-sdk');
const queueUrl = "http://sqs.us-west-1.amazonaws.com/481569304347/sessioninfo";

AWS.config.loadFromPath('../sqs/config.json');

const myCredentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'IDENTITY_POOL_ID' });
const myConfig = new AWS.Config({ credentials: myCredentials, region: 'us-west-1' });
const sqs = new AWS.SQS(); // Instantiate SQS

AWS.events.on('httpError', () => {
  if (this.response.error && this.response.error.code === 'UnknownEndpoint') {
    this.response.error.retryable = true;
  }
});

let generateBundles = (numberOfBundles) => {
  for (var n = 0; n < numberOfBundles; n++) {

    /* ===========================================================
    Attributes contains user ID and session ID
    =========================================================== */
    let attributes = {
      session_id: dataGenFunctions.newSession(),
      user_id: dataGenFunctions.existingUser()
      // user_id: dataGenFunctions.newUser()
    }


    /* ===========================================================
    Payload contains all research activity for one user's session
    =========================================================== */
    let payload = {
      payload: dataGenFunctions.sessionResearchActivity()
    }


    /* ===========================================================
    Message parameters contains JSON information to send to queue
    =========================================================== */
    let params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageAttributes: {
        user_id: { DataType: 'Number', StringValue: JSON.stringify(attributes.user_id) },
        session_id: { DataType: 'Number', StringValue: JSON.stringify(attributes.session_id) }
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

generateBundles(100000);
