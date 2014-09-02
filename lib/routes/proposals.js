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

exports.updateMedia = function (id, newMedia){
	return ddb.updateItem('proposals', id, null, {media:{value:newMedia}}, function (err, proposals) {
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

				//remove duplicadas
				//conta a quantidade de cada politico

				proposals.items.forEach(function(element,index){
					if(element.politicians_id != undefined){
						if(politicians[element.politicians_id] == undefined){
							politicians[element.politicians_id] = [];
							politicians_ids.push(element.politicians_id);
						}
						politicians[element.politicians_id].push(index);

						//procura o a quantidade de avaliações que o mais avaliado possui
					}
				});

				//Preenche a lista do random com o maximo - quantidade + 1 itens para cada político selecionável;

				for(var i=0;i<req.params.qtd;i++){
					var randPolitician = parseInt(Math.random() * politicians_ids.length);
					var index = parseInt(Math.random() * politicians[politicians_ids[randPolitician]].length);
					items.push(proposals.items[politicians[politicians_ids[randPolitician]][index]]);

					//retira das possibilidades a proposta escolhida
					//retira das possibilidades uma do politico
					//se o politico não possui mais propostas retira ele das opções de políticos e todos ele da lista de possibilidades
					//se ele chega a zero registros na lista de prioridades readiciona todas os políticos a ela 1x
				}
				return res.send(items);
			} else {
				return console.log(err);
			}
		});
	});
};