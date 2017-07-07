function showNoMoney() {
	$('#noMoney').show();
	setTimeout(function(){
		$('#noMoney').hide();
	},2000);
}

function buyItem(itemId) {
	if ( model.players[playerId].money >= model.items[itemId].cost ) {
		socket.emit('buy_item', playerId, itemId);
	} else {
		console.log("Failed to buy item QQ");
		showNoMoney();
	}
}
