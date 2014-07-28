

exports.findById = function(req,res){
	return ddb.scan('ratings', {filter:{}}, function (err, ratings) {
    if (!err) {
      console.log(ratings);
      return res.send(ratings.items);
    } else {
      return console.log(err);
    }
  });
}

exports.update = function(req,res){
	res.send(require("../model/rating"));
}