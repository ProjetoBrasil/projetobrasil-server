'use strict';

var ddb = require('../../config/dynamo_database').ddb;

var goodModel = require('../model/goodsModel');

exports.findAll = function (req, res){
  return ddb.scan('goods', {}, function (err, goods) {
    if (!err) {
      return res.send(goods.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var good = goodModel.newGoods(req, true);
  ddb.putItem('goods', good, {}, function (err) {
    if (!err) {
      return console.log("Created Goods");
    } else {
      return console.log(err);
    }
  });
  return res.send(202,good);
};

exports.findById = function (req, res){
  return ddb.getItem('goods', req.params.id, null, {}, function (err, good) {
    if (!err) {
      return res.send(good);
    } else {
      return console.log(err);
    }
  });
};

exports.update = function (req, res){
  var good = goodModel.updateGoods(req, false);

  return ddb.updateItem('goods', req.params.id, null, good, function (err, goods) {
      if (!err) {
        console.log("Updated Goods");
      } else {
        console.log(err);
      }
      return res.send(202, goods);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('goods', req.params.id, null, {},  function (err, good) {
      if (!err) {
        console.log("Removed Goods");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};