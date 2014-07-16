var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var secret = require('../../config/secret');

var transport = nodemailer.createTransport(sesTransport(secret.aws));

export.sendMail = function(from, to, subject, text){
	transporter.sendMail({
	    from: from,
	    to: to,
	    subject: subject,
	    text: text
	});
}