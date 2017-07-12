var express = require("express");
var app = express();
var port = 9487;
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var game_start = require("./controller.js");
var model = null;

app.use(express.static(path.join(__dirname, 'view')));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

/* Load model */
if (process.argv[2]) {
	model = require(path.join(__dirname, process.argv[2]));
	console.log("Load model: " + process.argv[2]);
}

game_start(io, model);

http.listen(port, function(){
	console.log('listening on *:'+port);
});
