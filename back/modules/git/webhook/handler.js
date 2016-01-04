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
var fs = require('fs');


// Lambda Handler
module.exports.handler = function(event, context) {
  var tableName = "Git";
  var datetime = new Date().getTime().toString();
  var repoURL = "https://github.com/agentmilindu/Serverless-Pre-Register.git";
  var repoDir = "/tmp/repo";

  fs.access(repoDir, fs.R_OK | fs.W_OK, function(err) {
    ((!err) ? Git.Repository.open(repoDir) :
      Git.Clone(repoURL, repoDir, null))
    .then(function(repository) {
        return repository.getBranchCommit("master");
      })
      .then(function(commit) {
        return commit.getEntry("README.md");
      })
      .then(function(entry) {
        console.log(entry);
        dynamodb.putItem({
          "TableName": tableName,
          "Item": {
            "id": {
              "S": Date.now().toString()
            },
            "json": {
              "S": JSON.stringify(entry)
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
      })
      .catch(function(err) {
        console.log(err);
      });
  });

};
