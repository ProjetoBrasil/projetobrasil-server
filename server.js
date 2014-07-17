var express = require('express'),
	routes = require('./routes'),
	app = express(),
	jwt = require('express-jwt'),
	bodyParser = require('body-parser'), //bodyparser + json + urlencoder
	morgan  = require('morgan'), // logger
	cookieSession = require('cookie-session'),
	//tokenManager = require('./config/token_manager'),
	secret = require('./config/secret'),
	passport = require('passport');

var ddb = require('./config/dynamo_database').ddb,
	LocalStrategy =   require('passport-local').Strategy;

app.listen(4242);
app.use(bodyParser());
app.use(morgan());
app.use(cookieSession({ keys: ['key1','key2']}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user.username);
});


passport.deserializeUser(function(username, done) {
	ddb.getItem('accounts', username, null, {}, function (err, user) {
		if (!err) {
			done(err, user);
		} else {
			console.log(err);
			done(err);
		}
	});
});

strategies = require('./config/passport_strategies');

//passport.use(strategies.facebookStrategy(secret.facebookAppId, secret.facebookAppSecret));

passport.use(new LocalStrategy(function(username, password, done) {
		ddb.getItem('accounts', username, null, {}, function(err, res, user) {
			if(err)
				done(err);
			if(!user) {
				done(null, false, { message: 'Incorrect username.' });
			}
			else if(res.password != password) {
				done(null, false, { message: 'Incorrect username.' });
			}
			else {
				return done(null, res);
			}
	  	});
	}));

app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', req.headers.origin);
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	if ('OPTIONS' == req.method) return res.send(200);
	next();
});

routes.setup(app);


console.log('Projeto Brasil API is starting on port 4242');

