

var findAll = function(req, res){
	res.send(require('../model/comment'));
}
exports.findAll = findAll;