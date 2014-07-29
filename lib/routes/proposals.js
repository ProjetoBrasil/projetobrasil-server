'use strict';

var ddb = require('../../config/dynamo_database').ddb;

var proposalModel = require('../model/proposalModel');

exports.findAll = function (req, res){
  return ddb.scan('proposals', {}, function (err, proposals) {
    if (!err) {
      return res.send(proposals.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var proposal = proposalModel.newProposal(req);
  ddb.putItem('proposals', proposal, {}, function (err) {
    if (!err) {
      return console.log("created");
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
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, proposals);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('proposals', req.params.id, null, {},  function (err, proposal) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};