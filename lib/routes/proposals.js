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
  return ddb.scan('proposals', {}, function (err, proposals) {
    if (!err) {
      var items = [];
      for(var i=0;i<req.params.qtd;i++){
        var index = parseInt(Math.random() * proposals.count);
        items.push(proposals.items[index]);
      }
      return res.send(items);
    } else {
      return console.log(err);
    }
  });
};