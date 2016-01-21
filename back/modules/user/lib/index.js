/**
 * Lib
 */

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});

var tableName = "Users";

var password = require('password-hash-and-salt');


module.exports.login = function(event, cb) {

  var email = event.email;

  var response = {}

  var params = {
    AttributesToGet: [
      "password"
    ],
    TableName: tableName,
    Key: {
      "email": {
        "S": email
      }
    }
  }

  var myuser = [];

  dynamodb.getItem(params, function(err, passwordHash) {
    if (err) {
      console.log(err); // an error occurred
      response = {
        "message": "We had errors getting user details",
        "error": JSON.stringify(err)
      }
      return cb(null, response);
    }
    else {
      // Verifying the hash
      password(event.password).verifyAgainst(passwordHash, function(error, verified) {
        if (error)
          throw new Error('Something went wrong!');
        if (!verified) {
          var response = {
            message: "Your username or password did not match!",
            code : 403
          };
          return cb(null, response);
        }
        else {
          var response = {
            message: "Logged in successfully!",
            code : 200
          };
          return cb(null, response);
        }
      });
    }
  });

};

module.exports.signup = function(event, cb) {

  var datetime = new Date().getTime().toString();

  password(event.password).hash(function(error, hash) {
    if(error)
    throw new Error('Something went wrong!');

    dynamodb.putItem({
      "TableName": tableName,
      "Item": {
        "name": {
          "S": event.name
        },
        "email": {
          "S": event.email
        },
        "password": {
          "S": hash
        },
        "date": {
          "S": datetime
        }
      }
    }, function(err, data) {
      if (err) {
        return cb(null, { message: "You got registered successfully!" });
      }
      else {
        return cb(null,  { message: "We could not register you successfully!" });
      }
    });

  });


};

module.exports.preReg = function(event, context) {
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
      context.succeed('OK');
    }
  });

};
