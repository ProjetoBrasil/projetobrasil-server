
var uuid = require('node-uuid');

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

  var nome_url = req.body.nome_url || '';
  if(nome_url != '')
    politician.nome_url = nome_url;

  var foto = req.body.foto || '';
  if(foto != '')
    politician.foto = foto;

  var partido = req.body.partido || '';
  if(partido != '')
    politician.partido = partido;

  var formacao = req.body.formacao || '';
  if(formacao != '')
    politician.formacao = formacao;

  var facebook = req.body.facebook || '';
  if(facebook != '')
    politician.facebook = facebook;

  var twitter = req.body.twitter || '';
  if(twitter != '')
    politician.twitter = twitter;

  var youtube = req.body.youtube || '';
  if(youtube != '')
    politician.youtube = youtube;

  var flickr = req.body.flickr || '';
  if(flickr != '')
    politician.flickr = flickr;

  var gplus = req.body.gplus || '';
  if(gplus != '')
    politician.gplus = gplus;

  var instagram = req.body.instagram || '';
  if(instagram != '')
    politician.instagram = instagram;

  var site = req.body.site || '';
  if(site != '')
    politician.site = site;

  var email = req.body.email || '';
  if(email != '')
    politician.email = email;

  var numero = req.body.numero || '';
  if(numero != '')
    politician.numero = numero;

  var nome_coligacao = req.body.nome_coligacao || '';
  if(nome_coligacao != '')
    politician.nome_coligacao = nome_coligacao;

  var composicao_coligacao = req.body.composicao_coligacao || '';
  if(composicao_coligacao != '')
    politician.composicao_coligacao = composicao_coligacao;

  var nome_partido = req.body.nome_partido || '';
  if(nome_partido != '')
    politician.nome_partido = nome_partido;

  var image_partido = req.body.image_partido || '';
  if(image_partido != '')
    politician.image_partido = image_partido;

  var sexo = req.body.sexo || '';
  if(sexo != '')
    politician.sexo = sexo;

  var estado_civil = req.body.estado_civil || '';
  if(estado_civil != '')
    politician.estado_civil = estado_civil;

  var vice = req.body.vice || '';
  if(vice != '')
    politician.vice = vice;

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

  var nome_url = req.body.nome_url || '';
  if(nome_url != '')
    politician.nome_url = {value: nome_url};

  var foto = req.body.foto || '';
  if(foto != '')
    politician.foto = {value: foto};

  var partido = req.body.partido || '';
  if(partido != '')
    politician.partido = {value: partido};

  var formacao = req.body.formacao || '';
  if(formacao != '')
    politician.formacao = {value: formacao};

  var facebook = req.body.facebook || '';
  if(facebook != '')
    politician.facebook = {value: facebook};

  var twitter = req.body.twitter || '';
  if(twitter != '')
    politician.twitter = {value: twitter};

  var youtube = req.body.youtube || '';
  if(youtube != '')
    politician.youtube = {value: youtube};

  var flickr = req.body.flickr || '';
  if(flickr != '')
    politician.flickr = {value: flickr};

  var gplus = req.body.gplus || '';
  if(gplus != '')
    politician.gplus = {value: gplus};

  var instagram = req.body.instagram || '';
  if(instagram != '')
    politician.instagram = {value: instagram};

  var site = req.body.site || '';
  if(site != '')
    politician.site = {value: site};

  var email = req.body.email || '';
  if(email != '')
    politician.email = {value: email};

  var numero = req.body.numero || '';
  if(numero != '')
    politician.numero = {value: numero};

  var nome_coligacao = req.body.nome_coligacao || '';
  if(nome_coligacao != '')
    politician.nome_coligacao = {value: nome_coligacao};

  var composicao_coligacao = req.body.composicao_coligacao || '';
  if(composicao_coligacao != '')
    politician.composicao_coligacao = {value: composicao_coligacao};

  var nome_partido = req.body.nome_partido || '';
  if(nome_partido != '')
    politician.nome_partido = {value: nome_partido};

  var image_partido = req.body.image_partido || '';
  if(image_partido != '')
    politician.image_partido = {value: image_partido};

  var sexo = req.body.sexo || '';
  if(sexo != '')
    politician.sexo = {value: sexo};

  var estado_civil = req.body.estado_civil || '';
  if(estado_civil != '')
    politician.estado_civil = {value: estado_civil};

  var vice = req.body.vice || '';
  if(vice != '')
    politician.vice = {value: vice};

  return politician;
}

exports.newPolitician = newPolitician;

exports.updatePolitician = updatePolitician;
