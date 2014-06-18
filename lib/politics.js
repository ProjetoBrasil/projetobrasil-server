'use strict';

var mongoose = require('mongoose')

// Database

mongoose.connect('mongodb://db.projetobrasil.org/projetobrasildb');

var Schema = mongoose.Schema;  

var Politic = new Schema({  
    title: { type: String, required: true },  
    description: { type: String, required: true },  
    style: { type: String, unique: true },  
    modified: { type: Date, default: Date.now }
});

var PoliticModel = mongoose.model('Politic', Politic); 

exports.findAll = function (req, res){
  return PoliticModel.find(function (err, politics) {
    if (!err) {
      return res.send(politics);
    } else {
      return console.log(err);
    }
  });
};


exports.add = function (req, res){
  var politic;
  console.log("POST: ");
  console.log(req.body);
  politic = new PoliticModel({
    title: req.body.title,
    description: req.body.description,
    style: req.body.style,
  });
  politic.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(politic);
};

exports.findById = function (req, res){
  return PoliticModel.findById(req.params.id, function (err, politic) {
    if (!err) {
      return res.send(politic);
    } else {
      return console.log(err);
    }
  });
};

exports.update = function (req, res){
  return PoliticModel.findById(req.params.id, function (err, politic) {
    politic.title = req.body.title;
    politic.description = req.body.description;
    politic.style = req.body.style;
    return politic.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(politic);
    });
  });
};

exports.delete = function (req, res){
  return PoliticModel.findById(req.params.id, function (err, politic) {
    return politic.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
};