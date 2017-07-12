module.exports = [
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到5000元",
		activate: (model) => {
			for(player in model.players){
				player.money+=5000;
			}
			return false;
		}
	},
	{
		description: "羅賓漢來了!! 劫富濟貧囉",
		effect: "最富有與最窮的人平分金錢",
		activate: (model) => {
			var max = model.players[0];
			var min = model.players[0];
			for(player in model.players){
				if( player.money > max.money ) max = player;
				if( player.money < min.money ) min = player;
			}
			var even = 0.5 * ( max.money + min.money );
			max.money = even;
			min.money = even;
			return false;
		}
	},
	{
		description: "五穀豐登登登登~",
		effect: "隨機一排server全部升級",
		activate: (model) => {
			var rand = Math.floor(Math.random()*5)
			for(var i = 1; i <= 5; i++){
				node = model.map[("c"+rand)+i];
				if(node.type == 'server' && node.level>0 && node.level <3){
					node.level+=1;
				}
			}
			return false;
		}
	},
	{
		description: "酷斯拉來襲!!!塊塊塊塊塊陶阿",
		effect: "隨機一排server全部降級",
		activate: (model) => {
			var rand = Math.floor(Math.random()*5)
			for(var i = 1; i <= 5; i++){
				node = model.map[("c"+rand)+i];
				if(node.type == 'server'&&node.level>0){
					node.level-=1;
					if(node.level==0){
						node.owner=null;
					}
						
				}
			}
			return false;
		}
	},
]
