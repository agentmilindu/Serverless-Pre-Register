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


// Lambda Handler
module.exports.handler = function(event, context) {
    lib.respond(event, function(error, response) {
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
                "previewAccess": {
                    "S": event.previewAccess
                },
                "date": {
                    "S": datetime
                }
            }
        }, function(err, data) {
            if (err) {
                context.done('putting item into dynamodb failed: ' + err);
            }
            else {
                console.log('great success: ' + JSON.stringify(data, null, '  '));
                // context.done({
                //     "name": {
                //         "S": event.name
                //     },
                //     "email": {
                //         "S": event.email
                //     },
                //     "previewAccess": {
                //         "S": event.previewAccess
                //     },
                //     "date": {
                //         "S": datetime
                //     }
                // });
                context.succeed('OK');
            }
        });
    });

};