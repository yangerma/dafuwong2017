function showFirewall(){
	if ( model.players[playerId].money < model.items['firewall'].cost ) {
		showAlert("你 買 不 起 :(");
		return;
	}
	$('#firewallBox form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	$("#firewallBox").show();
}

function closeFirewall() {

	var choices = [];
	$("#firewallBox input:checkbox:checked").each( function(){
	    choices.push( Number( $(this).val() ) );
	});
	
	firewallPos(choices);
	$('#backpack').hide();
	$('#firewallBox').hide();
	$('#firewallBox form').find('input:checkbox').removeAttr('checked');
	showAlert("請選擇目標地");
}


function firewallPos(blockList) {

	var timeToChooseLand = true;
	var nodeID;

	$('#cpy_map div').on('click', function() {
		if ( !timeToChooseLand ) return;
		var landID = $( this ).prop('id');
		landID = landID.substr(4);
		timeToChooseLand = false;
		socket.emit('buy_item', playerId, 'firewall', {pos: landID, blockList: blockList});
		showAlert("防火牆已設定");
	});

}
