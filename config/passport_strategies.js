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
			var uname = profile.id;
			if(profile.emails != undefined)
				 uname = profile.emails[0].value;
			ddb.getItem('accounts', uname, null, {}, function (err, user) {

				if(err){
					//console.log("Deu erro");
					return done(err);
				}else
				{
					if(!user)
					{
						
						user = {
							nome: profile.displayName,
							username: uname,
							provider_id: profile.id,
							provider: 'facebook',
							dataNascimento: profile._json.birthday,
							sexo: profile._json.gender,
							exportFace: 0
						};

						if(profile.location != undefined)
							user.cidade = profile.location.id;

						if(profile._json.education != undefined){
							var max = 0;
							profile._json.education.forEach(function(item){
								var val;
								switch(item.type){
									case "High School": val = 1; break;
									case "College": val = 2; break;
									case "Graduate School": val = 3; break;
									default: val = 0;
								}
								if(val>max) max = val;
							});
							user.escolaridade = max;
						}

						ddb.putItem('accounts', user, {}, function (err) {
							if (!err) {
								//console.log("Criei usuário e to retornando ele.");
								return done(err, user);
							} else {
								//console.log("Erro ao criar usuário usuário.");
								console.log(err);
								return done(err);
							}
						});
					}
					else{
						if(user.exportFace == undefined){
							var newUser = {
								dataNascimento: {value: profile._json.birthday},
								sexo: {value: profile._json.gender},
								exportFace: {value: 0}
							};

							if(profile.location != undefined)
								newUser.cidade = {value: profile.location.id};

							if(profile._json.education != undefined){
								var max = 0;
								profile._json.education.forEach(function(item){
									var val;
									switch(item.type){
										case "High School": val = 1; break;
										case "College": val = 2; break;
										case "Graduate School": val = 3; break;
										default: val = 0;
									}
									if(val>max) max = val;
								});
								newUser.escolaridade = {value: max};
							}
							
							ddb.updateItem('accounts', user.username, null, newUser, function (err, updatedUser) {
								if (!err) {
									console.log("Updated User");
								} else {
									console.log(err);
								}
							});
						}
						return done(err, user);
					}
				}
			});
		}
	);
};
