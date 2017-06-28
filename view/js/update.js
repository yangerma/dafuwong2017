var socket = io();

function roll_dice() {
    socket.emit('roll_dice');
    return false;
}

socket.on('dice_result', function(res){
    console.log('haha');
    document.getElementById('output').innerHTML =
       'user ' + res.player + ' got '+ res.dice_result;
});

socket.on('update', function( data ) {
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

function updatePosition() {
	for (var i = 0; i < 5; i++) {
		var currPos = '#' + player[i].pos;
		var x = $(currPos).offset().left;
		var y = $(currPos).offset().top;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);
	}
}

function updateScoreBoard() {
	for (var i = 0; i < 5; i++) {
		//var j = i;
		var j = rank[i];
		$('#info' + (i+1) + ' h4').text(player[j].name);
		$('#info' + (i+1) + ' p').text('$' + player[j].money);
	}
}

function show_question( q ){

	$('#questionBox').show();
	$('#questionBox .qTitle h1').text(q.subject);
	$('#questionBox .qDes p').text(q.description);

	// if( q.multi == true ) {

	// }
	// else {

	// }

}