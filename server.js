var express = require('express');
var port = 9487;
var path = require('path');
var app= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Controller = require("./Controller.js");
var controller = new Controller(io);
console.log(controller);

var playerCount = 0;

app.use(express.static(path.join(__dirname, '.')));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(player){
	player.emit("player_id", {player_id : playerCount});
	console.log('Player '+ playerCount + ' connected.');

	var playerId = playerCount++;
	controller.addPlayer(player);
		
	player.on('disconnect', function(){
		console.log('Player ' + playerId + ' disconnectedQQ');
	});

	if (playerCount == 2) {
		controller.start();
	}
});

http.listen(port, function(){
	console.log('listening on *:'+port);
});

