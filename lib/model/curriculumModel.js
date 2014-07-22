var uuid = require('node-uuid');

var newCurriculum = function(req){
  var curriculum = {
    updated_at :  Date.now(),
    id : uuid.v1(),
    created_at : Date.now(),
    politicians_id : req.body.politicians_id
  }

  var data = req.body.data || '';
  if(data != '')
    curriculum.data = data;

  var descricao = req.body.descricao || '';
  if(descricao != '')
    curriculum.descricao = descricao;

  var categoria = req.body.categoria || '';
  if(categoria != '')
    curriculum.categoria = categoria;

  return curriculum;
}

var updateCurriculum = function(req){
  var curriculum = {updated_at :  {value:Date.now()}};

  var data = req.body.data || '';
  if(data != '')
    curriculum.data = {value: data};

  var descricao = req.body.descricao || '';
  if(descricao != '')
    curriculum.descricao = {value: descricao};

  var categoria = req.body.categoria || '';
  if(categoria != '')
    curriculum.categoria = {value: categoria};

  return curriculum;
}

exports.newCurriculum = newCurriculum;

exports.updateCurriculum = updateCurriculum;
