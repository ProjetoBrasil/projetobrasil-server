'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

var updatePolitician = function(req, newP){
  var politician = {updated_at :  Date.now()};

  if(newP){
    politician.id = uuid.v1();
    politician.created_at = Date.now();
  }

  var nome_urna = req.body.nome_urna || '';
  if(nome_urna != '')
    politician.nome_urna = nome_urna;

  var nome = req.body.nome || '';
  if(nome != '')
    politician.nome = nome;

  var foto = req.body.foto || '';
  if(foto != '')
    politician.foto = foto;

  var partido = req.body.partido || '';
  if(partido != '')
    politician.partido = partido;

  var formacao = req.body.formacao || '';
  if(formacao != '')
    politician.formacao = formacao;

  var redes_sociais = req.body.redes_sociais || '';
  if(redes_sociais != '')
    politician.redes_sociais = redes_sociais;

  var site = req.body.site || '';
  if(site != '')
    politician.site = site;

  var email = req.body.email || '';
  if(email != '')
    politician.email = email;

  return politician;
}

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
  var politician = updatePolitician(req, true);

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
  var politician = updatePolitician(req, false);

  return ddb.updateItem('politicians', req.body.id, null, politician, function (err, politic) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, politic);
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