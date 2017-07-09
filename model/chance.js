module.exports = [
	{
		description: "海底電纜被鯊魚咬斷，斷線一回合ＱＱ",
		activate: (model) => {
			model.players[model.nowPlaying].stop = true;
			return false;
		}
	},
	{
		description: "在口袋撿到兩百塊~~",
		activate: (model) => {
			model.players[model.nowPlaying].money+=200;
			return false;
		}
	},
	{
		description: "瓦斯有關嗎? 好像有又好像沒有 衝回家關一下",
		activate: (model) => {
			model.players[model.nowPlaying].pos="t"+model.nowPlaying;
			model.players[model.nowPlaying].last = null;
			return true;
		}
	},
	{
		description: "五穀豐登登登登~ 隨機升級一排房子!",
		activate: (model) => {
			var rand = Math.floor(Math.random()*5)
			for(var i = 1; i <= 5; i++){
				node = model.map[("c"+rand)+i];
				if(node.type == 'server'&&node.level>0){
					node.level+=1;
				}
			}
			return false;
		}
	},
	{
		description: "酷斯拉來襲!!! 隨機把一排房子降一等級QAQ",
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
