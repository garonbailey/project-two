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

//Routes
server.get('/test', function (req, res) {
	res.render('index');
	res.end();
});

//Port & DB Connection
mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});