module.exports = [
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到3000元",
		activate: (model) => {
			model.players.forEach((p) => p.money+=3000);
			return false;
		}
	},
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到1000元",
		activate: (model) => {
			model.players.forEach((p) => p.money+=1000);
			return false;
		}
	},
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到1000元",
		activate: (model) => {
			model.players.forEach((p) => p.money+=1000);
			return false;
		}
	},
	{
		description: "政府為推廣電子貨幣 發錢囉",
		effect: "所有人得到1000元",
		activate: (model) => {
			model.players.forEach((p) => p.money+=1000);
			return false;
		}
	},
	{
		description: "一起搭捷運去淡水玩~",
		effect: "每個人付出交通費50元",
		activate: (model) => {
			model.players.forEach((p) => p.money-=50);
			return false;
		}
	},
	{
		description: "去Google參訪，吃了很多垃圾食物",
		effect: "每個人都胖了一公斤",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "社會救助",
		effect: "每個人給最窮的人1000元",
		activate: (model) => {
			var min = model.players[0];
			model.players.forEach((player) => {
				if( player.money < min.money ) min = player;
				player.money-=1000;
			});
			min.money += 5000;
			return false;
		}
	},
	{
		description: "羅賓漢來了!! 劫富濟貧囉",
		effect: "最富有與最窮的人平分金錢",
		activate: (model) => {
			var max = model.players[0];
			var min = model.players[0];
			model.players.forEach((player) => {
				if( player.money > max.money ) max = player;
				if( player.money < min.money ) min = player;
			});
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
	{
		description: "你知道嗎?",
		effect: "Java跟Javascript的關係就像狗根熱狗一樣唷。",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "你知道嗎?",
		effect: "USB圖標的設計來源是海神尼普頓手中的三齒神叉唷。",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "你知道嗎?",
		effect: "電腦的中央處理器中含有黃金唷。",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "你知道嗎?",
		effect: "超過87%的系統工程師會在主機上放乖乖祈求平安。",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "你知道嗎?",
		effect: "如果有無限的時間，猴子也能寫程式唷。",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "你知道嗎?",
		effect: "C語言的前身是B語言，B語言到前身是A語言。",
		activate: (model) => {
			return false;
		}
	},
]
