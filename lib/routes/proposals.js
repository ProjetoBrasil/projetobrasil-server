'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var _ = require('underscore');

var proposalModel = require('../model/proposalModel');

exports.findAll = function (req, res){
	return ddb.scan('proposals', {}, function (err, proposals) {
		if (!err) {
			return res.send(_.sortBy(proposals.items, function(element){
				return element.tema + element.subtema;
			}) );
		} else {
			return console.log(err);
		}
	});
};

exports.add = function (req, res){
	var proposal = proposalModel.newProposal(req);
	ddb.putItem('proposals', proposal, {}, function (err) {
		if (!err) {
			return console.log("Created Proposal");
		} else {
			return console.log(err);
		}
	});
	return res.send(202,proposal);
};

exports.findById = function (req, res){
	return ddb.getItem('proposals', req.params.id, null, {}, function (err, proposal) {
		if (!err) {
			return res.send(proposal);
		} else {
			return console.log(err);
		}
	});
};

exports.update = function (req, res){
	var proposal = proposalModel.updateProposal(req);

	return ddb.updateItem('proposals', req.params.id, null, proposal, function (err, proposals) {
		if (!err) {
			console.log("Updated Proposal");
		} else {
			console.log(err);
		}
		return res.send(202, proposals);
	});
};

exports.updateMedia = function (id, newMedia, field){
	var options = {};
	options[field] = {value:newMedia};

	return ddb.updateItem('proposals', id, null, options, function (err, proposals) {
		if (err) {
			console.log(err);
		}
	});
};

exports.delete = function (req, res){
	ddb.deleteItem('proposals', req.params.id, null, {},  function (err, proposal) {
		if (!err) {
			console.log("Removed Proposal");
			return res.send('');
		} else {
			console.log(err);
		}
	});
};

exports.findRandom = function (req, res){
	return ddb.getItem('accounts', req._passport.session.user, null, {}, function (err, user) {

		return ddb.scan('proposals', {}, function (err, proposals) {
			if (!err) {
				var items = [];
				var politicians = [];
				var politicians_ids = [];
				var blindRatedProposals = [];
				var qtdVotes = [];
				var max = 0;
				var probabilityArray = [];

				if(user != undefined && user.blindRatedProposals != undefined){
					user.blindRatedProposals.forEach(function(rated, index){
						blindRatedProposals[rated.substr(0,rated.length - 1)] = true;
					});
				}

				proposals.items.forEach(function(element,index){
					if(element.politicians_id != undefined){
						if(politicians[element.politicians_id] == undefined){
							politicians[element.politicians_id] = [];
							politicians_ids.push(element.politicians_id);
						}

						//Adiciona somente se ainda não foi avaliada
						if(blindRatedProposals[element.id] != true){
							politicians[element.politicians_id].push(index);
						}else{

							//conta a quantidade de cada politico
							qtdVotes[element.politicians_id] = (qtdVotes[element.politicians_id] || 0) + 1;
							
							//procura a quantidade de avaliações que o mais avaliado possui
							if(qtdVotes[element.politicians_id]>max)
								max = qtdVotes[element.politicians_id];
						}

					}
				});

				//Preenche a lista do random com o maximo - quantidade + 1 itens para cada político selecionável;
				politicians_ids.forEach(function(element, index){
					if(politicians[element].length > 0){
						for(var i = 0; i < max - (qtdVotes[element]||0) + 1; i++){
							probabilityArray.push(element);
						}
					}
				});

				for(var i=0;i<req.params.qtd;i++){
					//console.log(probabilityArray);
					var randPolitician = parseInt(Math.random() * probabilityArray.length);
					var removed = probabilityArray[randPolitician];
					var index = parseInt(Math.random() * politicians[removed].length);

					items.push(proposals.items[politicians[removed][index]]);

					//retira das possibilidades a proposta escolhida
					politicians[removed].splice(index,1);

					//se o politico não possui mais propostas retira ele das opções de políticos e todos ele da lista de possibilidades
					if(politicians[removed].length == 0){
						
						probabilityArray = _.without(probabilityArray, removed);
					}else{
						//retira das possibilidades somente uma do politico
						probabilityArray.splice(randPolitician,1);

						//se ele chega a zero registros na lista de prioridades readiciona todas os políticos a ela 1x
						if(_.indexOf(probabilityArray, removed) == -1){
							politicians_ids.forEach(function(element, index){
								if(politicians[element].length > 0){
									probabilityArray.push(element);
								}
							});
						}
					}


				}
				return res.send(items);
			} else {
				return console.log(err);
			}
		});
	});
};

exports.findUFC = function(req, res){
	res.send([{id: "123", politicians_id : "test", titulo: "test"},{id: "321", politicians_id : "test2", titulo: "test2"}]);
};