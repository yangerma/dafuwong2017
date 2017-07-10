function showChance() {
	$('#chanceBox').show();
	$('#chanceBox .des #chanceTitle').text(model.players[model.nowPlaying].name+"得到了機會!");
	$('#chanceBox .des #chanceDescription').text(model.chance.description);
	$('#chanceBox .des #chanceEffect').text("效果:"+model.chance.effect);
}
