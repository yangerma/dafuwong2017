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
	$('.eventBox .timer').text('剩餘時間：'+cnt);
	timer =  setInterval(function(){
		cnt--;
		$('.eventBox .timer').text('剩餘時間：'+cnt);
		if( cnt == 0 ) {
			clearInterval(timer);
			$('.eventBox').hide();
			$('#timeOut').show();
			setTimeout( function(){
				$('#timeOut').hide();
			}, 700);
		}
	} , 1000);

}

function closeHouseBox() {
	$('.eventBox').hide();
	showTurnOver();
	clearInterval(timer);
}

function buyHouse() {
	socket.emit("buy_house");
	closeHouseBox();
}

function updateHouse() {
	socket.emit("update_house");
	closeHouseBox();
}
