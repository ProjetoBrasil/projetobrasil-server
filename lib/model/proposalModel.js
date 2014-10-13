var uuid = require('node-uuid');

var newProposal = function(req){
  var proposal = {
    updated_at :  Date.now(),
    id : uuid.v1(),
    created_at : Date.now(),
    politicians_id : req.body.politicians_id
  }

  var tema = req.body.tema || '';
  if(tema != '')
    proposal.tema = tema;

  var subtema = req.body.subtema || '';
  if(subtema != '')
    proposal.subtema = subtema;

  var descricao = req.body.descricao || '';
  if(descricao != '')
    proposal.descricao = descricao;

  var titulo = req.body.titulo || '';
  if(titulo != '')
    proposal.titulo = titulo;

  var palavras_chaves = req.body.palavras_chaves || '';
  if(palavras_chaves != '')
    proposal.palavras_chaves = palavras_chaves;

  var fonte = req.body.fonte || '';
  if(fonte != '')
    proposal.fonte = fonte;

  var media = req.body.media || '';
  if(media != '')
    proposal.media = media;

  var pares = req.body.pares || '';
  if(pares != '')
    proposal.pares = pares;

  return proposal;
}

var updateProposal = function(req){
  var proposal = {updated_at : {value: Date.now()}};

  var tema = req.body.tema || '';
  if(tema != '')
    proposal.tema = {value: tema};

  var subtema = req.body.subtema || '';
  if(subtema != '')
    proposal.subtema = {value: subtema};

  var descricao = req.body.descricao || '';
  if(descricao != '')
    proposal.descricao = {value: descricao};

  var titulo = req.body.titulo || '';
  if(titulo != '')
    proposal.titulo = {value: titulo};

  var palavras_chaves = req.body.palavras_chaves || '';
  if(palavras_chaves != '')
    proposal.palavras_chaves = {value: palavras_chaves};

  var fonte = req.body.fonte || '';
  if(fonte != '')
    proposal.fonte = {value: fonte};

  var media = req.body.media || '';
  if(media != '')
    proposal.media = {value: media};

  var pares = req.body.pares || '';
  if(pares != '')
    proposal.pares = {value: pares};

  return proposal;
}

exports.newProposal = newProposal;

exports.updateProposal = updateProposal;
