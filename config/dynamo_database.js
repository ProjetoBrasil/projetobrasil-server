var fwk = require('fwk');
var config = fwk.baseConfig(); 

config['DYNAMODB_ACCESSKEYID']     = 'REPLACE_IN_ENV_OR_ARGS';
config['DYNAMODB_SECRETACCESSKEY'] = 'REPLACE_IN_ENV_OR_ARGS';

var cfg = fwk.populateConfig(config);

var ddb = require('dynamodb').ddb({ accessKeyId     : cfg['DYNAMODB_ACCESSKEYID'],
                                    secretAccessKey : cfg['DYNAMODB_SECRETACCESSKEY'] });

exports.config = cfg
exports.ddb = ddb