function showChance() {
	$('#chanceBox').show();	
	$('#chanceBox .des p').text(model.chance.description);
}

function showNoConnection() {
	$('#noConnection').show();
	setTimeout(function(){
		$('#noConnection').hide();
		turnOver();
	},1500);
}