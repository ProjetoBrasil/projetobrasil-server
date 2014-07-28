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
			ddb.scan('accounts', {filter : { provider_id : profile._json.id}}, null, {}, function (err, users) {
				if(err){
					return done(err);
				}else
				{
					user = users[0];
					if(!user)
					{
						user = {
							name: profile.displayName,
							username: profile.emails[0].value,
							provider_id: profile.id,
							provider: 'facebook',
							facebook: profile._json
						};
						ddb.putItem('accounts', user, {}, function (err) {
							if (!err) {
								return done(err, user);
							} else {
								console.log(err);
								return done(err);
							}
						});
					}
					else{
						return done(err, user);
					}
				}
			});
		}
	);
};
