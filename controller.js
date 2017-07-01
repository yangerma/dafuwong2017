var MAX_PLAYER = 1;
var N_QUESTION = 13; 
/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const ROLL_DICE = 2;
const MOVE = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;

var map = require("./model/map.js");
var Player = require("./model/player.js");
var questions = require("./model/questions.js");

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
		],
		switchState: 1,
		question: null,
	}
	
	function publish() {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit("update", model);
			}
		}
	}

	function rollDice(id) {
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
	function nextTurn() {
		model.state = WAIT_TO_ROLL;
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		console.log("player " + model.nowPlaying + "'s turn.");
		publish();
	}

	function move() {
		model.state = MOVE;
		publish();
		for (var i = 0; i < model.diceResult; i++) {	
			setTimeout(() => {
				var next;
				var current = model.map[model.players[model.nowPlaying].pos];
				var srcId = current.next.indexOf(model.players[model.nowPlaying].last);
				if (current.type == "switch") {
					next = current.next[(srcId + model.switchState + 3) % 3];
					model.switchState *= -1;
				} else {
					next = current.next[srcId == 0 ? 1 : 0];
					current.next.reverse();
				}
				model.players[model.nowPlaying].pos = next;
				model.players[model.nowPlaying].last = current.id;
				publish();
			}, 500 * (i + 1));
		}
		setTimeout(() => {
			event();
		}, 500 * model.diceResult + 1000);
	}
	function event() {
		var nodeType = map[model.players[model.nowPlaying].pos].type;
		model.state = QUESTION;
		var questionId = Math.round(Math.random() * N_QUESTION);
		console.log("event: question " + questions[questionId]);
		model.question = questions[questionId];
		publish();
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
		player.on("turn_over", nextTurn);
	});
	/***************************************************************/
}
module.exports = Controller;
