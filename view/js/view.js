var socket = io();
var playerId = null;
var playerName = null;
var model = null;
var timer = null;

var timeToChooseLand = false;

const GAMEOVER = 0;
const START = 1;
const MOVE = 2;
const WAIT_TO_ROLL = 4;
const QUESTION = 5
const HOUSE = 6;

/* Notification */
socket.on("dice_result", (diceResult) => showDiceResult(diceResult));
socket.on("show_answer", (ans) => showAnswer(ans));
socket.on("buy_item", (arg) => showNotification({eventType: "buyItem", teamId: arg.playerId, arg: arg.itemId}));
socket.on("buy_house", (arg) => showNotification({eventType: "buyHouse", teamId: arg.playerId, arg: arg.pos}));
socket.on("update_house", (arg) => showNotification({eventType: "updateHouse", teamId: arg.playerId, arg: arg.pos}));
socket.on("pay_tolls", (arg) => showNotification({eventType: "passOthersHouse", teamId: arg.playerId, arg: arg.pos}));
socket.on("dhcp", (arg) => showNotification({eventType: "DHCP", teamId: arg.playerId, arg: arg.ip}));

socket.on('update', function(data) {
	var old = model;
	model = data;
	clearInterval(timer);
	update();
	var state = model.state;
	if (old != null && old.state == state) {
		return;
	}
	if (state == WAIT_TO_ROLL) {
		if (model.nowPlaying == playerId) {
			console.log("It your turn!");
			showDice( playerId );
		} else {
			console.log("Player" + model.nowPlaying + "'s turn.");
		}
	} else if (state == QUESTION) {
		showQuestion();
	} else if (state == HOUSE) {
		if (model.nowPlaying == playerId) {
			showHouseEvent();
		}
	} else {
		console.log("Wrong state:" + state);
	}
});

function login() {
	playerId = Number( $('#teamID').val() );
	playerName = $('#teamName').val();
	$('#container').show();
	$('#login').hide();
	socket.emit("login", playerId, playerName);
}

function update() {
	for (var i = 0; i < 5; i++) {

		// update position
		var currPos = '#' + model.players[i].pos;
		var x = $(currPos).offset().left - 15 - i;
		var y = $(currPos).offset().top - 35 - 2*i;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);

		// update scoreboard
		var j = i;
		$('#info' + (i+1) + ' h4').text(model.players[j].name);
		$('#info' + (i+1) + ' p').text('$' + model.players[j].money);

		// update ip
	}

	// update backpack
	$('#profile h1').text( model.players[playerId].name ); 
	$('#profilePic').attr( 'src', 'img/player' + playerId + '.gif' );

	// update items 
	$('#firewall .cnt').text('目前共有' + model.players[playerId].items[0] + '個');
	$('#vpn .cnt').text('目前共有' + model.players[playerId].items[1] + '個');
	$('#profMoney').text('you have $' + model.players[playerId].money);
	$('#vpn .itemPrice').text('$' + model.items[1].cost);
	$('#firewall .itemPrice').text('$' + model.items[0].cost);
	$('#profIP').text('your IP is 192.168.' + model.players[playerId].id + '.1');

	// update switch state
	if( model.switchState == 1 ) $('#switch img').css('transform', 'scale(1,1)');
	else $('#switch img').css('transform', 'scale(1,-1)');

	// check intersection
	if( model.map.t0.next[0] == 'c01' ) 
		 $('#t0').css('transform', 'rotate(30deg)');
	else $('#t0').css('transform', 'rotate(90deg)');
	if( model.map.t2.next[0] == 'c21' )	
		 $('#t2').css('transform', 'rotate(180deg)');
	else $('#t2').css('transform', 'rotate(225deg)');
	if( model.map.t3.next[0] == 'c31' )	
		 $('#t3').css('transform', 'rotate(248deg)');
	else $('#t3').css('transform', 'rotate(305deg)');

}

function showBackpack() {
	// update items in popBox
	$('#backpack').show();
}

function showTurnOver() {
	$("#end").show();
}

function turnOver() {
	$('#end').hide();
	socket.emit("turn_over");
}

function showNotification( res ) {

	// res: { teamId, eventType, arg }
	// eventType = [ 'buyItem' | 'buyHouse' | 'updateHouse' | 'passOthersHouse' | 'DHCP' ]

	$('#notification img').attr('src', 'img/prof' + res.teamId + '.png');
	$('#notification #team').text( model.players[res.teamId].name );

	switch( res.eventType ) {
		case 'buyItem' :
			$('#notification #eventDes').text( '購買了 ' + res.arg + ' 。' );
			break;
		case 'buyHouse' :
			$('#notification #eventDes').text( '在 ' + res.arg + ' 架了一台server。' );
			break;
		case 'updateHouse' :
			$('#notification #eventDes').text( '在 ' + res.arg + ' 升級了server。' );
			break;
		case 'passOthersHouse' :
			$('#notification #eventDes').text( '踩到了 Player' + res.arg + ' 的地！' );
			break;
		case 'DHCP' :
			$('#notification #eventDes').text( '的ip已被DHCP更改為 ' + res.arg + ' 。' );
			break;
	}
	
	$('#notification').fadeIn(1000);
	setTimeout(function(){
		$('#notification').fadeOut(1000);
	},2000);
}

function passSwitch() {

	$('#onSwitch').show();
	setTimeout(function(){
		$('#onSwitch').hide();
		timeToChooseLand = true;
		$('#map div').addClass('activeLand');
	},2000);	

	$('#map div').on('click', function() {
		if ( !timeToChooseLand ) return;
		$('#map div').removeClass('activeLand');
		var landID = $( this ).prop('id');
		console.log( 'choosen #' + landID );
		timeToChooseLand = false;
		socket.emit('chooseLand', landID );
	});

}