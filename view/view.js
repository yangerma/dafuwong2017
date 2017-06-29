var socket = io();
// var playerId = Number( JSON.parse( window.localStorage.getItem('tmpId') ) ); 
var playerId = null;

socket.on('update', function( data ) {
	update(data);
});

socket.on('dice_result', function ( res ) {
	show_dice_result( res );
});

socket.on('ready_to_roll', function ( now_playing ) {
	if( now_playing == playerId )
		$('#rollDice').show();
});

function roll_dice() {
	$("#rollDice img").attr("src", "img/wifi.gif");
	setTimeout( function(){
		$('#rollDice').hide();
		console.log("emit roll dice " + playerId);
		socket.emit('roll_dice', {player_id : playerId});
	}, 2000 );
}

function show_dice_result( res ) {
	console.log("on dice result");
	player_ID = res.player;
	dice_result = res.dice_result;
	$('#diceResult .txtbox h2').text("Player " + player_ID + " got");
	$('#diceResult .txtbox h1').text( dice_result );
	$('#diceResult img').attr( 'src', "img/wifi" + dice_result + ".png" );
	$('#diceResult').show();
	setTimeout( " $('#diceResult').hide(); ", 2000 );
}

function update( data ) {
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
}

function show_question( q ){

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
	})

}

function login(){
	playerID = Number( $('#teamID').val() );
	$('#container').show();
	$('#login').hide();
}