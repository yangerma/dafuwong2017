module.exports = [
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到5000元",
		activate: (model) => {
				for(player in model.players){
					player.money+=5000;
				}
			}
		}
	},
]
