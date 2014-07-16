

var newPolitician = function(req){
  var politician = {
    updated_at :  Date.now(),
    id : uuid.v1(),
    created_at : Date.now()
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

  var numero = req.body.numero || '';
  if(numero != '')
    politician.numero = numero;

  return politician;
}

var updatePolitician = function(req, politician_old){
  var politician = {
    updated_at :  { value: Date.now()}
  }

  var nome_urna = req.body.nome_urna || '';
  if(nome_urna != '')
    politician.nome_urna = {value: nome_urna};

  var nome = req.body.nome || '';
  if(nome != '')
    politician.nome = {value: nome};

  var foto = req.body.foto || '';
  if(foto != '')
    politician.foto = {value: foto};

  var partido = req.body.partido || '';
  if(partido != '')
    politician.partido = {value: partido};

  var formacao = req.body.formacao || '';
  if(formacao != '')
    politician.formacao = {value: formacao};

  var redes_sociais = req.body.redes_sociais || '';
  if(redes_sociais != '')
    politician.redes_sociais = {value: redes_sociais};

  var site = req.body.site || '';
  if(site != '')
    politician.site = {value: site};

  var email = req.body.email || '';
  if(email != '')
    politician.email = {value: email};

  var numero = req.body.numero || '';
  if(numero != '')
    politician.numero = {value: numero};

  return politician;
}

exports.newPolitician = newPolitician;

exports.updatePolitician = updatePolitician;
