function getPosition(id) {
	var x = $(id).offset().left;
	var y = $(id).offset().top;
	alert('x:'+x+', y:'+y);
}

function updateScoreBoard() {
	for (var i = 1; i <= 5; i++) {
		var j = 
		$('#info' + i + ' h4').text(player[i-1].name);
		$('#info' + i + ' p').text('$' + player[i-1].money);
	}
}