function showHouseEvent() {
	var house = model.map[model.players[model.nowPlaying].pos];
	var nowId = model.players[model.nowPlaying].id;
	if( house.owner == null ) {
		$('#buyHouse .housePrice').text( house.price );
		$('#buyHouse').show();
	}
	else if( house.owner == nowId ) {
		$('#updateHouse .housePrice').text( house.price );
		$('#updateHouse').show();
	}
	else {	//other's house
		$('#passOthersHouse .houseOwner').text( 'player' + house.owner );
		$('#passOthersHouse .housePrice').text( house.tolls );
		$('#passOthersHouse').show();
	}

	var cnt = 30;
	$('.houseBox .timer').text('剩餘時間：'+cnt);
	timer =  setInterval(function(){
		cnt--;
		$('.houseBox .timer').text('剩餘時間：'+cnt);
		if( cnt == 0 ) {
			clearInterval(timer);
			$('.houseBox').hide();
			$('#timeOut').show();
			setTimeout( function(){
				$('#timeOut').hide();
			}, 700);
		}
	} , 1000);

}

function closeHouseBox() {
	$('.houseBox').hide();
	showTurnOver();
	clearInterval(timer);
}

function buyHouse() {
	socket.emit("buy_house");
	var playerColor = [ '#F2E833', '#57CB60', '#A0362C', '#6968C5', '#686868'];
	$( '#' + model.players[playerId].pos ).css('background-color', playerColor[playerId]);
	closeHouseBox();
}

function updateHouse() {
	socket.emit("update_house");
	closeHouseBox();
}
	
function passOthersHouse() {
	
}