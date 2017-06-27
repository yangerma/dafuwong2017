var socket = io();
function roll_dice() {
    socket.emit('roll_dice');
    return false;
}
socket.on('dice_result', function(res){
    console.log('haha');
    document.getElementById('output').innerHTML =
       'user ' + res.player + ' got '+ res.dice_result;
});



