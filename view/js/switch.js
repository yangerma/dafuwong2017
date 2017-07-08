var timeToChooseLand = false;

function showSwitch() {
	$('#switchBox').show();
}

function showDHCP() {
	$('#dhcpBox .ip').text( model.players[playerId].ip );
	$('#dhcpBox').show();
}

function showHome(reward) {
	$('#homeBox .reward').text(reward);
	$('#homeBox').show();
}

function chooseLand() {

	$('#switchBox').hide();
	timeToChooseLand = true;
	$('#cpy_map div').addClass('activeLand');	
	$('#cpy_map .inner').removeClass('activeLand');

	var nodeID;
	$("#cpy_map .activeLand").on("mouseover", function() {
	    nodeID = $( this ).prop('id');
	    nodeID = nodeID.substr(4);
	    $('#'+nodeID).css('transform', 'scale(1.15, 1.15)');
	}).on("mouseout", function() {
		$('#'+nodeID).css('transform', 'scale(1, 1)');
	});

	$('#cpy_map div').on('click', function() {
		$('#cpy_map .inner').addClass('activeLand');	
		$('#cpy_map div').removeClass('activeLand');
		if ( !timeToChooseLand ) return;
		var landID = $( this ).prop('id');
		console.log( 'choosen #' + landID );
		timeToChooseLand = false;
		socket.emit('switch', landID );
	});

}
