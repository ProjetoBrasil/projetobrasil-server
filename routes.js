var jwt = require('express-jwt'),
	secret = require('./config/secret');

function setup(app) {
	//Routes
	var politicians = require('./lib/routes/politicians.js'),
		proposals = require('./lib/routes/proposals.js'),
		political_parties = require('./lib/routes/political_parties'),
		users = require('./lib/routes/users');

	//Local login routes
	app.post('/v1/user/register', users.register);
	app.post('/v1/user/login', users.login);
	app.get('/v1/user/logout', users.logout); 
	
	//Login Twitter:
	//app.get('/v1/connect/twitter', users.loginTwitter);
	//app.get('/v1/connect/twitter/callback', users.loginTwitterCalback);

	//Login Facebook:
	//app.get('/v1/auth/facebook', users.loginTwitter);
	//app.get('/v1/auth/facebook/callback', users.loginTwitterCalback);

	//Login Google:
	//app.get('/v1/auth/google', users.loginTwitter);
	//app.get('/v1/auth/google/return', users.loginTwitterCalback);

	//Login Linkedin:
	//app.get('/v1/auth/linkedin', users.loginTwitter);
	//app.get('/v1/auth/linkedin/callback', users.loginTwitterCalback);

	//Politicians routes
	app.get('/v1/politicians', politicians.findAll);
	app.get('/v1/politician/:id', politicians.findById);
	app.get('/v1/politician/:id/proposals', politicians.findProposalsById);
	app.post('/v1/politician', politicians.add);
	app.put('/v1/politician/:id', politicians.update);
	app.delete('/v1/politician/:id', politicians.delete);

	//Proposals routes
	app.get('/v1/proposals', proposals.findAll);
	app.get('/v1/proposal/:id', proposals.findById);
	app.post('/v1/proposal', proposals.add);
	app.put('/v1/proposal/:id', proposals.update);
	app.delete('/v1/proposal/:id', proposals.delete); 

	//Political Parties routes
	app.get('/v1/political_parties', political_parties.findAll);
	app.get('/v1/political_parties/:sigla', political_parties.findById);
	app.post('/v1/political_parties', political_parties.add);
	app.put('/v1/political_parties/:sigla', political_parties.update);
	app.delete('/v1/political_parties/:sigla', political_parties.delete); 
};

exports.setup = setup;