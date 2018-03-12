const database = require('../usersessions/db/config.js');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const queueURL = "https://sqs.us-west-1.amazonaws.com/481569304347/sessioninfo";
const Promise = require('bluebird');


AWS.config.loadFromPath('../sqs/config.json');

if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));
  sqs.config.setPromisesDependency(require('bluebird'));  
}


const params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  VisibilityTimeout: 60,
  WaitTimeSeconds: 10
};

const getMessages = () => {
  sqs.receiveMessage(params).Promise()
    .then((results) => {
      if (results.Messages === undefined) {
        throw "Queue is clear."
      } else {
        return results
      }
    })
    .then((results) => {
      database.insertClientData(results.Messages[0]);

      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: results.Messages[0].ReceiptHandle
      };
      console.log(results.Messages[0].MessageAttributes)

      sqs.deleteMessage(deleteParams).promise()
        .then(() => {
          console.log("Message deleted from queue.")
          getMessages()
        })
    })
    .catch(error => {
      console.log(error);
      setTimeout(getMessages, 5000)
    })
}

getMessages();

module.exports.getMessages = getMessages;