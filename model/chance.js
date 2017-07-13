module.exports = [
	{
		description: "海底電纜被鯊魚咬斷!!",
		effect: "此玩家斷線一回合ＱＱ",
		activate: (model) => {
			model.players[model.nowPlaying].stop = true;
			return false;
		}
	},
	{
		description: "在口袋撿到兩百塊~~",
		effect: "獲得 200元",
		activate: (model) => {
			model.players[model.nowPlaying].money+=200;
			return false;
		}
	},
	{
		description: "瓦斯有關嗎? 好像有又好像沒有 衝回家關一下",
		effect: "立刻回到家 獲得回家獎勵3000元",
		activate: (model) => {
			model.players[model.nowPlaying].pos="t"+model.nowPlaying;
			model.players[model.nowPlaying].last = null;
			model.players[model.nowPlaying].money+=3000;
			return false;
		}
	},
	{
		description: "不小心駭掉別人的帳戶",
		effect: "獲得 贓款 4000元",
		activate: (model) => {
			model.players[model.nowPlaying].money+=4000;
			return false;
		}
	},
	{
		description: "騎ubike逛台大 不幸被水源阿伯拖吊 隔天才去領車",
		effect: "損失 1000元",
		activate: (model) => {
			model.players[model.nowPlaying].money-=2000;
			return false;
		}
	},
	{
		description: "以為自己期末爆了 結果還是領了書卷獎",
		effect: "獲得 獎學金3000元",
		activate: (model) => {
			model.players[model.nowPlaying].money+=3000;
			return false;
		}
	},
	{
		description: "去google做實習 累積了很多經驗 學習了很多新知識",
		effect: "就是很爽而已",
		activate: (model) => {
			return false;
		}
	},
	{
		description: "擊落戰鬥機",
		effect: "獎金3000元",
		activate: (model) => {
			model.players[model.nowPlaying].money+=3000;
			return false;
		}
	},
	{
		description: "這是你的生日，我也是看FB才知道的",
		effect: "向每人收取禮金500元",
		activate: (model) => {
			model.players[model.nowPlaying].money+=2500;
			for(var i=0;i<5;i++){
				model.players[i].money-=500;
			}
			return false;
		}
	},
	{
		description: "機房的冷卻系統漏水 整修自己所有的server",
		effect: "損失 server*250元",
		activate: (model) => {
			for(var id in model.map){
				node=model.map[id];
				if(node.type=='server'&&node.owner==model.nowPlaying){
					model.players[model.nowPlaying].money-=250*(1<<(node.level-1));
				}
			}
			return false;
		}
	},
]
