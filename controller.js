var MAX_PLAYER = 1;
var N_QUESTION = 13; 
/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const ROLL_DICE = 2;
const MOVE = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;
const BUY_ITEM = 6;

var map = require("./model/map.js");
var Player = require("./model/player.js");
var questions = require("./model/questions.js");
var items = require("./model/items.js");

Controller = function(io) {
	var io = io;
	var playerIO = new Array();
	var model = {
		state: WAIT_TO_ROLL,
		nowPlaying: 0,
		diceResult: null,
		map: map,
		items: items,
		players: [
			Player(0, "p0"),
			Player(1, "p1"),
			Player(2, "p2"),
			Player(3, "p3"),
			Player(4, "p4")
		],
		question: null,
		buyItem: null,
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
				model.players[model.nowPlaying].pos = 
					map[model.players[model.nowPlaying].pos].next[0];
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

	function buyItem(playerId, itemId) {
		var temp = model.state;
		model.state = BUY_ITEM;
		model.players[playerId].money -= model.items[itemId].cost;
		model.players[playerId].items[itemId] += 1;
		model.buyItem = {playerId: playerId, itemId: itemId};
		publish();
		model.state = temp;
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
		player.on("buy_item",  (id, item) => buyItem(id, item));
		player.on("turn_over", nextTurn);
	});
	/***************************************************************/
}
module.exports = Controller;
