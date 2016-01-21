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
var user = require('../lib');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});


// Lambda Handler
module.exports.handler = function(event, context) {
  user.prereg(event, function(error, response) {
    return context.done(error, response);
  });
};
