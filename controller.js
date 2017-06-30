var MAX_PLAYER = 2;

/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const ROLL_DICE = 2;
const MOVE = 3;
const WAIT_TO_ROLL = 4;

var map = require("./model/map.js");
var Player = require("./model/player.js");

Controller = function(io) {
	var io = io;
	var playerIO = new Array();
	var model = {
		state: WAIT_TO_ROLL,
		nowPlaying: 0,
		diceResult: null,
		map: map,
		players: [
			Player(0, "p0"),
			Player(1, "p1"),
			Player(2, "p2"),
			Player(3, "p3"),
			Player(4, "p4")
		]
	}
	
	publish = function() {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit("update", model);
			}
		}
	}

	rollDice = function(id) {
		if (id == model.nowPlaying) {
			model.state = ROLL_DICE;
			model.diceResult = Math.ceil(Math.random() * 4);
			console.log("Player " + id + " roll " + model.diceResult);
			publish();
			setTimeout(move, 1000);

		} else {
			console.log("Wrong player roll dice:" + id);
		}
	}
	nextTurn = function() {
		model.state = WAIT_TO_ROLL;
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		console.log("player " + model.nowPlaying + "'s turn.");
	}
	move = function() {
		model.state = MOVE;
		publish();
		for (var i = 0; i < model.diceResult; i++) {	
			setTimeout(() => {
				model.players[model.nowPlaying].pos = 
					map[model.players[model.nowPlaying].pos].next[0];
				publish();
			}, 500 * (i + 1));
		}
		setTimeout(() => {
			nextTurn();
			publish();
		}, 500 * (model.diceResult + 2));
	}
	

	/* Listen new connection */
	io.on("connection", (player) => {

		console.log("New connection.");

		player.on("disconnect", () => {
			var id = playerIO.indexOf(player);
			console.log("Player " + id + " disconnect.");
			if (id >= 0) {
				model.players[id].connect = false;
			}
		});

		player.on("login", (id) => {
			console.log("Player " + id + " login.");
			playerIO[id] = player;
			model.players[id].connect = true;
			player.emit("update", model);
		})
		player.on("roll_dice", (id) => rollDice(id));
	});
	/***************************************************************/
}
module.exports = Controller;
