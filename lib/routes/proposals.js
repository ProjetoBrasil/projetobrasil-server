'use strict';

var ddb = require('../../config/dynamo_database').ddb;
var uuid = require('node-uuid');

var updateProposal = function(req, newP){
  var proposal = {updated_at :  Date.now()};

  if(newP){
    proposal.id = uuid.v1();
    proposal.created_at = Date.now();
    proposal.politicians_id = req.body.politicians_id || '';
  }

  var categoria = req.body.categoria || '';
  if(categoria != '')
    proposal.categoria = categoria;

  var subcategoria = req.body.subcategoria || '';
  if(subcategoria != '')
    proposal.subcategoria = subcategoria;

  var texto_completo = req.body.texto_completo || '';
  if(texto_completo != '')
    proposal.texto_completo = texto_completo;

  var resumo = req.body.resumo || '';
  if(resumo != '')
    proposal.resumo = resumo;

  var documento_oficial = req.body.documento_oficial || '';
  if(documento_oficial != '')
    proposal.documento_oficial = documento_oficial;

  //Informações não disponível atualmente que deveremos cobrar dos políticos
  var prazo_implementacao = req.body.prazo_implementacao || '';
  if(prazo_implementacao != '')
    proposal.prazo_implementacao = prazo_implementacao;

  var orcamento = req.body.orcamento || '';
  if(orcamento != '')
    proposal.orcamento = orcamento;

  var acoes_chaves = req.body.acoes_chaves || '';
  if(acoes_chaves != '')
    proposal.acoes_chaves = acoes_chaves;

  var riscos_envolvidos = req.body.riscos_envolvidos || '';
  if(riscos_envolvidos != '')
    proposal.riscos_envolvidos = riscos_envolvidos;

  return proposal;
}

exports.findAll = function (req, res){
  return ddb.scan('proposals', {}, function (err, proposals) {
    if (!err) {
      console.log(proposals);
      return res.send(proposals.items);
    } else {
      return console.log(err);
    }
  });
};

exports.add = function (req, res){
  var proposal = updateProposal(req, true);

  console.log("POST: ");
  console.log(req.body);
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
  var proposal = updateProposal(req, false);

  return ddb.updateItem('proposals', req.params.id, null, proposal, function (err, proposal) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(202, proposal);
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