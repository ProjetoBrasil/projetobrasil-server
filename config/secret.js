exports.secretToken = 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx';

exports.facebookAppId = process.env.facebookAppId || '';

exports.facebookAppSecret = process.env.facebookAppSecret || '';

exports.aws = {
	accessKeyId: process.env.DYNAMODB_ACCESSKEYID || '',
	secretAccessKey: process.env.DYNAMODB_SECRETACCESSKEY || ''
}
