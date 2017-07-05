function showDice( playingId ) {
	$('#rollDice .txtbox h1').text( model.players[playingId].name + "'s turn to roll the dice!");
	$('#rollDice').show();
}
function hideDice() {
	$('#diceResult').hide();
}
function rollDice() {
	socket.emit('roll_dice', playerId);
}
function showDiceResult(diceResult) {
	var playingId = model.nowPlaying;
	$("#rollDice img").attr("src", "img/wifi.gif");
	setTimeout( function(){
		$('#rollDice').hide();
		$('#diceResult .txtbox h2').text( model.players[playingId].name + " got");
		$('#diceResult .txtbox h1').text( diceResult );
		$('#diceResult img').attr( 'src', "img/wifi" + diceResult + ".png" );
		$('#diceResult').show();
		setTimeout(hideDice, 1000);
	}, 2000 );
}