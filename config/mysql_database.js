var mysql  = require('mysql');
var secret = require('./secret');

var connection = mysql.createConnection({
	host     : secret.mysql.host,
	user     : secret.mysql.user,
	password : secret.mysql.password,
	port     : secret.mysql.port,
	database : secret.mysql.database
});

exports.connection = connection;
