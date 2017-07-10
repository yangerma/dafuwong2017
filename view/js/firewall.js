function showFirewall(){
	$('#firewallBox form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
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
	showAlert("請選擇目標地");
}


function firewallPos(blockList) {

	timeToChooseLand = true;
	$('#cpy_map div').addClass('activeLand');	

	var nodeID;
	// $("#cpy_map .activeLand").on("mouseover", function() {
	//     nodeID = $( this ).prop('id');
	//     nodeID = nodeID.substr(4);
	//     $('#'+nodeID).css('transform', 'scale(1.15, 1.15)');
	// }).on("mouseout", function() {
	// 	$('#'+nodeID).css('transform', 'scale(1, 1)');
	// });

	$('#cpy_map div').on('click', function() {
		// $('#cpy_map div').removeClass('activeLand');
		if ( !timeToChooseLand ) return;
		var landID = $( this ).prop('id');
		landID = landID.substr(4);
		timeToChooseLand = false;
		socket.emit('buy_item', playerId, 'firewall', {pos: landID, blockList: blockList});
		showAlert("防火牆已設定");
	});

}
