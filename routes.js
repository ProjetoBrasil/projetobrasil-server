var passport = require('passport');

var checkAuthorization = function (req, res, next) {
    if (!req.user) {
        return res.send(401,{ error: 'The user can not do this action without login.' });
    }
    next();
};

function setup(app) {
	//Routes
	var politicians = require('./lib/routes/politicians.js'),
		proposals = require('./lib/routes/proposals.js'),
		userModel = require('./lib/model/userModel'),
		users = require('./lib/routes/users'),
		rating = require('./lib/routes/ratings'),
		blind_rating = require('./lib/routes/blind_ratings'),
		goods = require('./lib/routes/goods'),
		curriculum = require('./lib/routes/curriculum'),
		importation = require('./lib/aux/import');

	

	//Local login routes
	app.post('/v1/user/register', userModel.validadeUser, users.register);
	app.post('/v1/user/login', users.login);
	app.get('/v1/user/logout', users.logout);
	app.get('/v1/user/validadeMail/:username/:comfirmationPass', users.validadeMail);

	app.get('/v1/profile', users.findById);
	app.put('/v1/profile', checkAuthorization, users.update);
	app.get('/v1/profile/ratings', users.findRatingsById); 
	
	//Login Twitter:
	//app.get('/v1/connect/twitter', users.loginTwitter);
	//app.get('/v1/connect/twitter/callback', users.loginTwitterCallback);

	app.get('/v1/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_birthday', 'user_education_history', 'user_friends', 'user_location'] }));
	app.get('/v1/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/v1/auth/success', failureRedirect: '/v1/auth/failure' }));
	app.get('/v1/auth/success', function(req, res) {
	    res.send("<script>window.close()</script>");
	});
	app.get('/v1/auth/failure', function(req, res) {
	    res.send("<script>window.close()</script>");
	});

	//Login Google:
	//app.get('/v1/auth/google', users.loginGoogle);
	//app.get('/v1/auth/google/return', users.loginGoogleCallback);

	//Login Linkedin:
	//app.get('/v1/auth/linkedin', users.loginLinkedin);
	//app.get('/v1/auth/linkedin/callback', users.loginLinkedinCalback);

	//Politicians routes
	app.get('/v1/politicians', politicians.findAll);
	app.get('/v1/politician/:id', politicians.findById);
	app.get('/v1/politician/:id/proposals', politicians.findProposalsById);
	app.get('/v1/politician/:id/goods', politicians.findGoodsById);
	app.get('/v1/politician/:id/curriculum', politicians.findCurriculumById);
	//app.post('/v1/politician', checkAuthorization, politicians.add);
	//app.put('/v1/politician/:id', checkAuthorization, politicians.update);
	//app.delete('/v1/politician/:id', checkAuthorization, politicians.delete);

	//Proposals routes
	app.get('/v1/proposals', proposals.findAll);
	app.get('/v1/proposal/:id', proposals.findById);
	//app.post('/v1/proposal', checkAuthorization, proposals.add);
	//app.put('/v1/proposal/:id', checkAuthorization, proposals.update);
	//app.delete('/v1/proposal/:id', checkAuthorization, proposals.delete); 

	//Goods routes
	app.get('/v1/goods', goods.findAll);
	app.get('/v1/good/:id', goods.findById);
	//app.post('/v1/good', checkAuthorization, goods.add);
	//app.put('/v1/good/:id', checkAuthorization, goods.update);
	//app.delete('/v1/good/:id', checkAuthorization, goods.delete); 

	//Curriculum routes
	app.get('/v1/curriculums', curriculum.findAll);
	app.get('/v1/curriculum/:id', curriculum.findById);
	//app.post('/v1/curriculum', checkAuthorization, curriculum.add);
	//app.put('/v1/curriculum/:id', checkAuthorization, curriculum.update);
	//app.delete('/v1/curriculum/:id', checkAuthorization, curriculum.delete); 

	app.get('/v1/rating/:id', rating.findById);
	app.post('/v1/rating/:id', checkAuthorization, rating.update);
	app.get('/v1/graphRating/:id', rating.generatesGraphById);

	//app.post('/v1/importProposal', importation.importProposal);
	//app.post('/v1/deleteProposal', importation.deleteProposal);
	//app.post('/v1/importCurriculum', importation.importCurriculum);
	//app.post('/v1/deleteCurriculum', importation.deleteCurriculum);

	//Services for Blind Test app
	app.get('/v1/blindTest/proposals/sort/:qtd', proposals.findRandom);
	app.get('/v1/blindTest/user/ratings', checkAuthorization, users.findCompleteBlindRatingsById); 
	app.post('/v1/blindTest/rating/:id', checkAuthorization, blind_rating.update);

	//Services for UFC
	app.get('/v1/ufc/proposals/rand', proposals.findUFC);
	app.post('/v1/ufc/proposals/vote', proposals.findUFC);
};

exports.setup = setup;