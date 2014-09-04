
var ddb = require('../../config/dynamo_database').ddb;
var _ = require('underscore');
var ratingModel = require('../model/ratingModel');
var proposals = require('./proposals');

estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

exports.generatesGraphById = function(req,res){
	return ddb.scan('ratings', {filter:{id:{eq:req.params.id}}}, function (err, ratings) {
		if (!err) {
			var graph = generateGraph(ratings.items, "Brasil");

			graph.estados = [];
			
			estados.forEach(function(element){
				var aux = _.filter(ratings.items, function(e){ return e.estado == element;});
				var g = generateGraph(aux, element);
				graph.estados.push(g)
			});

			return res.send(graph);
		} else {
			return console.log(err);
		}
	});
}

var generateGraph = function( items, _nome){
	var graph = {nome : _nome};
	var group = _.groupBy(items, function(element){return element.nota.toString();});

	var val = [];
	val[1] = group["1"] == undefined ?  0 : group["1"].length;
	val[2] = group["2"] == undefined ?  0 : group["2"].length;
	val[3] = group["3"] == undefined ?  0 : group["3"].length;
	val[4] = group["4"] == undefined ?  0 : group["4"].length;
	val[5] = group["5"] == undefined ?  0 : group["5"].length;

	graph.valor = (val[1] + val[2]*2 + val[3]*3 + val[4]*4 + val[5]*5)/(val[1] + val[2] + val[3] + val[4] + val[5]);
	
	if(items.length == 0) graph.valor = 0;

	graph.notas =  [];

	if(val[1]!=0)
		graph.notas.push({"label":"1", "valor":val[1]});

	if(val[2]!=0)
		graph.notas.push({"label":"2", "valor":val[2]});

	if(val[3]!=0)
		graph.notas.push({"label":"3", "valor":val[3]});

	if(val[4]!=0)
		graph.notas.push({"label":"4", "valor":val[4]});

	if(val[5]!=0)
		graph.notas.push({"label":"5", "valor":val[5]});

	return graph;
};

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

var calcMedia = function(_id){
	return ddb.scan('ratings', {filter:{id:{eq:_id}}}, function (err, ratings) {
		if (!err) {
			var graph = generateGraph(ratings.items, "Brasil");

			return proposals.updateMedia(_id,graph.valor);
		} else {
			return console.log(err);
		}
	});
}


exports.calcMedia = calcMedia;

exports.media = function(req,res){
	ddb.scan('ratings', {exclusiveStartKey: {hash: "87c3e6e0-1948-11e4-b2df-1540440903f6", range : 'luizpcf@gmail.com'}}, function (err) {
		if (!err) {
			return res.send(202,ratings);
		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}

exports.update = function(req,res){
	var ratings = ratingModel.newRating(req);

	ddb.putItem('ratings', ratings, {}, function (err) {
		if (!err) {
			res.send(202,"Informação salva com sucesso.");

			return ddb.getItem('accounts', req._passport.session.user, null, {}, function (err, user) {
				if (!err) {

					var ratedProposals;

					if(user.ratedProposals == undefined){
						ratedProposals = [];
					}else{
						ratedProposals = user.ratedProposals;
						ratedProposals.forEach(function(element, index){
							if(element.substr(0, element.length - 1) == ratings.id)
								ratedProposals.splice(index, 1);
						});
					}

					ratedProposals.push(ratings.id + ratings.nota.toString());
					var updatedUser = { ratedProposals: {value: ratedProposals, action: 'PUT' }};

					ddb.updateItem('accounts', user.username, null, updatedUser, function (err, users) {
						if (!err) {
							console.log("Updated user");
						} else {
							console.log(err);
						}
					});

				} else {
					return console.log(err);
				}
			});

		} else {
			res.send(400,err);
			return console.log(err);
		}
	});
}