

var newUser = function(req){
	var user = {updated_at :  Date.now()};
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


	return user;
}

var validadeUser = function(req, res, next){
	if(!validateEmail(req.body.username))
		return res.send(401,{ error: 'Informe um email válido.' });
	if(req.body.password != req.body.passwordAgain)
		return res.send(401,{ error: 'Senha diferente da confirmação da senha.' });
	if(userExist(req.body.username))
		return res.send(401,{ error: 'Usuário já existe' });

	return next();
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 


exports.validadeUser = validadeUser;
exports.newUser = newUser;
exports.updateUser = updateUser;