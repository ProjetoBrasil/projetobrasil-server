'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

exports.findAll = function (req, res){
  return ddb.scan('politicians', {}, function (err, politicians) {
    if (!err) {
      console.log(politicians);
      return res.send(politicians.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var politician;
  politician = {
    id:          uuid.v1(),
    created_at:  Date.now(),
    updated_at:  Date.now(),
    title:       req.body.title,
    description: req.body.description,
    style:       req.body.style
  };
  console.log("POST: ");
  console.log(req.body);
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

    politician.title = req.body.title;
    politician.description = req.body.description;
    politician.style = req.body.style;
    politician.updated_at = Date.now();

  return ddb.updateItem('politicians', req.body.id, null, politician, function (err, politic) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(politic);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('politicians', req.params.id, null, {},  function (err, politic) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};