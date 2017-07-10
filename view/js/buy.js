function showNoMoney() {
	$('#noMoney').show();
	setTimeout(function(){
		$('#noMoney').hide();
	},2000);
}
function showCantBuy() {
	$('#cantBuy').show();
	setTimeout(function(){
		$('#cantBuy').hide();
	},2000);
}

function buyItem(itemId) {
	if (playerId >= 5) {
		return;
	}
	console.log("buy " + itemId);
	if ( model.players[playerId].money < model.items[itemId].cost ) {
		console.log("Failed to buy item QQ");
		showNoMoney();
	} else if (itemId=="hao123"&&model.map[model.players[playerId].pos].type!="server"){
		console.log("cant buy this node!!");
		showAlert("這裡不能買喔");
	} else {
		socket.emit('buy_item', playerId, itemId);
	}
}
