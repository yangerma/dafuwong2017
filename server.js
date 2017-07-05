var express = require("express");
var app = express();
var port = 9487;
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var game_start = require("./controller.js");

app.use(express.static(path.join(__dirname, 'view')));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

game_start(io);
	
http.listen(port, function(){
	console.log('listening on *:'+port);
});
