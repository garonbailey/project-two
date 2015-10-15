var express        = require('express'),
	PORT           = process.env.PORT || 5432,
	server         = express(),
	morgan         = require('morgan'),
	MONGOURI       = /* process.env.MONGOLAB_URI || */ "mongodb://localhost:27017",
	dbname         = 'wiki',
	mongoose       = require('mongoose'),
	Schema         = mongoose.Schema,
	ejs            = require('ejs'),
	expressLayouts = require('express-ejs-layouts'),
	session        = require('express-session'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override');

//Set Views
server.set('views', './views');
server.set('view engine', 'ejs');

//Set Usage
server.use(session({
	secret: "mischievousCat",
	resave: false,
	saveUninitialized: true
}));
server.use(expressLayouts);
server.use(express.static('./public'));
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));

//Schemas
var articleSchema = new Schema ({
	title: { type: String, required: true, unique: true },
	author: { name: { type: String, required: true },
			  _id: { type: String, required: true }
	},
	edits: [{ editor_id: String,
			  editorName: String,
			  editDate: { type: Date, default: Date.now }
			}],
	body: { type: String, required: true },
	tags: [String],
	date: { type: Date, default: Date.now }
}, {collection: 'articles'});
var Article = mongoose.model('Article', articleSchema);

var userSchema = new Schema ({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	jobTitle: { type: String, required: true },
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true}
}, {collection: 'users'});
var User = mongoose.model('User', userSchema);

//Routes
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

var requireCurrentUser = function (req, res, next) {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect(302, '/user/login');
	}
};

server.get('/', function (req, res) {
	res.render('index');
	res.end();
});

server.get('/user/', requireCurrentUser, function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
		} else {
			console.log(allUsers);
			res.render('user/index', { users: allUsers });
		}
	});
});

server.get('/user/login', function (req, res) {
	res.render('user/login');
})

server.get('/user/new', function (req, res) {
	res.render('user/new');
});

server.get('/user/:id', requireCurrentUser, function (req, res) {

	User.findOne({_id: req.params.id}, function (err, thisUser) {
		if (err) {
			res.redirect(302, '/user/');
		} else {
			res.render('user/current', { thisUser });
		}
	});
});

server.post('/user/new', function (req, res) {
	var userInfo = req.body.user;

	var newUser = new User(userInfo);
	newUser.save(function (err, userSuccess) {
		if (err) {
			res.redirect(302, '/user/new');
		} else {
			console.log(newUser);
			res.redirect(302, '/user/');
		}
	});
});

server.get('/articles/', requireCurrentUser, function (req, res) {
	if (req.query.tag) {
		var query = { tags: req.query.tag};
	} else {
		var query = {};
	}

	Article.find(query, function (err, allArticles) {
		if (err) {
			console.log(err);
		} else {
			res.render('articles/index', { allArticles });
		}
	});
})

server.get('/articles/new', requireCurrentUser, function (req, res) {
	res.render('articles/new');
});

server.get('/articles/:id', requireCurrentUser, function (req, res) {
	Article.findOne({_id: req.params.id}, function (err, thisArticle) {
		if (err) {
			res.redirect(302, '/articles/');
		} else {
			res.render('articles/current', { thisArticle });
		}
	});
});

server.post('/articles/new', requireCurrentUser, function (req, res) {
	var post = req.body.article;

	var newPost = new Article(post);
	newPost.author = {
		_id: req.session.currentUser._id,
		name: req.session.currentUser.firstName + " " + req.session.currentUser.lastName
	};
	newPost.edits = [];

	newPost.save(function (err, articleSuccess) {
		if (err) {
			console.log(err);
		} else {
			console.log(articleSuccess);
			res.redirect(302, '/articles/');
		}
	});
});

server.get('/articles/edit/:id/', requireCurrentUser, function (req, res) {
	Article.findOne({_id: req.params.id}, function (err, articleToEdit) {
		if (err) {
			res.redirect(302, '/articles/');
		} else {
			res.render('articles/edit', { theArticle: articleToEdit });
		}
	});
});

server.patch('/articles/:id', requireCurrentUser, function (req, res) {
	var articleQuery = req.params.id;
	var ourUser = req.session.currentUser;
	var editorInfo = { editor_id: req.session.currentUser.id,
					   editor: req.session.currentUser.firstName + " " + req.session.currentUser.lastName,
				       editDate: Date.now };
	console.log(ourUser._id);
	Article.findOne({_id: articleQuery}, function (err, articleFound) {
		if (err) {
			console.log(err);
		} else {
			articleFound.edits.push({ editor_id: req.session.currentUser.id,
								  	  editor: ourUser.firstName + " " + ourUser.lastName
									});
			articleFound.save(function (editSaveErr) {
				if (editSaveErr) {
					console.log(editSaveErr);
				} else {
					console.log(articleFound);
					articleFound.update(req.body.article, function (updateErr, updatedArticle) {
						if (updateErr) {
							console.log(updateErr);
						} else {
							res.redirect(302, '/articles/' + articleFound._id);
						}
					});
				}
			});
		}
	});
});

//Port & DB Connection
mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});