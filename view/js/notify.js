function showAlert( whatchasay ){
	$('#alert').text(whatchasay);
	$('#alert').show();
	setTimeout(function(){
		$('#alert').hide();
	},1500);
}

function createNotification( res ) {

	var eventDes;
	switch( res.eventType ) {
		case 'buyItem' :
			eventDes = '購買了 ' + model.items[res.arg].name + ' 。' ;
			break;
		case 'buyHouse' :
			eventDes = '架了一台server。';
			break;
		case 'updateHouse' :
			eventDes = '升級了server。';
			break;
		case 'passOthersHouse' :
			eventDes = '踩到了 ' + model.players[res.arg].name + ' 的地！';
			break;
		case 'DHCP' :
			eventDes = '的ip已被DHCP更改為 ' + res.arg + ' 。';
			break;
		case 'home':
			eventDes = '挖礦挖到了฿ ' + res.arg + ' !';
			break;
	}

	var notifyBox  = $('<div class="notification popBox" style="display: none;"></div>');
	var notifyImg  = $('<img>').attr('src', 'img/prof' + res.teamId + '.png');
	var notifyDiv  = $('<div></div>');
	var notifyTeam = $('<p class="team">').text( model.players[res.teamId].name );
	var notifyDes  = $('<p>').text( eventDes );

	$( notifyDiv ).append( notifyTeam, notifyDes );
	$( notifyBox ).append( notifyImg, notifyDiv );

	//console.log(notifyBox);
	return notifyBox;

}

function showNotification( res ) {

	// res: { teamId, eventType, arg }
	// eventType = [ 'buyItem' | 'buyHouse' | 'updateHouse' | 'passOthersHouse' | 'DHCP' ]
	var newNotify = createNotification( res );
	$('#notifyContainer').prepend( newNotify );
	console.log('a notification was created');
	
	$( newNotify ).fadeIn(1000);
	setTimeout( function(){
		$( newNotify ).fadeOut(1000);
	}, 2000);
	setTimeout( function(){
		$( newNotify ).remove();
		console.log('a notification was destroyed');
	}, 3000);
}


