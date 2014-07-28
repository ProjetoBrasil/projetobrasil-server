
var ddb = require('../../config/dynamo_database').ddb;

var ratingModel = require('../model/ratingModel');

exports.findById = function(req,res){
	return ddb.scan('ratings', {filter:{id:{eq:req.params.id}}}, function (err, ratings) {
		if (!err) {
			console.log(ratings);
			return res.send(ratings.items);
		} else {
			return console.log(err);
		}
	});
}

exports.update = function(req,res){
	var ratings = ratingModel.newRating(req, true);

	console.log("POST: ");
	console.log(req.body);
	ddb.putItem('ratings', ratings, {}, function (err) {
		if (!err) {
			return res.send(200,ratings);
		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}