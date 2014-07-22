var uuid = require('node-uuid');

var newGoods = function(req){
  var good = {
    updated_at :  Date.now(),
    id : uuid.v1(),
    created_at : Date.now(),
    politicians_id : req.body.politicians_id
  }

  var valor = req.body.valor || '';
  if(valor != '')
    good.valor = valor;

  var descricao = req.body.descricao || '';
  if(descricao != '')
    good.descricao = descricao;

  return good;
}

var updateGoods = function(req){
  var good = {updated_at :  {value:Date.now()}};

  var valor = req.body.valor || '';
  if(valor != '')
    good.valor = {value: valor};

  var descricao = req.body.descricao || '';
  if(descricao != '')
    good.descricao = {value: descricao};

  return good;
}

exports.newGoods = newGoods;

exports.updateGoods = updateGoods;
