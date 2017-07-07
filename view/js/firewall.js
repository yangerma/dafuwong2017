function showFirewall(){
	$("#firewallBox").show();
}

function closeFirewall() {

	var ans = [];
	$("#firewallBox input:checkbox:checked").each( function(){
	    ans.push( Number( $(this).val() ) );
	});
	
	firewallPos(ans);
	$('#backpack').hide()
	$('#firewallBox').hide();
}
function firewallPos(blockList) {

	$('#map div').addClass('activeLand');	

	$('#map div').on('click', function() {
		$('#map div').removeClass('activeLand');
		var landID = $( this ).prop('id');
		timeToChooseLand = false;
		socket.emit('buy_item', playerId, 'firewall', {pos: landID, blockList: blockList});
	});

}
