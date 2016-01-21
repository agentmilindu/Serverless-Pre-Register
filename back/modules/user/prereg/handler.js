'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});


// Lambda Handler
module.exports.handler = function(event, context) {
  prereg(event, function(error, response) {
    return context.done(error, response);
  });
};

function prereg = function(event, context) {
  var tableName = "pre-regs";
  var datetime = new Date().getTime().toString();
  dynamodb.putItem({
    "TableName": tableName,
    "Item": {
      "name": {
        "S": event.name
      },
      "email": {
        "S": event.email
      },
      "date": {
        "S": datetime
      }
    }
  }, function(err, data) {
    if (err) {
      return cb(null, { message: "putting item into dynamodb failed" });
    }
    else {
      return cb(null, { message: "great success" });
    }
  });
};
