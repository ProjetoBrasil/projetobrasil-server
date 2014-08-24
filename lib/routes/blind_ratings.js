
var ddb = require('../../config/dynamo_database').ddb;
var ratingModel = require('../model/ratingModel');
var Promise = require('promise');
var _ = require("underscore");

multipleFindBlindRatings = function(resolve, reject, options, result){
	return ddb.scan('blindRatings', options, function (err, ratings) {
		if (!err){
			if(result == undefined)
				result = ratings.items;
			else
				result = _.union(result, ratings.items);
			if(ratings.lastEvaluatedKey.hash == undefined){
				return resolve(result);
			}else{
				options.exclusiveStartKey = {hash: ratings.lastEvaluatedKey.hash, range : ratings.lastEvaluatedKey.range};
				multipleFindBlindRatings(resolve,reject,options, result);
			}
		}else {
			return reject(err);
		}
	});
};


exports.update = function(req,res){
	var ratings = ratingModel.newRating(req);

	ddb.putItem('blindRatings', ratings, {}, function (err) {
		if (!err) {
			var promise = new Promise(function(resolve, reject){
				multipleFindBlindRatings(resolve,reject, {filter : { username: { eq: req._passport.session.user }}});
			});

			promise.then(function(result) {
				return res.send({count : result.length});
			}, function(err){
				return res.send(200,"Informação salva, mas erro ao contar quantos votos já foram feitos");
			});
		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}