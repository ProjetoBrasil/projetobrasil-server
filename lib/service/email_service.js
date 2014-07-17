var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var secret = require('../../config/secret');

var transporter = nodemailer.createTransport(sesTransport(secret.aws));

exports.sendMail = function(from, to, subject, text){
	transporter.sendMail({
	    from: from,
	    to: to,
	    subject: subject,
	    text: text
	});
}

exports.templateConfirm = function(comfirmationPass){

	var texto = "Confirmação de email - Digite o código " + comfirmationPass.toString() + " para garantir que esse é seu email mesmo.";
}