var express = require('express');
var port = 9487;
var path = require('path');
var app= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var user_num=0;

app.use(express.static(path.join(__dirname, 'view')));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/html/main_layout.html');
  //res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('user '+ user_num + ' connected');
    var user = user_num++;
    socket.on('disconnect', function(){
        console.log('user '+user+' disconnectedQQ');
    });
    socket.on('roll_dice', function(){
        var dice_result=Math.ceil(Math.random()*4);
        var res = {
            dice_result : dice_result,
            player : user
        }
        console.log('user '+user+' rolled '+dice_result+" !");
        io.emit('dice_result', res);
    });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
