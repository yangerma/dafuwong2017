var socket = io();
var playerId = null;

function roll_dice() {
    socket.emit('roll_dice', {player_id : playerId});
}

// socket.on('dice_result', function(res){
//     console.log(res)
//     document.getElementById('output').innerHTML =
//        'user ' + res.player + ' got '+ res.dice_result;
// });

// socket.on("player_id", function(res) {
// 	playerId = res.player_id;
// 	document.getElementById('output').innerHTML =
// 		"Your id is" + playerId;
// });