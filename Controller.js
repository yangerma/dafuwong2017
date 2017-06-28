/* 
 * This controller can only handle sequential event for every players turn.
 * I think at least there should be 1 more controller to handle realtime event (eg: buy items).
 */

var MAX_PLAYER = 2;

/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const WAIT_CONNECT = 2;
const WAIT_TO_ROLL = 3;
const WAIT_TO_BUY = 4;

Controller = function(io) {
	this.io = io;
	this.state = WAIT_CONNECT;
	this.nowPlaying = 0;
	this.turns = 0;
	this.players = new Array();
	return this;
}
Controller.prototype = {
	init : function() {
		this.players.forEach(function(player, id, array) {
			player.on("roll_dice", (player) => {
				this.rollDice(player);
			});
		}.bind(this));
		this.state = WAIT_TO_ROLL;
	},
	addPlayer : function(player) {
		this.players.push(player);
	},
	rollDice : function(player) {
		if (player.player_id == this.nowPlaying) {
			var diceResult = Math.ceil(Math.random() * 4)
			var player_id = player.player_id
			this.io.emit("dice_result", {
				dice_result : diceResult,
				player : player_id
			});
			this.nextTurn();
		}

		//this.state = WAIT_TO_BUY;
	},
	init : function() {
		this.players.forEach(function(player, id, array) {
			player.on("roll_dice", this.rollDice(player));
		});
		this.state = WAIT_TO_ROLL;
	},
	addPlayer : function(player) {
		this.players.push(player);
	},
	
	nextTurn : function() {
		this.nowPlaying = (this.nowPlaying + 1) % MAX_PLAYER;
		if (this.nowPlaying == 0) {
			this.turns++;
		}
	},
	start : function() {
		this.init();
	}
}
module.exports = Controller;
