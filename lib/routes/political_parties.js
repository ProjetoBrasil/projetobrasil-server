'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

var updatePoliticalParties = function(req, newP){
  var political_parties = {updated_at :  Date.now()};

  if(newP){
    political_parties.created_at = Date.now();
  }

  var sigla = req.body.sigla || '';
  if(sigla != '')
    political_parties.sigla = sigla;

  var nome = req.body.nome || '';
  if(nome != '')
    political_parties.nome = nome;

  var foto = req.body.foto || '';
  if(foto != '')
    political_parties.foto = foto;

  var numero = req.body.numero || '';
  if(numero != '')
    political_parties.numero = numero;

  return political_parties;
}

exports.findAll = function (req, res){
  return ddb.scan('political_parties', {}, function (err, political_parties) {
    if (!err) {
      console.log(political_parties);
      return res.send(political_parties.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var political_parties = updatePoliticalParties(req, true);

  console.log("POST: ");
  console.log(req.body);
  ddb.putItem('political_parties', political_parties, {}, function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(202,political_parties);
};

exports.findById = function (req, res){
  return ddb.getItem('political_parties', req.params.sigla, null, {}, function (err, political_parties) {
    if (!err) {
      return res.send(political_parties);
    } else {
      return console.log(err);
    }
  });
};

exports.update = function (req, res){
  var political_parties = updatePoliticalParties(req, false);

  return ddb.updateItem('political_parties', req.body.sigla, null, political_parties, function (err, political_parties) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, political_parties);
  });
};

exports.delete = function (req, res){
  ddb.deleteItem('political_parties', req.params.sigla, null, {},  function (err, political_parties) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
  });
};