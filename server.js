var express        = require('express'),
	PORT           = process.env.PORT || 5432,
	server         = express(),
	MONGOURI       = /* process.env.MONGOLAB_URI || */ "mongodb://localhost:27017",
	dbname         = /* set here as string */,
	mongoose       = require('mongoose'),
	Schema         = mongoose.Schema,
	ejs            = require('ejs'),
	session        = require('express-session'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override');

server.set('views', './views');
server.set('view engine', 'ejs');

server.use(express.static('./public'));
server.use(session({
	secret: "mischievousCat",
	resave: false,
	saveUninitialized: false
}));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));


server.get('/test', function (req, res) {
	res.write("App goes here!");
	res.end();
});

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});