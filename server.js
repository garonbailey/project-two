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
server.use(expressLayouts);
server.use(express.static('./public'));
server.use(morgan('dev'));
server.use(session({
	secret: "mischievousCat",
	resave: false,
	saveUninitialized: false
}));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));

//Schemas
var articleSchema = new Schema ({
	title: { type: String, required: true, unique: true },
	author: { type: Schema.Types.ObjectId, ref: 'User'},
	body: { type: String, rquired: true },
	date: { type: Date, default: Date.now }
}, {collection: 'articles'});
var Article = mongoose.model('Article', articleSchema);

var userSchema = new Schema ({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true},
	articlesAuthored: [{ type: Schema.Types.ObjectId, ref: 'Article'}],
	articlesEdited: [{ type: Schema.Types.ObjectId, ref: 'Article'}]
}, {collection: 'users'});
var User = mongoose.model('User', userSchema);

//Routes
server.get('/test', function (req, res) {
	res.render('index');
	res.end();
});

server.get('/user/new', function (req, res) {
	res.render('user/new');
});

server.post('/user/new', function (req, res) {
	var userInfo = req.body.user;

	var newUser = new User(userInfo);
	console.log(newUser);
});

//Port & DB Connection
mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});