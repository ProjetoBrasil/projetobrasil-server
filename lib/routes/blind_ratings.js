
var ddb = require('../../config/dynamo_database').ddb;
var ratingModel = require('../model/ratingModel');
var Promise = require('promise');
var _ = require("underscore");

exports.update = function(req,res){
	var ratings = ratingModel.newRating(req);

	ddb.putItem('blindRatings', ratings, {}, function (err) {
		if (!err) {
			return res.send(200,"Informação salva com sucesso.");
		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}