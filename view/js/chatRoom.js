$('form').submit(() =>{
	socket.emit('chat_message',$('#messageForm').val());
	$('#messageForm').val('');
	return false;
	});
socket.on('chat_message',(msg) => {
	$('#messages').append($('<li>').text(msg));
	});
