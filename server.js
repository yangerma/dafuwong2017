var express = require("express");
var app = express();
var port = 9487;
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Controller = require("./Controller.js");

app.use(express.static(path.join(__dirname, 'view/')));
app.get('/', function(req, res){
	//res.sendFile(__dirname + '/view/html/main_layout.html');
	res.sendFile(__dirname + 'login.html');
});

var controller = new Controller(io);
controller.start(io);
	
http.listen(port, function(){
	console.log('listening on *:'+port);
});

