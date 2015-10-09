var express = require('express'),
	PORT    = process.env.PORT || 5432,
	server  = express(),
	MONGOURI = process.env.MONGOLAB_URI,
	dbname   = //set here as string,
	mongoose = require('mongoose');


server.get('/test', function (req, res) {
	res.write("App goes here!");
	res.end();
});

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});