var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});

var tableName = "Users";
var password = require('password-hash-and-salt');

module.exports.login = function(event, cb) {

  var email = event.email;
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
  dynamodb.getItem(params, function(err, passwordHash) {
    if (err) {
      return cb(null,  {
        "message": "We had errors getting user details",
        "error": JSON.stringify(err)
      });
    }
    else {
      password(event.password).verifyAgainst(passwordHash, function(error, verified) {
        if (error)
          throw new Error('Something went wrong!');
        if (!verified) {
          return cb(null, = {
            message: "Your username or password did not match!",
            code : 403
          });
        }
        else {
          return cb(null, {
            message: "Logged in successfully!",
            code : 200
          });
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

module.exports.prereg = function(event, context) {
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
