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
]
