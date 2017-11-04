// Require objects.
var express = require('express');
var app = express();
var AWS = require('aws-sdk');
var queueUrl = "http://sqs.us-west-1.amazonaws.com/481569304347/sessioninfo";
var receipt = "";

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

var myCredentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'IDENTITY_POOL_ID' });
var myConfig = new AWS.Config({
    credentials: myCredentials, region: 'us-west-1b'
});

// Instantiate SQS.
var sqs = new AWS.SQS();

AWS.events.on('httpError', function () {
    if (this.response.error && this.response.error.code === 'UnknownEndpoint') {
        this.response.error.retryable = true;
    }
});


// Creating a queue.
app.get('/create', function (req, res) {
    var params = {
        QueueName: "sessioninfo"
    };

    sqs.createQueue(params, function (err, data) {
        console.log('region:', this.request.httpRequest.region);
        console.log("ENDPOINT", this.request.httpRequest.endpoint);

        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Listing our queues.
app.get('/list', function (req, res) {
    sqs.listQueues(function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Sending a message.
app.get('/send', function (req, res) {
    var params = {
        MessageBody: 'Sending sessioninfo message to queue!',
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Receive a message.
// NOTE: This is a great long polling example. You would want to perform
// this action on some sort of job server so that you can process these
// records. In this example I'm just showing you how to make the call.
// It will then put the message "in flight" and I won't be able to 
// reach that message again until that visibility timeout is done.
app.get('/receive', function (req, res) {
    var params = {
        QueueUrl: queueUrl,
        VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
    };

    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Deleting a message.
app.get('/delete', function (req, res) {
    var params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receipt
    };

    sqs.deleteMessage(params, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Purging the entire queue.
app.get('/purge', function (req, res) {
    var params = {
        QueueUrl: queueUrl
    };

    sqs.purgeQueue(params, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// Start server.
var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('AWS SQS example app listening at http://%s:%s', host, port);
});

