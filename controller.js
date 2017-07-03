var MAX_PLAYER = 2;
var N_QUESTION = 13; 
/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const MOVE = 2;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;
const HOUSE = 6;

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
		map: map,
		items: items,
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
	
	function notify(event, arg) {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit(event, arg);
			}
		}
	}
	function publish() {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit("update", model);
			}
		}
	}

	function rollDice(id) {
		if (id == model.nowPlaying && model.state == WAIT_TO_ROLL) {
			var diceResult = Math.ceil(Math.random() * 4);
			console.log("Player " + id + " roll " + diceResult);
			notify("dice_result", diceResult);
			model.state = MOVE;
			publish();
			setTimeout(() => move(diceResult), 3000);

		} else {
			console.log("Wrong player roll dice:" + id);
		}
	}
	function nextTurn() {
		model.state = WAIT_TO_ROLL;
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		/* 
		 * TODO: round (5 turns == 1 round) (?)
		 * TODO: routing money per round (?)
		 */
		console.log("player " + model.nowPlaying + "'s turn.");
		publish();
	}

	function move(steps) {
		for (var i = 0; i < steps; i++) {	
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
			var nodeType = map[model.players[model.nowPlaying].pos].type;
			houseEvent();
			return;
			if (nodeType == "question") {
				questionEvent();
			} else if (nodeType == "server") {
				houseEvent();
			} else (nodeType == "dhcp") {
				dhcpEvent();
			} else if (nodeType == "switch") {
				/* TODO: switchEvent(); */
			} else if (nodeType == "chance") {
				/* TODO: chanceEvent)();  */
			}
		}, 500 * steps + 1000);
	}

	function questionEvent() {
		model.state = QUESTION;
		var questionId = Math.round(Math.random() * N_QUESTION);
		model.question = questions[questionId];
		publish();
	}

	function houseEvent() {
		model.state = HOUSE;
		var nowId = model.players[nowPlaying].id;
		var house = map[model.players[nowPlaying].pos]
		if (house.owner != null && house.owner != nowId) {
			/* TODO: players[nowId] pay tolls. */
		}
		publish();
		/* dhcp over */
		if (nowId != model.nowPlaying) {
			model.players[model.nowPlaying].id = model.nowPlaying;
		}
	}

	function dhcpEvent() {
		model.players[model.nowPlaying].id = Math.ceil(Math.random() * 5);
		publish();
		/* TODO: notify("dhcp"); */
	}

	function answerQuestion(ans) {
		if (JSON.stringify(model.question.correct) == JSON.stringify(ans)) {
			/* TODO: get question reward */
		}
		publish();
		notify("show_answer", ans);
	}
	function buyHouse() {
		var house = model.map[model.players[model.nowPlaying].pos]
		house.owner = model.nowPlaying;
		house.price += house.level * 300;
		house.tolls += house.level * 300;
		console.log("Player " + model.nowPlaying + " buy " + model.players[model.nowPlaying].pos);
		publish();
		/* TODO; notify("buy_house"); */
	}

	function buyItem(playerId, itemId) {
		model.players[playerId].money -= model.items[itemId].cost;
		model.players[playerId].items[itemId] += 1;
		publish();
		notify("buy_item", {playerId: playerId, itemId: itemId});
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
		player.on("roll_dice", (playerId) => rollDice(playerId));
		player.on("buy_item",  (playerId, itemId) => buyItem(playerId, itemId));
		player.on("buy_house", buyHouse);
		player.on("answer_question", (ans) => answerQuestion(ans));
		/*  TODO: player.on("use_item", (playerId, itemId) => useItem(playerId, itemId)); */
		player.on("turn_over", nextTurn);
	});
}
module.exports = Controller;
