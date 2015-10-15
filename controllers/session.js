var setSession = function (req, res, next) {
	server.post('/session', function (req, res) {
		var userLogin = req.body.session.email;
		req.session.currentUser;
		User.findOne({ email: userLogin }, function (err, sessionUser) {
			if (err) {
				console.log(err);
				res.redirect(302, '/user/login');
			} else if (req.body.session.password !== sessionUser.password) {
				res.redirect(302, '/user/login');			
			} else {
				req.session.currentUser = sessionUser;
				console.log(req.session.currentUser);
				res.redirect(302, '/articles/');
			}
		});
	});
};

var requireCurrentUser = function (req, res, next) {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect(302, '/user/login');
	}
};

module.exports.setSession = setSession();
module.exports.requireCurrentUser = requireCurrentUser();
module.exports.currentUser = req.session.currentUser;