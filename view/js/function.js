function getPosition(id) {
	var x = $(id).offset().left;
	var y = $(id).offset().top;
	alert('x:'+x+', y:'+y);
}

function updateScoreBoard() {
	for (var i = 0; i < 5; i++) {
		//var j = i;
		var j = rank[i];
		$('#info' + (i+1) + ' h4').text(player[j].name);
		$('#info' + (i+1) + ' p').text('$' + player[j].money);
	}
}

function updatePosition() {
	for (var i = 0; i < 5; i++) {
		var currPos = '#' + player[i].pos;
		var x = $(currPos).offset().left;
		var y = $(currPos).offset().top;
		$("#player" + i).css('top', y);
		$("#player" + i).css('left', x);
	}
}