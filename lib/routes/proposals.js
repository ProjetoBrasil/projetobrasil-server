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

  var likes = req.body.likes || '';
  if(likes != '')
    proposal.likes = likes;

  var dislikes = req.body.dislikes || '';
  if(dislikes != '')
    proposal.dislikes = dislikes;

  var experts = req.body.experts || '';
  if(experts != '')
    proposal.experts = experts;

  var links = req.body.links || '';
  if(links != '')
    proposal.links = links;

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
      proposal.links = [{link:"https://www.youtube.com/watch?v=DMFh5lziTt8"},
                        {link:"http://www1.folha.uol.com.br/poder/"},
                        {link:"http://www.cartacapital.com.br/politica"}];
      proposal.experts = {contra:{
                            nome:"James Buchanan", 
                            foto:"http://news.bbcimg.co.uk/media/images/63659000/jpg/_63659432_buckduke.jpg", 
                            opiniao:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
                            cargo:"Editor da BBC News"
                          },
                          favoravel:{
                            nome:"Steve Cuozzo", 
                            foto:"http://blogs.villagevoice.com/forkintheroad/cuozznewloss.png", 
                            opiniao:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
                            cargo:"Jornalista no New York Post"
                          }
                        };
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