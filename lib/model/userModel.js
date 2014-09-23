var uuid = require('node-uuid');
var bcrypt =require('bcrypt');
var ddb = require('../../config/dynamo_database').ddb;


var newUser = function(req){
	var user = {updated_at :  Date.now(),
				imported:0,
				ratingsImported:0};
	user.id = uuid.v1();
	user.created_at = Date.now();
	user.username = req.body.username || '';
	user.emailConfirmed = "false";
	user.comfirmationPass = parseInt(Math.random() * 100000)

	var password = req.body.password || '';
	if(password != ''){
		var salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);
	}

	var nome = req.body.nome || '';
	if(nome != '')
		user.nome = nome;

	var sobrenome = req.body.sobrenome || '';
	if(sobrenome != '')
		user.sobrenome = sobrenome;

	return user;
}

var updateUser = function(req){
	var user = {updated_at :  {value: Date.now()}};

	var password = req.body.password || '';
	if(password != ''){
		var salt = bcrypt.genSaltSync();
		user.password = {value: bcrypt.hashSync(password, salt)};
	}

	var nome = req.body.nome || '';
	if(nome != '')
		user.nome = {value: nome};

	var sobrenome = req.body.sobrenome || '';
	if(sobrenome != '')
		user.sobrenome = {value: sobrenome};

	var dataNascimento = req.body.dataNascimento || '';
	if(dataNascimento != '')
		user.dataNascimento = {value: dataNascimento};

	var sexo = req.body.sexo || '';
	if(sexo != '')
		user.sexo = {value: sexo};

	var cidade = req.body.cidade || '';
	if(cidade != '')
		user.cidade = {value: cidade};

	var escolaridade = req.body.escolaridade || '';
	if(escolaridade != '')
		user.escolaridade = {value: escolaridade};

	var renda = req.body.renda || '';
	if(renda != '')
		user.renda = {value: renda};

	var engajamentoPolitico = req.body.engajamentoPolitico || '';
	if(engajamentoPolitico != '')
		user.engajamentoPolitico = {value: engajamentoPolitico};

	var partidoPreferencia = req.body.partidoPreferencia || '';
	if(partidoPreferencia != '')
		user.partidoPreferencia = {value: partidoPreferencia};

	var cidadeOndeVota = req.body.cidadeOndeVota || '';
	if(cidadeOndeVota != '')
		user.cidadeOndeVota = {value: cidadeOndeVota};

	var preferenciaPoliticaPublica = req.body.preferenciaPoliticaPublica || '';
	if(preferenciaPoliticaPublica != '')
		user.preferenciaPoliticaPublica = {value: preferenciaPoliticaPublica};


	return user;
}

var validadeUser = function(req, res, next){
	if(!validateEmail(req.body.username))
		return res.send(422,{ error: 'Informe um email válido.' });
	//if(req.body.password != req.body.passwordAgain)
	//	return res.send(401,{ error: 'Senha diferente da confirmação da senha.' });
	return ddb.getItem('accounts', req.body.username, null, {}, function (err, user) {
		if (!err) {
			console.log(user);
			if(!user)
				return next()
			return res.send(422,{ error: 'Usuário já existe' });
		} else {
			return res.send(400,err);
		}
	});
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 


exports.validadeUser = validadeUser;
exports.newUser = newUser;
exports.updateUser = updateUser;