'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');
var _ = require('underscore');


var politicianModel = require('../model/politicianModel');

exports.findAll = function (req, res){
    return ddb.scan('politicians', {}, function (err, politicians) {
      if (!err) {
        return res.send(politicians.items);
      } else {
        return console.log(err);
      }
    });
};

exports.findProposalsById = function (req, res){
  return ddb.scan('proposals', {filter : { politicians_id: { eq: req.params.id}}}, function (err, proposals) {
    if (!err) {
      return res.send(_.sortBy(proposals.items, function(element){
        return element.tema + element.subtema;
      }) );
    } else {
      return console.log(err);
    }
  });
};

exports.findGoodsById = function (req, res){
  return ddb.scan('goods', {filter : { politicians_id: { eq: req.params.id}}}, function (err, goods) {
    if (!err) {
      return res.send(goods.items);
    } else {
      return console.log(err);
    }
  });
};

exports.findCurriculumById = function (req, res){
  return ddb.scan('curriculums', {filter : { politicians_id: { eq: req.params.id}}}, function (err, curriculums) {
    if (!err) {
      return res.send(curriculums.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var politician = politicianModel.newPolitician(req);
  ddb.putItem('politicians', politician, {}, function (err) {
    if (!err) {
      return console.log("Created Politician");
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
        console.log("Updated Politician");
      } else {
        console.log(err);
      }
      return res.send(202, politicians);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('politicians', req.params.id, null, {},  function (err, politician) {
      if (!err) {
        console.log("Removed Politician");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};