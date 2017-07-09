function showChance() {
	$('#chanceBox').show();	
	$('#chanceBox .des #chanceDescription').text(model.chance.description);
	$('#chanceBox .des #chanceEffect').text("效果:"+model.chance.effect);
}

function showNoConnection() {
	$('#noConnection').show();
	setTimeout(function(){
		$('#noConnection').hide();
		turnOver();
	},1500);
}