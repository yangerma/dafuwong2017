function buyItem(item) {
	if (playerId >= 5) return;

	console.log("buy " + item);
	var node = model.map[model.players[playerId].pos];
	if( item == "opticalFiber" && model.players[playerId].opticalFiber ) {
		showAlert("一輪限量一個");
	} else if ( model.players[playerId].money < model.items[item].cost ) {
		console.log("Failed to buy item QQ");
		showAlert("你 買 不 起 :(");
	} else if (item=="hao123" && (node.type!="server" || node.owner == null)){
		console.log("cant buy this node!!");
		showAlert("這裡不能買喔");
	} else {
		socket.emit('buy_item', playerId, item);
	}

}
