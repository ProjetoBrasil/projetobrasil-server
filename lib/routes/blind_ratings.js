
var ddb = require('../../config/dynamo_database').ddb;
var ratingModel = require('../model/ratingModel');
var Promise = require('promise');
var _ = require("underscore");

exports.update = function(req,res){
	var ratings = ratingModel.newRating(req);

	ddb.putItem('blindRatings', ratings, {}, function (err) {
		if (!err) {
			res.send(202,"Informação salva com sucesso.");

			return ddb.getItem('accounts', req._passport.session.user, null, {}, function (err, user) {
				if (!err) {

					var blindRatedProposals;

					if(user.blindRatedProposals == undefined){
						blindRatedProposals = [];
					}else{
						blindRatedProposals = user.blindRatedProposals;
						blindRatedProposals.forEach(function(element, index){
							if(element.substr(0, element.length - 1) == ratings.id)
								blindRatedProposals.splice(index, 1);
						});
					}

					blindRatedProposals.push(ratings.id + ratings.nota.toString());
					var updatedUser = { blindRatedProposals: {value: blindRatedProposals, action: 'PUT' }};

					ddb.updateItem('accounts', user.username, null, updatedUser, function (err, users) {
						if (!err) {
							console.log("Updated user");
						} else {
							console.log(err);
						}
					});

				} else {
					return console.log(err);
				}
			});

		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}