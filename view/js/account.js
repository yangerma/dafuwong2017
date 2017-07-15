function showAccountBox( res ) {
	
	// read name
	for (var i = 0; i < 5; i++) {
		
		$('#account' + i + ' .accountProf span').text( model.players[i].name );



	}

	// show
	$('#container').hide();
	$('#accountBox').show();
}