var ddb = require('../../config/dynamo_database').ddb;
var passport = require('passport');
var uuid = require('node-uuid');

var updateUser = function(req, newP){
  var user = {updated_at :  Date.now()};

  if(newP){
    user.id = uuid.v1();
    user.created_at = Date.now();
    user.username = req.body.username || '';
    user.emailConfirmed = false;
  }

  var password = req.body.password || '';
  if(password != '')
    user.password = password;

  var nome = req.body.nome || '';
  if(nome != '')
    user.nome = nome;

  var sobrenome = req.body.sobrenome || '';
  if(sobrenome != '')
    user.sobrenome = sobrenome;


  return user;
}

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


var add = function (req, res){
  var user = updateUser(req, true);

  console.log("POST: ");
  console.log(req.body);
  ddb.putItem('accounts', user, {}, function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return user;
};

exports.update = function (req, res){
  var user = updateUser(req, false);

  return ddb.updateItem('accounts', req.body.username, null, user, function (err, users) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, users);
  });
};

exports.findById = function (req, res){
  return ddb.getItem('accounts', req.params.username, null, {}, function (err, user) {
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
    var user = add(req, res);

    req.logIn(user, function(err) {
        if(err)     { next(err); }
        else        { res.json(200, {"username": user.username }); }
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

            if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
            res.json(200, { "username": user.username });
        });
    })(req, res, next);
}

exports.logout= function(req, res) {
    req.logout();
    res.send(200);
}