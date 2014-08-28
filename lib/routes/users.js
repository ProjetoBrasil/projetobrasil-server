var ddb = require('../../config/dynamo_database').ddb;
var passport = require('passport');
var uuid = require('node-uuid');
var email = require('../service/email_service');
var mail_config =require('../../config/mail_config');
var userModel = require('../model/userModel');
var bcrypt =require('bcrypt');
var Promise = require('promise');
var _ = require("underscore");



var findAll = function (req, res){
	return ddb.scan('accounts', {}, function (err, users) {
		if (!err) {
			return res.send(users.items);
		} else {
			return console.log(err);
		}
	});
};

exports.update = function (req, res){
	var user = userModel.updateUser(req, false);

	return ddb.updateItem('accounts', req.params.username, null, user, function (err, users) {
		if (!err) {
			console.log("Updated user");
		} else {
			console.log(err);
		}
		return res.send(202, users);
	});
};

exports.findById = function (req, res){
	if(!req._passport.session.user) return res.send(401);
	return ddb.getItem('accounts', req._passport.session.user, null, {}, function (err, user) {
		if (!err) {
			return res.send(user);
		} else {
			return console.log(err);
		}
	});
};

exports.delete = function (req, res){
	ddb.deleteItem('accounts', req.params.username, null, {},  function (err, user) {
		if (!err) {
			console.log("Removed user");
			return res.send('');
		} else {
			console.log(err);
		}
	});
};

exports.register =  function(req, res, next) {
	var user = userModel.newUser(req, true);

	ddb.putItem('accounts', user, {}, function (err) {
		if (!err) {
			email.sendMail(mail_config.regularMailFrom, user.username, 'Confirmação de email', email.templateConfirm(user.comfirmationPass));
			return console.log("Created User");
		} else {
			return console.log(err);
		}
	});

	req.logIn(user, function(err) {
		if(err)
			return next(err);
		if(req.body.rememberme){
			req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
		}
		res.json(200, { "user": user });
	});
}

exports.login = function(req, res, next) {
	passport.authenticate('local', function(err, user) {

		if(err)     { return next(err); }
		if(!user)   { return res.send(400); }


		req.logIn(user, function(err) {
			if(err) {
				return next(err);
			}
			if(req.body.rememberme){
				req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
			}
			res.json(200, { "user": user });
		});
	})(req, res, next);
}

exports.logout= function(req, res) {
	req.logout();
	res.send(200);
}

exports.validadeMail = function (req, res){

	ddb.getItem('accounts', req.params.username, null, {}, function (err, user) {
		if (!err) {
			if(user.comfirmationPass == req.params.comfirmationPass){
				ddb.updateItem('accounts', req.params.username, null, {emailConfirmed:{value:"true"}}, function (err, users) {
					if (!err) {
						console.log("email validado");
					} else {
						console.log(err);
					}
					return res.send(202, "OK");
				});
			}
		}

		return res.send(403, "NOK");
	});
};

exports.findRatingsById = function (req, res){
	return ddb.scan('ratings', {filter : { username: { eq: req._passport.session.user}}}, function (err, ratings) {
		if (!err) {
			var response = {};
			ratings.items.forEach(function(element){ 
				response[element.id] = element.nota;
			});
			return res.send(response);
		} else {
			return console.log(err);
		}
	});
};

multipleFindBlindRatings = function(resolve, reject, options, result){
	return ddb.scan('blindRatings', options, function (err, ratings) {
		if (!err){
			if(result == undefined)
				result = ratings.items;
			else
				result = _.union(result, ratings.items);
			if(ratings.lastEvaluatedKey.hash == undefined){
				return resolve(result);
			}else{
				options.exclusiveStartKey = {hash: ratings.lastEvaluatedKey.hash, range : ratings.lastEvaluatedKey.range};
				multipleFindBlindRatings(resolve,reject,options, result);
			}
		}else {
			return reject(err);
		}
	});
};

returnProposals = function(res, user){
	var filter;
	var blindRatedProposals = [];
	var blindRating = [];

	user.blindRatedProposals.forEach(function(rated, index){
		blindRating.push(parseInt(rated.substr(rated.length - 1)));
		blindRatedProposals.push(rated.substr(0,rated.length - 1));
	});

	if(blindRatedProposals.length == 0)
		return res.send(200,{});
	if(blindRatedProposals.length == 1)
		filter = {filter : { id: { eq : blindRatedProposals[0]}}}
	else
		filter = {filter : { id: { in : blindRatedProposals}}}

	ddb.scan('proposals', filter, function (err, proposals) {
		if (!err) {
			proposals.items.forEach(function(element){
				blindRatedProposals.forEach(function(rated, index){
					if(element.id == rated)
						element.nota = user.blindRating[index];
				});
			});
			return res.send(proposals.items);
		} else {
			console.log(err);
			return res.send(400,err);
		}
	});
};

exports.findCompleteBlindRatingsById = function (req, res){
	return ddb.getItem('accounts', req._passport.session.user, null, {}, function (err, user) {
		if (!err) {
			if(user.imported == undefined){

				var promise = new Promise(function(resolve, reject){
					multipleFindBlindRatings(resolve,reject, {filter : { username: { eq: req._passport.session.user }}});
				});

				promise.then(function(result) {
					var blindRatedProposals = [];
					result.forEach(function(element){
						blindRatedProposals.push(element.id + element.nota.toString());
					});

					user.blindRatedProposals = blindRatedProposals;
					user.imported = true;

					returnProposals(res,user);

					var updatedUser = {imported: {value: 0, action: 'PUT' },
										blindRatedProposals: {value: blindRatedProposals, action: 'PUT' }};

					ddb.updateItem('accounts', user.username, null, updatedUser, function (err, users) {
						if (!err) {
							console.log("Updated user");
						} else {
							console.log(err);
						}
					});

				}, function(err){	
					console.log(err);
					return res.send(400,err);
				});
			}else
				returnProposals(res,user);
			
		} else {
			console.log(err);
			return res.send(err);
		}
	});
};
