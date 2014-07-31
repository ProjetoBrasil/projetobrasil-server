var ddb = require('../../config/dynamo_database').ddb;
var passport = require('passport');
var uuid = require('node-uuid');
var email = require('../service/email_service');
var mail_config =require('../../config/mail_config');
var userModel = require('../model/userModel');
var bcrypt =require('bcrypt');



var findAll = function (req, res){
  return ddb.scan('accounts', {}, function (err, users) {
    if (!err) {
      console.log(users);
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
        console.log("updated");
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
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};

exports.register =  function(req, res, next) {
  var user = userModel.newUser(req, true);

  console.log("POST: ");
  console.log(req.body);
  ddb.putItem('accounts', user, {}, function (err) {
    if (!err) {
      email.sendMail(mail_config.regularMailFrom, user.username, 'Confirmação de email', email.templateConfirm(user.comfirmationPass));
      return console.log("created");
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
      var response = [];
      ratings.items.forEach(function(element){ 
        console.log(element.id);
        response[element.id] = element.nota;
      });
      return res.send(response);
    } else {
      return console.log(err);
    }
  });
};