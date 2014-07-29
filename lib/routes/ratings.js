
var ddb = require('../../config/dynamo_database').ddb;

var ratingModel = require('../model/ratingModel');

exports.generatesGraphById = function(req,res){
	return ddb.scan('ratings', {filter:{id:{eq:req.params.id}}}, function (err, ratings) {
		if (!err) {
			console.log(ratings);
			return res.send(ratings.items);
		} else {
			return console.log(err);
		}
	});
}

exports.findById = function (req, res){
	if (!req.user) {
        return res.send({username:null, id:req.params.id, nota:"0"});
    }
  	return ddb.getItem('ratings', req.params.id, req._passport.session.user, {}, function (err, rating) {
	    if (!err) {
	    	if(!rating)
	    		return res.send({username:req._passport.session.user, id:req.params.id, nota:"0"});
	      return res.send(rating);
	    } else {
	      return console.log(err);
	    }
  	});
};

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