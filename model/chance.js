module.exports = [
	{
		description: "海底電纜被鯊魚咬斷，斷線一回合ＱＱ",
		activate: function(model) {
			model.players[model.nowPlaying].stop = true;
		}
	},
]
