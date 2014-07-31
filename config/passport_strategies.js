var FacebookStrategy = require('passport-facebook').Strategy,
	LocalStrategy =   require('passport-local').Strategy;

var bcrypt =require('bcrypt');

var ddb = require('./dynamo_database').ddb;


exports.facebookStrategy = function (facebookAppId, facebookAppSecret) {
	return new FacebookStrategy({
			clientID: facebookAppId,
			clientSecret: facebookAppSecret,
			callbackURL: '/v1/auth/facebook/callback'
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			ddb.scan('accounts', {filter : { provider_id : {eq:profile._json.id}}}, function (err, users) {

				if(err){
					console.log("Deu erro");
					return done(err);
				}else
				{
					console.log("Procurando usuário:");
					user = users[0];
					if(!user)
					{
						console.log("Não achou usuário. Tentarei criar um.");
						user = {
							nome: profile.displayName,
							username: profile.emails[0].value,
							provider_id: profile.id,
							provider: 'facebook'
						};
						ddb.putItem('accounts', user, {}, function (err) {
							if (!err) {
								console.log("Criei usuário e to retornando ele.");
								return done(err, user);
							} else {
								console.log("Erro ao criar usuário usuário.");
								console.log(err);
								return done(err);
							}
						});
					}
					else{
						console.log("Achou usuário, retornando ele.");
						return done(err, user);
					}
				}
			});
		}
	);
};
