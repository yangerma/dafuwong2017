function showChance() {
	$('#chanceBox').show();	
	$('#chanceBox .des #chanceDescription').text(model.chance.description);
	$('#chanceBox .des #chanceEffect').text("效果:"+model.chance.effect);
}
