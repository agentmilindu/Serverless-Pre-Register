'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var lib = require('../lib');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});

var Git = require("nodegit");


// Lambda Handler
module.exports.handler = function(event, context) {
  var tableName = "Git";
  var datetime = new Date().getTime().toString();

  Git.Clone("https://github.com/agentmilindu/Serverless-Pre-Register.git ", "/tmp/repo").then(function(repository) {
    dynamodb.putItem({
      "TableName": tableName,
      "Item": {
        "id": {
          "S": Date.now().toString()
        },
        "json": {
          "S": JSON.stringify(repository)
        }
      }
    }, function(err, data) {
      if (err) {
        context.done('error', 'putting item into dynamodb failed: ' + err + " " + event.name);
        console.log('error: ' + JSON.stringify(err, null, '  '));
      }
      else {
        console.log('great success: ' + JSON.stringify(data, null, '  '));
        context.done('OK');
      }
    });
  }, 
  function(e){
	console.log(e);
  });
};
