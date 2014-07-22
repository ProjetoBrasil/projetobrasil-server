var uuid = require('node-uuid');

var newCurriculum = function(req){
  var curriculum = {
    updated_at :  Date.now(),
    curriculum.id : uuid.v1(),
    curriculum.created_at : Date.now(),
    curriculum.politicians_id : req.body.politicians_id || ''
  }

  var data = req.body.data || '';
  if(data != '')
    curriculum.data = data;

  var descricao = req.body.descricao || '';
  if(descricao != '')
    curriculum.descricao = descricao;

  return curriculum;
}

var updateCurriculum = function(req){
  var curriculum = {updated_at :  {value:Date.now()};

  var data = req.body.data || '';
  if(data != '')
    curriculum.data = {value: data};

  var descricao = req.body.descricao || '';
  if(descricao != '')
    curriculum.descricao = {value: descricao};

  return curriculum;
}

exports.newCurriculum = newCurriculum;

exports.updateCurriculum = updateCurriculum;
