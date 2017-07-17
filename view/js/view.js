var socket = io();
var playerId = null;
var playerName = null;
var model = null;
var old = null;
var timer = null;
var admin = false;
var playerColor = ['#F2E833', '#57CB60', '#A0362C', '#6968C5', '#686868'];

const STOP = 0;
const START = 1;
const MOVE = 2;
const SWITCH = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5
const HOUSE = 6;
const DHCP = 7;
const HOME = 8;
const CHANCE = 9;
const ENVIRONMENT = 10;
const WAIT_TURN_OVER = 87;
const ITEM="ITEM";

/* Notification */
socket.on("dice_result", (diceResult) => showDiceResult(diceResult));
socket.on("show_answer", (ans) => showAnswer(ans));
socket.on("buy_item", (arg) => showNotification({eventType: "buyItem", teamId: arg.playerId, arg: arg.type}));
socket.on("buy_house", (arg) => showNotification({eventType: "buyHouse", teamId: arg.playerId}));
socket.on("update_house", (arg) => showNotification({eventType: "updateHouse", teamId: arg.playerId}));
socket.on("pay_tolls", (arg) => showNotification({eventType: "passOthersHouse", teamId: arg.playerId, arg: arg.ownerId}));
socket.on("dhcp", (arg) => showNotification({eventType: "DHCP", teamId: arg.playerId, arg: arg.ip}));
socket.on("home", (arg) => showNotification({eventType: "home", teamId: arg.playerId, arg: arg.reward}));
socket.on("YouCantDoNothing!", () => playerId = 87);
socket.on("call_game", (asset) => showAccountBox(asset));
socket.on("HowDoYouTurnThisOn", () => {
	admin = true;
	socket.on("cmd",(msg)=>addMessage(msg,"SYSTEM"));
	$("#pauseButton").show();
});

socket.on('update', function(data) {
	if (admin) {
		//playerId = data.nowPlaying;
	}
	old = model;
	model = data;
	if (model.pause) {
		if (!admin) $('#pause').show();
		$('#pauseButton').text("燒毀國防布！");
	} else {
		if (!admin) $('#pause').hide();
		$('#pauseButton').text("國防布！");
	}
	update();
	var state = model.state;
	if (old != null && old.state == state) {
		return;
	}
	clearInterval(timer);
	switch (state) {
		case STOP:
			if (model.players[playerId].stop) {
				showAlert("你 斷 線 了 :(");
				setTimeout( () => showTurnOver(), 1500 );
			}
			break;
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
		case DHCP:
			if (model.nowPlaying == playerId) {
				showDHCP();
			}
			break;
		case HOME:
			if (model.nowPlaying == playerId) {
				showHome(3000);
			}
			break;
		case CHANCE:
			showChance();
			break;
		case WAIT_TURN_OVER:
			if (model.nowPlaying == playerId) {
				showTurnOver();
			}
			break;
		case ENVIRONMENT:
			showEnvironment();
			break;
		default:	
			console.log("Wrong state:" + state);
	}
});

function login() {
	playerId = Number( $('#teamID').val() );
	playerName = $('#teamName').val();
	password = $('#teamPassword').val();
	$('#container').show();
	$('#login').hide();
	socket.emit("login", playerId, playerName, password);
}

function update() {
	/* update map */
	$.each(model.map, (id, node) => {
		//server
		if (node.type == "server" && node.owner != null) {
			$('#' + node.id).css('background-color', playerColor[node.owner]);
			$('#' + node.id + ' .serverImg').show();
			$('#' + node.id + ' .serverImg').attr('src', 'img/server' + node.level + '.png');

		}
		if (old != null && node.level > old.map[node.id].level) {//server upgrade
			$('#' + node.id + ' .serverImg').show();
			$('#' + node.id + ' .serverImg').attr('src', 'img/server_update' + node.level + '.gif');
		}
		if (old != null && node.level < old.map[node.id].level) {//server downgrade
			if(node.owner == null){
				$('#' + node.id + ' .serverImg').hide();
				$('#' + node.id).css('background-color', '#D9D9D9');
			}else{
				$('#' + node.id + ' .serverImg').show();
				$('#' + node.id + ' .serverImg').attr('src', 'img/server' + node.level + '.png');
			}
		}
		//firewall
		if (node.firewall.some((val) => val)) {
			$('#fw_' + node.id + ' .firewallImg').show();
			$('#fw_' + node.id + ' .firewallImg').attr('src', 'img/firewall_active.gif');
		}
		if (old != null && node.firewall.some((val, id) => old.map[node.id].firewall[id] != val) ) {
			console.log("make firewall great again");
			if (node.firewall.some((val) => val)) {
				$('#fw_' + node.id + ' .firewallImg').show();
				$('#fw_' + node.id + ' .firewallImg').attr('src', 'img/firewall_add.gif');
			} else {
				$('#fw_' + node.id + ' .firewallImg').attr('src', 'img/firewall_clear.gif');
				$('#fw_' + node.id + ' .firewallImg').hide();
			}
		}
	});
	for (var i = 0; i < 5; i++) {
		if (model.players[i].stop) {
			$('#player' + i).attr('src', 'img/dinosaur.png');
		} else {
			$('#player' + i).attr('src', 'img/player' + i + '.gif');
		}
		// update position
		var currPos = '#' + model.players[i].pos;
		var x = $(currPos).offset().left - 15 - i;
		var y = $(currPos).offset().top - 35 - 2*i;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);

		// update scoreboard
		var j = i;
		$('#info' + (i+1) + ' h4').text(model.players[j].name);
		$('#info' + (i+1) + ' p .scoreboardMoney').text('฿' + model.players[j].money);
		$('#info' + (i+1) + ' p .scoreboardIP').text(model.players[j].ip);

		if( model.players[j].id != j ) $('#info' + (i+1) + ' p .scoreboardIP').addClass('notMine');
		else $('#info' + (i+1) + ' p .notMine').removeClass('notMine');

		if( j == model.nowPlaying ) $('#rank' + j).css('background-color', '#E9E9E9');
		else $('#rank' + j).css('background-color', '');

	}

	// check who's turn
	if( model.nowPlaying != playerId ) $('#end').hide();

	// update switch state
	if( model.switchState == 1 ) $('#switch img').attr('src', 'img/cycle.png');
	else $('#switch img').attr('src', 'img/countercycle.png');

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

	$('#hao123 .itemPrice').text('฿' + model.items["hao123"].cost);
	$('#opticalFiber .itemPrice').text('฿' + model.items["opticalFiber"].cost);
	$('#firewall .itemPrice').text('฿' + model.items["firewall"].cost);

	// update backpack
	if (playerId >= 5) {
		return;
	}

	$('#profile h1').text( model.players[playerId].name ); 
	$('#profilePic').attr( 'src', 'img/player' + playerId + '.gif' );

	// update items 
	$('#profMoney').text('you have ฿' + model.players[playerId].money);
	$('#profIP').text('your IP ' + model.players[playerId].ip );	
	
}

function showBackpack() {
	// update items in popBox
	$('#backpack').show();
}

function showTurnOver() {
	// if (playerId != model.nowPlaying) {
	// 	return;
	// }
	$('#eventBox').hide();
	if(model.state == WAIT_TO_ROLL || model.nowPlaying != playerId){
		return;
	}
	$("#end").show();
}



function turnOver() {
	$('#end').hide();
	if (playerId == model.nowPlaying) {
		socket.emit("turn_over");
	}
}


function pause() {
	if (admin) {
		socket.emit('pause');
	}
}
