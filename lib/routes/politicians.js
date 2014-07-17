'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

var politicianModel = require('../model/politicianModel');

exports.findAll = function (req, res){
    return ddb.scan('politicians', {}, function (err, politicians) {
      if (!err) {
        //console.log(politicians);
        return res.send(politicians.items);
      } else {
        return console.log(err);
      }
    });
};

exports.findProposalsById = function (req, res){
  return ddb.scan('proposals', {filter : { politicians_id: { eq: req.params.id}}}, function (err, proposals) {
    if (!err) {
      return res.send(proposals.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var politician = politicianModel.newPolitician(req);
  ddb.putItem('politicians', politician, {}, function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(202,politician);
};

exports.findById = function (req, res){
  return ddb.getItem('politicians', req.params.id, null, {}, function (err, politician) {
    if (!err) {
      return res.send(politician);
    } else {
      return console.log(err);
    }
  });
};

exports.update = function (req, res){
  var politician = politicianModel.updatePolitician(req);

  return ddb.updateItem('politicians', req.params.id, null, politician, function (err, politicians, cap) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, politicians);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('politicians', req.params.id, null, {},  function (err, politician) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};