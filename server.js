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
	saveUninitialized: false
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
	author: { type: Schema.Types.ObjectId, ref: 'User'},
	editor: { type: Schema.Types.ObjectId, ref: 'User'},
	body: { type: String, rquired: true },
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
server.get('/', function (req, res) {
	res.render('index');
	res.end();
});

server.get('/user/', function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
		} else {
			console.log(allUsers);
			res.render('user/index', { users: allUsers });
		}
	});
});

server.get('/user/new', function (req, res) {
	res.render('user/new');
});

server.get('/user/:id', function (req, res) {

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

server.get('/articles/new', function (req, res) {
	res.render('articles/new');
});

server.post('/articles/new', function (req, res) {
	var post = req.body.article;

	var newPost = new Article(post);
	console.log(newPost);
})

//Port & DB Connection
mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});