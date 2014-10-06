exports.secretToken = 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx';

exports.facebookAppId = process.env.facebookAppId || '';

exports.facebookAppSecret = process.env.facebookAppSecret || '';

var aws = {};
aws.accessKeyId = process.env.DYNAMODB_ACCESSKEYID || '';
aws.secretAccessKey = process.env.DYNAMODB_SECRETACCESSKEY || '';

var mysql_info = {};
mysql_info.host = process.env.mysqlHost ||'';
mysql_info.user = process.env.mysqlUser ||'';
mysql_info.password = process.env.mysqlPassword ||'';
mysql_info.port = process.env.mysqlPort ||'3306';
mysql_info.database = process.env.mysqlDatabase ||'';

exports.mysql = mysql_info;

exports.aws = aws;