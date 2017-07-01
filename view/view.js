var socket = io();
var playerId = null;
var model = null

const GAMEOVER = 0;
const START = 1;
const ROLL_DICE = 2;
const MOVE = 3;;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;

socket.on('update', function(data) {
	model = data;
	update();
	var state = model.state;
	if (state == WAIT_TO_ROLL) {
		if (model.nowPlaying == playerId) {
			console.log("It your turn!");
			showDice();
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
	} else {
		console.log("Wrong state:" + state);
	}
});

function showDice() {
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

function login() {
	playerId = Number( $('#teamID').val() );
	$('#container').show();
	$('#login').hide();
	socket.emit("login", playerId);
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
		var x = $(currPos).offset().left;
		var y = $(currPos).offset().top;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);

		// update scoreboard
		var j = i;
		$('#info' + (i+1) + ' h4').text(model.players[j].name);
		$('#info' + (i+1) + ' p').text('$' + model.players[j].money);

		// update ip


		// update items 

	}
}

function showQuestion(q){

	// var q = questions[qid];
	$('#questionBox').show();
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

	$('#submitButton').click( function(){
		var ans = [];
		if( !q.multi ) ans.push( Number( $('input[name=qq]:checked').val() ) );
		else {
			$("input:checkbox[name=mq]:checked").each( function(){
			    ans.push( Number( $(this).val() ) );
			});
		}
		console.log( JSON.stringify(ans) );
		console.log( JSON.stringify(q.correct) );
		console.log( JSON.stringify(ans)==JSON.stringify(q.correct) );
		$("#questionBox").hide();
		socket.emit("turn_over");
	})

}
