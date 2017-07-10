function showNoMoney() {
	$('#noMoney').show();
	setTimeout(function(){
		$('#noMoney').hide();
	},2000);
}

function buyItem(itemId) {
	if (playerId >= 5) return;

	console.log("buy " + itemId);
	if( itemId == 1 && model.players[playerId].opticalFiber ) {
		showAlert("一次只能買一個");
	}
	else if ( model.players[playerId].money >= model.items[itemId].cost ) {
		socket.emit('buy_item', playerId, itemId);
	} else {
		console.log("Failed to buy item QQ");
		showNoMoney();
	}
}
