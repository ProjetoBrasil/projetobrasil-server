'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

var coomentModel = require('../model/commentModel');

exports.findAll = function(req, res){
	res.send(require('../model/comment'));
}

exports.add = function (req, res){
  var comment = coomentModel.newComment(req);

  ddb.putItem('comments', comment, {}, function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(202,comment);
};

exports.findById = function (req, res){
  return ddb.getItem('comments', req.params.id, null, {}, function (err, comment) {
    if (!err) {
      return res.send(comment);
    } else {
      return console.log(err);
    }
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('comments', req.params.id, null, {},  function (err, politician) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};