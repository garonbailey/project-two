function setupUser (req, res) {
	if (req.locals.currentUser) {
		var userWelcome = $('<p>Welcome, ' + '<%= req.sessions.currentUser.firstName %>' + '!</p>');
		var $userArea = $('.user');

		$(userArea).append(userWelcome);
	} else {
		var welcome = $('<p>Welcome!</p>');
		var $userArea = $('.user');

		$(userArea).append(userWelcome);
	}
}

setupUser();