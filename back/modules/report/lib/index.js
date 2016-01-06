/**
 * Lib
 */

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});

var tableName = "Maturify";

module.exports.respond = function(event, cb) {

  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return r.toString(16);
  });
  
  var response = {}

  dynamodb.putItem({
    "TableName": tableName,
    "Item": {
      "id": {
        "S": uuid
      },
      "report": {
        "S": JSON.stringify(event.report)
      }
    }
  }, function(err, data) {
    if (err) {
      console.log('error: ' + JSON.stringify(err, null, '  '));
      response = {
        "message": "Putting item into dynamodb failed!",
        "error": JSON.stringify(err)
      }
      return cb(null, response);
    }
    else {
      console.log('great success');
      response = {
        "message": "Great success!",
        "uuid": uuid
      }
      return cb(null, response);
    };
  });
};

