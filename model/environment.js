module.exports = [
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到5000元",
		activate: (model) => {
			for(player in model.players){
				player.money+=5000;
			}
		}
	},
	{
		description: "羅賓漢來了!! 劫富濟貧囉",
		effect: "最富有與最窮的人平分金錢",
		activate: (model) => {
			for(player in model.players){
				player.money+=5000;
			}
		}
	},
]
