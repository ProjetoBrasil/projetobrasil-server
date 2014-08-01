
var proposal = require('../routes/proposals');
var curriculum = require('../routes/curriculum');

exports.importProposal = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	//console.log(aux);

	var response = {};
	response.send = function(){};

	aux.forEach(function(element){
		//console.log("Importando novo!");
		//console.log(element);
		proposal.add(element, response);
	});

	res.send(202);

}

exports.deleteProposal = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	//console.log(aux);

	var response = {};
	response.send = function(){};

	aux.forEach(function(element){
		//console.log("Importando novo!");
		//console.log(element);
		proposal.delete(element, response);
	});

	res.send(202);

}

exports.importCurriculum = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	//console.log(aux);

	var response = {};
	response.send = function(){};

	aux.forEach(function(element){
		var el = {param:{id:element.id}};
		curriculum.delete(el, response);
	});

	res.send(202);

}

exports.deleteCurriculum = function(req,res){
	var url = req.body.url || '';
	if(url=='') return;

	aux = require(url);

	//console.log(aux);

	var response = {};
	response.send = function(){};

	aux.forEach(function(element){
		var el = {param:{id:element.id}};
		curriculum.delete(el, response);
	});

	res.send(202);

}