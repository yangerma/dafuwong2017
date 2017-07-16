function showAccountBox( res ) {
	

	for (var i = 0; i < 5; i++) {
		
		$('#account' + i + ' .accountProf span').text( model.players[i].name );
		$('#account' + i + ' .accountMoney span').text( Math.round( model.players[i].money, -3 ) );
		
		for (var j = 1; j <=3; j++){
			$('#account' + i + ' .accountServer' + j + ' span').text(  res[i].servers[j]);
		}
		$('#account' + i + ' .accountTotal span').text( Math.round( res[i].total, -3 ) );

	}

	// show
	$('#container').hide();
	$('#accountBox').show();
}
