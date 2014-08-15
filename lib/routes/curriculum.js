'use strict';

var ddb = require('../../config/dynamo_database').ddb;

var curriculumModel = require('../model/curriculumModel');

exports.findAll = function (req, res){
  return ddb.scan('curriculums', {}, function (err, curriculums) {
    if (!err) {
      return res.send(curriculums.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var curriculum = curriculumModel.newCurriculum(req, true);
  ddb.putItem('curriculums', curriculum, {}, function (err) {
    if (!err) {
      return console.log("Created Curriculum");
    } else {
      return console.log(err);
    }
  });
  return res.send(202,curriculum);
};

exports.findById = function (req, res){
  return ddb.getItem('curriculums', req.params.id, null, {}, function (err, curriculum) {
    if (!err) {
      return res.send(curriculum);
    } else {
      return console.log(err);
    }
  });
};

exports.update = function (req, res){
  var curriculum = curriculumModel.updateCurriculum(req, false);

  return ddb.updateItem('curriculums', req.params.id, null, curriculum, function (err, curriculums) {
      if (!err) {
        console.log("Updated Curriculum");
      } else {
        console.log(err);
      }
      return res.send(202, curriculums);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('curriculums', req.params.id, null, {},  function (err, curriculum) {
      if (!err) {
        console.log("Removed Curriculum");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};