function showDice( playingId ) {
	$('#rollDice .txtbox h1').text( model.players[playingId].name + "'s turn to roll the dice!");
	$("#rollDice img").attr("src", "img/wifi4.png");
	$('#rollDice').show();
}
function hideDice() {
	$('#diceResult').hide();
}
function rollDice() {
	$("#rollDice img").attr("src", "img/wifi.gif");
	if( model.players[model.nowPlaying].opticalFiber > 0 ) $("#rollDice h2").show();
	setTimeout(function(){
		if( model.players[model.nowPlaying].opticalFiber > 0 ) {
			$("#rollDice img").attr("src", "img/optiwifi.gif");
			setTimeout(function(){ 
				socket.emit('roll_dice', playerId); 
				$("#rollDice h2").hide();
			}, 1800);
		}
		else socket.emit('roll_dice', playerId);
	}, 1800);
}

function showDiceResult(diceResult) {
	var playingId = model.nowPlaying;
	$('#rollDice').hide();
	$('#diceResult .txtbox h2').text( model.players[playingId].name + " got");
	$('#diceResult .txtbox h1').text( diceResult );
	$('#diceResult img').attr( 'src', "img/wifi" + diceResult + ".png" );
	$('#diceResult').show();	
	setTimeout(hideDice, 1000);
}