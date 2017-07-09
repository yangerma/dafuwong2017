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
		description: "忘記關瓦斯",
		activate: (model) => {
			model.players[model.nowPlaying].pos="t"+model.nowPlaying;
			model.players[model.nowPlaying].last = null;
			return true;
		}
	},
	{
		description: "五穀豐登登登登~",
		activate: (model) => {
			model.map["c11"].level+=1;
			model.map["c12"].level+=1;
			model.map["c13"].level+=1;
			model.map["c14"].level+=1;
			return false;
		}
	},
]
