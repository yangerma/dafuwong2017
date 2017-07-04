var socket = io();
var playerId = null;
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
socket.on("buy_item", (arg) => showBuyItem(arg.playerId, arg.itemId));

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
	$('#container').show();
	$('#login').hide();
	socket.emit("login", playerId);
}

function showDice( playerId ) {
	$('#rollDice .txtbox h1').text("Player" + playerId + "'s turn to roll the dice!");
	$('#rollDice').show();
}
function hideDice() {
	$('#diceResult').hide();
}
function rollDice() {
	socket.emit('roll_dice', playerId);
}
function showDiceResult(diceResult) {
	var playerId = model.nowPlaying;
	$("#rollDice img").attr("src", "img/wifi.gif");
	setTimeout( function(){
		$('#rollDice').hide();
		$('#diceResult .txtbox h2').text("Player " + playerId + " got");
		$('#diceResult .txtbox h1').text( diceResult );
		$('#diceResult img').attr( 'src', "img/wifi" + diceResult + ".png" );
		$('#diceResult').show();
		setTimeout(hideDice, 1000);
	}, 2000 );
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

}

function showQuestion(){

	var q = model.question;
	$('#questionBox').show();
	$('#questionBox #timeLeft').show();
	$('#questionBox .closeButton').hide();
	$('#questionBox #answerResult').hide();
	$('#questionBox .qTitle h1').text(q.subject);
	$('#questionBox .qDes p').text(q.description);
	
	if (playerId == model.nowPlaying) {
		$("#submitButton").show();
	} else {
		$("#submitButton").hide();
	}

	if( q.multi ) {
		$('#questionBox #multiOptions').show();
		$('#questionBox #singleOptions').hide();
		for (var i = 0; i < 5; i++) {
			if( i < q.options.length ) {
				$('#mop'+i).show();
				$('#mop'+i+' label').text( q.options[i] );
			}
			else $('#mop'+i).hide();
		}
	}
	else {
		$('#questionBox #multiOptions').hide();
		$('#questionBox #singleOptions').show();
		for (var i = 0; i < 5; i++) {
			if( i < q.options.length ) {
				$('#sop'+i).show();
				$('#sop'+i+' label').text( q.options[i] );
			}
			else $('#sop'+i).hide();
		}
	}
	$('#questionBox form').show();

	var cnt = 120;
	$('#questionBox #timeLeft').text('剩餘時間：'+cnt);
	timer =  setInterval(function(){
		cnt--;
		$('#questionBox #timeLeft').text('剩餘時間：'+cnt);
		if( cnt == 0 ) {
			clearInterval(timer);
			$('#questionBox #timeLeft').hide();
			$('#answerResult h1').text("來不及了QQ");
			$('#answerResult img').attr( 'src', "img/wrong.png" );
			var correctAns = '正確答案：';
			for (var i = 0; i < q.correct.length; i++) {
				if( i!=0 ) correctAns += ",   ";
				correctAns += ( q.options[ q.correct[i] ] );
			}
			$('#questionBox #answerResult p').text(correctAns);
			$('#questionBox form').hide();
			$('#questionBox .closeButton').show();
			$('#questionBox #answerResult').show();
		}
	} , 1000);

	$('#submitButton').click( function(){
		clearInterval(timer);
		$('#questionBox #timeLeft').hide();
		var ans = [];
		if( !q.multi ) ans.push( Number( $('input[name=qq]:checked').val() ) );
		else {
			$("input:checkbox[name=mq]:checked").each( function(){
			    ans.push( Number( $(this).val() ) );
			});
		}
		socket.emit("answer_question", ans);
		showTurnOver();

	})

}
function showAnswer(ans) {
	var q = model.question;
	var correct = ( JSON.stringify(ans)==JSON.stringify(q.correct) );
	if (correct) {
		$('#answerResult h1').text("答對了！");
		$('#answerResult img').attr( 'src', "img/correct.png" );
	}
	else {
		$('#answerResult h1').text("答錯了QQ");
		$('#answerResult img').attr( 'src', "img/wrong.png" );
	}

	var correctAns = '正確答案：';
	for (var i = 0; i < q.correct.length; i++) {
		if( i!=0 ) correctAns += ",   ";
		correctAns += ( q.options[ q.correct[i] ] );
	}
	
	$('#questionBox #answerResult p').text(correctAns);
	$('#questionBox form').hide();
	$('#questionBox .closeButton').show();
	$('#questionBox #answerResult').show();
}
function closeQuestion() {
	$('#questionBox').hide();
}

function showBackpack() {
	// update items in popBox
	$('#backpack').show();
}

function showTurnOver() {
	$("#end").show();
}
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
	showTurnOver();
	closeHouseBox();
}

function updateHouse() {
	
}

function passOthersHouse() {
	
}
function buyItem(itemId) {
	if ( model.players[playerId].money >= model.items[itemId].cost ) {
		socket.emit('buy_item', playerId, itemId);
	} else {
		console.log("Failed to buy item QQ");
		showNoMoney();
	}
}

function turnOver() {
	$('#end').hide();
	socket.emit("turn_over");
}

function showNotification( res ) {

	// res: { teamId, eventType, arg }
	// eventType = [ 'buyItem' | 'buyHouse' | 'updateHouse' | 'passOthersHouse' | 'DHCP' ]

	$('#notification img').attr('src', 'img/prof' + res.teamId + '.png');
	$('#notification #team').text('Player ' + res.teamId );

	switch( res.eventType ) {
		case 'buyItem' :
			$('#notification p').text( '購買了 ' + res.arg + ' 。' );
			break;
		case 'buyHouse' :
			$('#notification p').text( '在 ' + res.arg + ' 架了一台server。' );
			break;
		case 'updateHouse' :
			$('#notification p').text( '在 ' + res.arg + ' 升級了server。' );
			break;
		case 'passOthersHouse' :
			$('#notification p').text( '踩到了 Player' + res.arg + ' 的地！' );
			break;
		case 'DHCP' :
			$('#notification p').text( '的ip已被DHCP更改為 ' + res.arg + ' 。' );
			break;
	}
	
	$('#notification').fadeIn(1000);
	setTimeout(function(){
		$('#notification').fadeOut(1000);
	},2000);
}

function showNoMoney() {
	$('#noMoney').show();
	setTimeout(function(){
		$('#noMoney').hide();
	},2000);
}

function passSwitch() {
	timeToChooseLand = true;
}

$('#map div').on('click', function() {
	if ( !timeToChooseLand ) return;
	var landID = $( this ).prop('id');
	console.log( 'choosen #' + landID );
	timeToChooseLand = false;
	socket.emit('chooseLand', landID );
});




