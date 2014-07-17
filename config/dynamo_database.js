var secret = require('./secret');

exports.ddb = require('dynamodb').ddb(secret.aws);