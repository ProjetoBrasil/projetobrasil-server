var FacebookStrategy = require('passport-facebook').Strategy,
	LocalStrategy =   require('passport-local').Strategy;

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
							email: profile.emails[0].value,
							username: profile.username,
							provider_id: profile.id,
							provider: 'facebook',
							facebook: profile._json
						};
						ddb.putItem('politicians', politician, {}, function (err) {
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

exports.localStrategy = function(){
	return new LocalStrategy(function(username, password, done) {
		ddb.getItem('accounts', username, null, {}, function(err, res, user) {
			if(err)
				done(err);
			if(!user) {
				done(null, false, { message: 'Incorrect username.' });
			}
			else if(user.password != password) {
				done(null, false, { message: 'Incorrect username.' });
			}
			else {
				return done(null, user);
			}
	  	});
	});
}
