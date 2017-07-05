var timeToChooseLand = false;

function showSwitch() {
	$('#switchBox').show();
}

function chooseLand() {

	$('#switchBox').hide();
	timeToChooseLand = true;
	$('#map div').addClass('activeLand');	

	$('#map div').on('click', function() {
		$('#map div').removeClass('activeLand');
		if ( !timeToChooseLand ) return;
		var landID = $( this ).prop('id');
		console.log( 'choosen #' + landID );
		timeToChooseLand = false;
		socket.emit('chooseLand', landID );
	});

}