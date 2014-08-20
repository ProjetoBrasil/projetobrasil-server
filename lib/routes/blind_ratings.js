
var ddb = require('../../config/dynamo_database').ddb;
var ratingModel = require('../model/ratingModel');


exports.update = function(req,res){
	var ratings = ratingModel.newRating(req);

	ddb.putItem('blindRatings', ratings, {}, function (err) {
		if (!err) {
			return ddb.scan('blindRatings',{filter : { username: { eq: req._passport.session.user }}}, function (err, blindRatings) {
				if (!err) {
					return res.send(blindRatings.toString());
				} else {
					return res.send(200,"Informação salva, mas erro ao contar quantos votos já foram feitos");
				}
			});
		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}