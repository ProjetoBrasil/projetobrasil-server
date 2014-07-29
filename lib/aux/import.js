
var proposal = require('../routes/proposals');

exports.importProposal = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	//console.log(aux);

	var response = {};
	response.send = function(){};

	aux.forEach(function(element){
		console.log("Importando novo!");
		console.log(element);
		proposal.add(element, response);
	});

	res.send(202);

}