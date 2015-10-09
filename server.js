var express = require('express'),
	PORT    = process.env.PORT || 5432,
	server  = express();


server.get('/test', function (req, res) {
	res.write("App goes here!");
	res.end();
});

server.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});