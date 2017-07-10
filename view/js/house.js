function showHouseEvent() {
	var house = model.map[model.players[model.nowPlaying].pos];
	var nowId = model.players[model.nowPlaying].id;
	if( house.owner == null ) {
		$('#buyHouse .housePrice').text( house.price[house.level] );
		$('#buyHouse').show();
	}
	else if( house.owner == nowId && house.level <3 ) {
		$('#updateHouse .housePrice').text( house.price[house.level] );
		$('#updateHouse').show();
	}
	else if(house.owner == nowId){
		$('#cantupdateHouse').show();
	}
	else {	//other's house
		$('#passOthersHouse .houseOwner').text( model.players[house.owner].name );
		$('#passOthersHouse .housePrice').text( house.tolls[house.level] );
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
				showTurnOver();
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
