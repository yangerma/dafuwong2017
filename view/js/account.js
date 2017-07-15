function showAccountBox( res ) {
	

	for (var i = 0; i < 5; i++) {
		
		$('#account' + i + ' .accountProf span').text( model.players[i].name );
		$('#account' + i + ' .accountMoney span').text( Math.round10( model.players[i].money, -3 ) );
		
		/* TODO : read res */
		$('#account' + i + ' .accountServer1 span').text(  );
		$('#account' + i + ' .accountServer2 span').text(  );
		$('#account' + i + ' .accountServer3 span').text(  );

		$('#account' + i + ' .accountTotal span').text( Math.round10( , -3 ) );

	}

	// show
	$('#container').hide();
	$('#accountBox').show();
}