var socket = io();
var playerId = JSON.parse( window.localStorage.getItem('tmpId') );

// socket.on("player_id", function(res) {
// 	playerId = res.player_id;
// });

function roll_dice() {
	$('#rollDice').hide();
	console.log("emit roll dice " + playerId);
	socket.emit('roll_dice', {player_id : playerId});
}

socket.on('dice_result', function show_dice_result( res ) {
	console.log("on dice result");
	player_ID = res.player;
	dice_result = res.dice_result;
	$('#diceResult .txtbox h2').text("Player " + player_ID + " got");
	$('#diceResult .txtbox h1').text( dice_result );
	$('#diceResult img').attr( 'src', "/img/wifi" + dice_result + ".png" );
	$('#diceResult').show();
	setTimeout( " $('#diceResult').hide(); ", 2000 );
});

socket.on('update', function update( data ) {
	var player = data.player;	
	var rank = data.rank;

	for (var i = 0; i < 5; i++) {

		// update position
		var currPos = '#' + player[i].pos;
		var x = $(currPos).offset().left;
		var y = $(currPos).offset().top;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);

		// update scoreboard
		var j = i;
		$('#info' + (i+1) + ' h4').text(player[j].name);
		$('#info' + (i+1) + ' p').text('$' + player[j].money);

		// update ip


		// update items 

	}
});

function show_question( qid ){

	var q = questions[qid];
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

		// else for (var i = 0; i < q.options.length; i++) {
		// 	if( q.multi && $('#mop'+i+" input").checked ) ans.push(i);
		// }
		console.log( JSON.stringify(ans) );
		console.log( JSON.stringify(q.correct) );
		console.log( JSON.stringify(ans)==JSON.stringify(q.correct) );  
	})

}


