'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var _ = require('underscore');
var mysql = require('../../config/mysql_database').connection;

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
	var id = req.params.id || 1000;
	mysql.query('SELECT * from duplasUFC where duplasUFC.id not in (select id_dupla from notasUFC where notasUFC.id_user = ?) and id_tema = ? ',
		[req._passport.session.user, id], function(err, rows, fields) {
		if (err){
			console.log(err);
			res.send(500)
		}
		else if(rows[0] == undefined){
			res.send(422, "Não existem mais propostas para essa categoria.");
		}
		else{

			var index = parseInt(Math.random() * rows.length);

			mysql.query('SELECT * from propostasUFC where id  in (?,?)',
				[rows[index].id_proposta1, rows[index].id_proposta2], function(err, proposals, fields) {
				
				var resposta = [];
				if(parseInt(Math.random() * 2) == 1){
					resposta.push(proposals[0]);
					resposta.push(proposals[1]);
				}else{
					resposta.push(proposals[1]);
					resposta.push(proposals[0]);
				}
				res.send(resposta);
			});
		}
	});
};

exports.saveUFCVote = function(req, res){
	if(req.body.propostas == undefined)
		res.send(500, "Propostas não foram definidas");

	mysql.query('INSERT INTO notasUFC (id_user, id_proposta_ganhadora, id_dupla, created_at) VALUE (?,?,(SELECT id FROM duplasUFC WHERE id_proposta1 IN(?,?) AND id_proposta2 IN(?,?)), ?)',
		[req._passport.session.user, req.body.propostas[0], req.body.propostas[1], req.body.propostas[0], req.body.propostas[0], req.body.propostas[1], Date.now()],
		function(err, rows, fields) {
			if (err) console.log(err);
			res.send(200);
		});
};

//SQL PARA O RANKING GERAL
exports.rankUFC = function(req, res){
	mysql.query('SELECT COUNT(id_user) AS quantidade, id_politicians, id_tema FROM notasUFC AS notas RIGHT JOIN propostasUFC ON id_proposta_ganhadora = propostasUFC.id GROUP BY id_tema, id_politicians',
		function(err, rows, fields) {
		if (err) console.log(err);
		var resposta = {};

		rows.forEach(function(row,index){
			if(resposta[row.id_politicians] == undefined)
				resposta[row.id_politicians] = {};

			resposta[row.id_politicians][row.id_tema] = row.quantidade;
		});

		res.send(resposta);
	});
};

//SQL PARA O RANKING DO USUÁRIO
//select count(id_user) as quantidade, id_politicians, id_tema from (select * from notasUFC where id_user = ?) as notas right join propostasUFC on id_proposta_ganhadora = propostasUFC.id group by id_tema, id_politicians; 

exports.profileRankUFC = function(req, res){
	mysql.query('SELECT COUNT(id_user) as quantidade, id_politicians, id_tema from (select * from notasUFC where id_user = ?) as notas right join propostasUFC on id_proposta_ganhadora = propostasUFC.id group by id_tema, id_politicians',
		[req._passport.session.user],function(err, rows, fields) {
		if (err) console.log(err);
		var resposta = {};

		rows.forEach(function(row,index){
			if(resposta[row.id_politicians] == undefined)
				resposta[row.id_politicians] = {};

			resposta[row.id_politicians][row.id_tema] = row.quantidade;
		});

		res.send(resposta);
	});
};

exports.importPropostas = function(){
	res.send(202);
	var temasUFC = {
				"Cultura e Turismo": 1000,
				"Democracia e Reforma Política": 1001,
				"Desenvolvimento Econômico": 1002,
				"Direitos Humanos e Inclusão social": 1003,
				"Educação": 1004,
				"Esporte e lazer": 1005,
				"Gestão Pública": 1006,
				"Infraestrutura": 1007,
				"Liberdades civis": 1008,
				"Segurança Pública": 1009,
				"Meio-ambiente": 1010,
				"Política Econômica": 1011,
				"Política Externa e Defesa Nacional": 1012,
				"Políticas Sociais": 1013,
				"Saúde": 1014,
				"Outros": 1015
			}

	ddb.scan('proposals', {}, function (err, proposals) {
		if (!err) {
			proposals.items.forEach(function(proposal, index){
				if(proposal.politicians_id == "827c9cc0-0d10-11e4-a4de-3d18690f2356" || proposal.politicians_id == "b6bc0250-0d10-11e4-b416-b9cab1b63b1e"){
					mysql.query('INSERT INTO propostasUFC (id, id_politicians, id_tema, titulo) VALUE (?, ?, ?, ?)',
					[proposal.id, proposal.politicians_id, temasUFC[proposal.tema], proposal.titulo],
					function(err, rows, fields) {
						if (err) console.log(err);
					});
				}
			});
		} else {
			return console.log(err);
		}
	});
};