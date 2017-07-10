$('form').submit(() =>{
	var msg = $('#messageForm').val();
	if(!admin)msg = model.players[playerId].name+" 說: "+msg;
	socket.emit('chat_message',msg);
	$('#messageForm').val('');
	return false;
	});
socket.on('chat_message',(msg) => {
	$('#messages').append($('<li>').text(msg));
	});
