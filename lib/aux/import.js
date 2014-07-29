
var proposal = require('../routes/proposals');

exports.importProposal = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	console.log(aux);

	aux.forEach(function(element){
		proposal.add(element);
	});

}