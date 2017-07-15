function sendMessage() {
	var msg = $('#messageForm').val();
	socket.emit('chat_message',msg);
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
