function sendMessage() {
	var msg = $('#messageForm').val();
	if(!admin){
		msg = model.players[playerId].name+" 說: "+msg;
		socket.emit('chat_message',msg,"PLAYER");
	}
	else{
		msg = "[系統] "+msg;
		socket.emit('chat_message',msg,"SYSTEM");
	}
	$('#messageForm').val('');
	return false;
}
socket.on('chat_message',(msg,flag) => {
	$('#messages').prepend($('<li class='+flag+' >').text(msg));
	console.log(flag);
});
$('#messageForm').keypress(function(e){
	var keyCode = e.keyCode || e.which;
	if (keyCode == '13'){
		sendMessage();
		return false;
	}
});
