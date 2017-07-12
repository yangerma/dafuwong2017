function sendMessage() {
	var msg = $('#messageForm').val();
	if(!admin)msg = model.players[playerId].name+" 說: "+msg;
	socket.emit('chat_message',msg);
	$('#messageForm').val('');
	return false;
}
socket.on('chat_message',(msg) => {
	$('#messages').prepend($('<li>').text(msg));
});
$('#messageForm').keypress(function(e){
	var keyCode = e.keyCode || e.which;
	if (keyCode == '13'){
		sendMessage();
		return false;
	}
});
