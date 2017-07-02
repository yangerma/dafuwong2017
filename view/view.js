var socket = io();
var playerId = null;
var model = null;
var timer = null;

const GAMEOVER = 0;
const START = 1;
const ROLL_DICE = 2;
const MOVE = 3;;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;
const BUY_ITEM = 6;

socket.on('update', function(data) {
	model = data;
	clearInterval(timer);
	update();
	var state = model.state;
	if (state == WAIT_TO_ROLL) {
		if (model.nowPlaying == playerId) {
			console.log("It your turn!");
			showDice( playerId );
		} else {
			console.log("Player" + model.nowPlaying + "'s turn.");
		}
	} else if (state == ROLL_DICE) {
		showDiceResult();
	} else if (state == MOVE) {
		hideDice();
	} else if (state == QUESTION) {
		if (model.nowPlaying == playerId) {
			showQuestion(model.question);
		}
	} else if (state == BUY_ITEM) {
		/* update model.buyItem = {playerId, itemId} */
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
	$("#rollDice img").attr("src", "img/wifi.gif");
	setTimeout( function(){
		$('#rollDice').hide();
		console.log("emit roll dice");
		socket.emit('roll_dice', playerId);
	}, 2000 );
}
function showDiceResult() {
	player_ID = model.nowPlaying;
	dice_result = model.diceResult;
	$('#diceResult .txtbox h2').text("Player " + player_ID + " got");
	$('#diceResult .txtbox h1').text( dice_result );
	$('#diceResult img').attr( 'src', "img/wifi" + dice_result + ".png" );
	$('#diceResult').show();
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
	$('#profIP').text('your IP is ' + model.players[playerId].ip);

	// update switch state
	if( model.switchState == 1 ) $('#switch img').css('transform', 'scale(1,1)');
	else $('#switch img').css('transform', 'scale(1,-1)');

}

function showQuestion(q){

	// var q = questions[qid];
	$('#questionBox').show();
	$('#questionBox #timeLeft').show();
	$('#questionBox .closeButton').hide();
	$('#questionBox #answerResult').hide();
	$('#questionBox .qTitle h1').text(q.subject);
	$('#questionBox .qDes p').text(q.description);

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
	})

}
function closeQuestion() {
	$('#questionBox').hide();
	socket.emit("turn_over");
}

function arriveLand( land ) {
	if( land.ownerId == null ) {
		$('#buyHouse .housePrice').text( land.updatePrice );
		$('#buyHouse').show();
	}
	else if( land.ownerId == playerId ) {
		$('#updateHouse .housePrice').text( land.updatePrice );
		$('#updateHouse').show();
	}
	else {	//other's land
		$('#passOthersHouse .houseOwner').text( 'player' + land.ownerId );
		$('#passOthersHouse .housePrice').text( land.passPrice );
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
	clearInterval(timer);
}

function buyItem(itemId) {
	if (model.players[playerId].money >= model.items[itemId].cost) {
		socket.emit('buy_item', playerId, itemId);
	} else {
		console.log("Failed to buy item QQ");
	}
}