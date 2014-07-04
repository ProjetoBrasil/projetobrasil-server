var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
//var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');

app.listen(4242);
app.use(bodyParser());
app.use(morgan());

//Routes
var routes = {};
routes.politicians = require('./lib/routes/politicians.js');
routes.proposals = require('./lib/routes/proposals.js');


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://api.projetobrasil.org');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

/*
//Create a new user
app.post('/v1/user/register', routes.users.register); 

//Login
app.post('/v1/user/signin', routes.users.signin); 

//Logout
app.get('/v1/user/logout', jwt({secret: secret.secretToken}), routes.users.logout); 
*/

//Get all politicians
app.get('/v1/politicians', routes.politicians.findAll);

//Get a politician
app.get('/v1/politician/:id', routes.politicians.findById);

//Create a new politician
app.post('/v1/politician', routes.politicians.add); 

//Edit the politician id
app.put('/v1/politician/:id', routes.politicians.update); 

//Delete the post id
app.delete('/v1/politician/:id', routes.politicians.delete);

//Get all proposals
app.get('/v1/proposals', routes.proposals.findAll);

//Get a proposal
app.get('/v1/proposal/:id', routes.proposals.findById);

//Create a new proposal
app.post('/v1/proposal', routes.proposals.add); 

//Edit the proposal id
app.put('/v1/proposal/:id', routes.proposals.update); 

//Delete the proposal id
app.delete('/v1/proposal/:id', routes.proposals.delete); 

//Get all political_parties
app.get('/v1/political_parties', routes.political_parties.findAll);

//Get a political_parties
app.get('/v1/political_parties/:sigla', routes.political_parties.findById);

//Create a new political_parties
app.post('/v1/political_parties', routes.political_parties.add); 

//Edit the political_parties sigla
app.put('/v1/political_parties/:sigla', routes.political_parties.update); 

//Delete the political_parties sigla
app.delete('/v1/political_parties/:sigla', routes.political_parties.delete); 

console.log('Projeto Brasil API is starting on port 4242');

