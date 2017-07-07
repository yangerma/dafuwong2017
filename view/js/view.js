var socket = io();
var playerId = null;
var playerName = null;
var model = null;
var old = null;
var timer = null;
var admin = false;
var playerColor = ['#F2E833', '#57CB60', '#A0362C', '#6968C5', '#686868'];

const GAMEOVER = 0;
const START = 1;
const MOVE = 2;
const SWITCH = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5
const HOUSE = 6;
const DHCP = 7;
const HOME = 8;

/* Notification */
socket.on("dice_result", (diceResult) => showDiceResult(diceResult));
socket.on("show_answer", (ans) => showAnswer(ans));
socket.on("buy_item", (arg) => showNotification({eventType: "buyItem", teamId: arg.playerId, arg: arg.type}));
socket.on("buy_house", (arg) => showNotification({eventType: "buyHouse", teamId: arg.playerId}));
socket.on("update_house", (arg) => showNotification({eventType: "updateHouse", teamId: arg.playerId}));
socket.on("pay_tolls", (arg) => showNotification({eventType: "passOthersHouse", teamId: arg.playerId}));
socket.on("dhcp", (arg) => showNotification({eventType: "DHCP", teamId: arg.playerId, arg: arg.ip}));
socket.on("vpn", (arg => showNotification({eventType: "vpn", teamId: arg.playerId})));
socket.on("home", (arg) => showNotification({eventType: "home", teamId: arg.playerId, arg: arg.reward}));
socket.on("HowDoYouTurnThisOn", () => admin = true);

socket.on('update', function(data) {
	if (admin) {
		playerId = data.nowPlaying;
	}
	old = model;
	model = data;
	update();
	var state = model.state;
	if (old != null && old.state == state) {
		return;
	}
	clearInterval(timer);
	switch (state) {
		case WAIT_TO_ROLL:
			if (model.nowPlaying == playerId) {
				console.log("It your turn!");
				showDice( playerId );
			} else {
				console.log("Player" + model.nowPlaying + "'s turn.");
			}
			break;
		case QUESTION:
			showQuestion();
			break;
		case HOUSE:
			if (model.nowPlaying == playerId) {
				showHouseEvent();
			}
			break;
		case SWITCH:
			if (model.nowPlaying == playerId) {
				showSwitch();
			}
			break;
		default:	
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
	/* update map */
	$.each(model.map, (id, node) => {
		if (node.type == "server" && node.owner != null) {
			$('#' + node.id).css('background-color', playerColor[node.owner]);
			$('#' + node.id + ' img').attr('src', 'img/server' + node.level + '.png');
		}
		if (old != null && node.level != old.map[node.id].level) {
			$('#' + node.id + ' img').attr('src', 'img/server_setup' + node.level + '.gif');
		}
	});
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

	$('#hao123 .itemPrice').text('$' + model.items["hao123"].cost);
	$('#opticalFiber .itemPrice').text('$' + model.items["opticalFiber"].cost);
	$('#firewall .itemPrice').text('$' + model.items["firewall"].cost);

	// update backpack
	if (playerId >= 5) {
		return;
	}

	$('#profile h1').text( model.players[playerId].name ); 
	$('#profilePic').attr( 'src', 'img/player' + playerId + '.gif' );

	// update items 
	$('#profMoney').text('you have $' + model.players[playerId].money);
	$('#profIP').text('your IP ' + model.players[playerId].ip );

	
}

function showBackpack() {
	// update items in popBox
	$('#backpack').show();
}

function showTurnOver() {
	$('#eventBox').hide();
	$("#end").show();
}

function turnOver() {
	$('#end').hide();
	socket.emit("turn_over");
}

function showNotification( res ) {

	// res: { teamId, eventType, arg }
	// eventType = [ 'buyItem' | 'buyHouse' | 'updateHouse' | 'passOthersHouse' | 'DHCP' ]

	if ( res.teamId == playerId ) {
		if (res.eventType == 'DHCP') {
			showDHCP();
		} else if (res.eventType == 'home') {
			showHome(res.arg);
		}
		return;
	}

	$('#notification img').attr('src', 'img/prof' + res.teamId + '.png');
	$('#notification #team').text( model.players[res.teamId].name );

	switch( res.eventType ) {
		case 'buyItem' :
			$('#notification #eventDes').text( '購買了 ' + model.items[res.arg].name + ' 。' );
			break;
		case 'buyHouse' :
			$('#notification #eventDes').text( '架了一台server。' );
			break;
		case 'updateHouse' :
			$('#notification #eventDes').text( '升級了server。' );
			break;
		case 'passOthersHouse' :
			$('#notification #eventDes').text( '踩到了 Player' + res.arg + ' 的地！' );
			break;
		case 'DHCP' :
			$('#notification #eventDes').text( '的ip已被DHCP更改為 ' + res.arg + ' 。' );
			break;
		case 'vpn':
			$('#notification #eventDes').text( '使用VPN繞過了防火牆！' );
			break;
		case 'home':
			$('#notification #eventDes').text( '挖礦挖到了$ ' + res.arg + ' !' );
			break;
	}
	
	$('#notification').fadeIn(1000);
	setTimeout(function(){
		$('#notification').fadeOut(1000);
	},2000);
}
