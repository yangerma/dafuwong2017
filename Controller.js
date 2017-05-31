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
			player.on("roll_dice", this.rollDice);
			
		});
		this.state = WAIT_TO_ROLL;
	},
	addPlayer : function(player) {
		this.players.push(player);
	},
	rollDice : function(player) {
		if (player.player_id == this.nowPlaying) {
			var diceResult = Math.ceil(Math.random() * 4)
			this.io.emit("dice_result", {
				player : playerId,
				dice_result : diceResult
			});
		}
		//this.state = WAIT_TO_BUY;
		this.nextTurn();
	},
	nextTurn : function() {
		this.nowPlaying = (this.nowPlaying + 1) % MAX_PLAYER;
		this.turns++;
	},
	start : function() {
		this.init();
	}
}
module.exports = Controller;
