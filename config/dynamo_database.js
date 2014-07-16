var secret = require('./secret');

var ddb = require('dynamodb').ddb(secret.aws);

exports.ddb = ddb