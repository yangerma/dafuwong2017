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

	$('#pleaseChooseLand').show();
	setTimeout(function(){
		$('#pleaseChooseLand').hide();
		timeToSwitch = true;
		$('#cpy_map div').addClass('activeLand');	
		$('#cpy_map .inner').removeClass('activeLand');
	},1500);

	var nodeID;
	// $("#cpy_map .activeLand").on("mouseover", function() {
	//     nodeID = $( this ).prop('id');
	//     nodeID = nodeID.substr(4);
	//     $('#'+nodeID).css('transform', 'scale(1.15, 1.15)');
	// }).on("mouseout", function() {
	// 	$('#'+nodeID).css('transform', 'scale(1, 1)');
	// });

	$('#cpy_map div').on('click', function() {
		// $('#cpy_map .inner').addClass('activeLand');	
		// $('#cpy_map div').removeClass('activeLand');
		if ( !timeToSwitch ) return;
		var landID = $( this ).prop('id');
		console.log( 'choosen #' + landID );
		timeToSwitch = false;
		socket.emit('switch', landID.split('_')[1] );
	});

}
