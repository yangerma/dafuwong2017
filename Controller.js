var MAX_PLAYER = 2;

/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const WAIT_TO_ROLL = 2;
const WAIT_TO_BUY = 3;

Controller = function(io) {
	this.io = io;
	this.state = {
		code : WAIT_TO_ROLL,
		nowPlaying : 0
	}
	this.turns = 0;
	this.players = new Array();
	return this;
}
Controller.prototype = {
	start : function() {
		this.io.on("connection", (player) => {
			console.log("New connection.");
			this.players.push(player);
			player.on("disconnect", () => {
				console.log("Player disconnect.");
				this.players.splice(this.players.indexOf(player), 1);
			});
			player.on("roll_dice", (playerId) => {
				this.rollDice(playerId);
			});
		});
	},
	update : function() {
		this.players.forEach(player => player.emit("update", this.state));
	},
	rollDice : function(player) {
		if (player.player_id == this.nowPlaying) {
			var diceResult = Math.ceil(Math.random() * 4)
			var playerId = player.player_id
			this.io.emit("dice_result", {
				dice_result : diceResult,
				player : playerId
			});
			console.log("Player " + playerId + " roll " + diceResult);
			this.nextTurn();
		}
		else {
			console.log("not ur turn!");
		}
		//this.state = WAIT_TO_BUY;
	},
	nextTurn : function() {
		this.nowPlaying = (this.nowPlaying + 1) % MAX_PLAYER;
		if (this.nowPlaying == 0) {
			this.turns++;
		}
		console.log("player " + this.nowPlaying + "'s turn.");
	}
}
module.exports = Controller;
