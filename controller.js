var MAX_PLAYER = 5;
var N_QUESTION = 13; 
/* Define game state. */
const GAMEOVER = 0;
const START = 1;
const MOVE = 2;
const SWITCH = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;
const HOUSE = 6;
const DHCP = 7;
const HOME = 8;

var map = require("./model/map.js");
var Player = require("./model/player.js");
var questions = require("./model/questions.js");
var items = require("./model/items.js");

Controller = function(io) {
	var io = io;
	var playerIO = new Array();
	var adminIO = null;
	var obIO = null;
	var itemQueue = new Array();
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
			Player(4, "p4"),
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
		if (adminIO != null)
			adminIO.emit(event, arg);
		if (obIO != null)
			obIO.emit(event, arg);
	}
	function publish() {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit("update", model);
			}
		}
		if (adminIO != null) {
			adminIO.emit("update", model);
		}
		if (obIO != null) {
			obIO.emit("update", model);
		}
	}

	function rollDice(id) {
		if (id == model.nowPlaying && model.state == WAIT_TO_ROLL) {
			var maxSteps = 4, diceResult;
			if (model.players[id].boost > 0) {
				maxSteps = 8;
				model.players[id].boost -= 1;
			}
			diceResult = Math.ceil(Math.random() * maxSteps);
			console.log("Player " + id + " roll " + diceResult);
			notify("dice_result", diceResult);
			model.state = MOVE;
			publish();
			setTimeout(() => move(diceResult), 3500);

		} else {
			console.log("Wrong player roll dice:" + id);
		}
	}

	function itemEvent() {
		if (itemQueue.length == 0) {
			setTimeout(nexTurn, 300);
			return;
		}
		var item = itemQueue.shift();
		var hao123Set = new Set();
		if (item.type == "hao123") {
			if (hao123Set.has(model.players[item.playerId].pos)) {
				model.players[item.playerId].money += model.items["hao123"].cost;
				/* TODO: notify player hao123 fail (?) */
			} else {
				model.map[model.players[item.playerId].pos].owner = item.playerId;
				hao123Set.add(model.players[item.playerId].pos);
			}
		} else if (item.type == "firewall") {
			item.arg.blockList.forEach((id) => model.map[arg.pos].firewall.add(id));
		} else if (item.type == "boost") {
			model.players[item.playerId].boost += 1;
		}
		publish()
		setTimeout(itemEvent, 300);
	}

	function nextTurn() {
		model.state = WAIT_TO_ROLL;
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		/* dhcp over */
		if (model.players[model.nowPlaying].id != model.nowPlaying) {
			model.players[model.nowPlaying].id = model.nowPlaying;
			model.players[model.nowPlaying].ip = "192.168." + model.players[model.nowPlaying].id + ".1";
		}
		console.log("player " + model.nowPlaying + "'s turn.");
		publish();
	}

	function move(steps) {
		var next;
		var current = model.map[model.players[model.nowPlaying].pos];
		var srcId = current.next.indexOf(model.players[model.nowPlaying].last);
		var nowId = model.players[model.nowPlaying].id;
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
		if (steps <= 1 || model.map[next].firewall.indexOf(nowId) != -1)   {
			setTimeout(nodeEvent, 300);
		} else {
			setTimeout(() => move(steps - 1), 300);
		}
	}

	function nodeEvent() {
		var node = model.map[model.players[model.nowPlaying].pos]
		var nowId = model.players[model.nowPlaying].id;
		if (node.firewall.indexOf(nowId) != 1) {
			node.firewall = [];
		}
		if (node.type == "question") {
			questionEvent();
		} else if (node.type == "server") {
			houseEvent();
		} else if (node.type == "dhcp") {
			dhcpEvent();
		} else if (node.type == "switch") {
			switchEvent();
		} else if (node.type == "chance") {
			/* TODO: chanceEvent)();  */
		} else if (node.type == "home") {
			homeEvent();
		}
	}

	function questionEvent() {
		model.state = QUESTION;
		var questionId = Math.round(Math.random() * N_QUESTION);
		model.question = questions[questionId];
		publish();
	}

	function houseEvent() {
		model.state = HOUSE;
		var nowId = model.players[model.nowPlaying].id;
		var house = model.map[model.players[model.nowPlaying].pos]
		if (house.owner != null && house.owner != nowId) {
			payTolls(nowId, house);
		}
		publish();
	}

	function dhcpEvent() {
		var newIp = Math.ceil(Math.random() * 5);
		model.state = DHCP;
		model.players[model.nowPlaying].id = newIp;
		model.players[model.nowPlaying].ip = "192.168." + newIp + "." + Math.ceil(Math.random() * 86 + 1); // Can't higher than 87 !
		//console.log("player " + model.nowPlaying + "'s ip change to " + model.players[model.nowPlaying].ip);
		publish();
		notify("dhcp", {playerId: model.nowPlaying, ip: model.players[model.nowPlaying].ip});
	}

	function switchEvent() {
		model.state = SWITCH;
		publish();
	}

	function homeEvent() {
		model.state = HOME;
		var nowId = model.players[model.nowPlaying].id;
		var home = model.map[model.players[model.nowPlaying].pos];
		if (nowId == home.owner) {
			var reward = 500;
			model.players[model.nowPlaying].money += reward;
			publish();
			notify("home", {playerId: model.nowPlaying, reward: reward});
		} else {
			payTolls(nowId, home);
		}
	}	

	function answerQuestion(ans) {
		if (JSON.stringify(model.question.correct) == JSON.stringify(ans)) {
			/* TODO: get question reward */
		}
		publish();
		notify("show_answer", ans);
	}

	function buyHouse() {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.price;
		house.owner = nowId;
		console.log("Player " + nowId + " buy " + house.id);
		publish();
		notify("buy_house", {playerId: nowId});
	}

	function updateHouse() {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.price;
		house.level += 1;
		/* TODO: update house price & tolls */
		publish();
		notify("update_house", {playerId: nowId});
	}

	function payTolls(id, house) {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.tolls;
		publish();
		notify("pay_tolls", {playerId: nowId});
	}

	function teleport(pos) {
		model.players[model.nowPlaying].pos = pos;
		model.players[model.nowPlaying].last = null;
		publish();
		nodeEvent();
	}

	function buyItem(playerId, type, arg) {
		itemQueue.push({playerId: playerId, type: type, arg: arg});
		model.players[playerId].money -= model.items[type].cost;
		publish();
		notify("buy_item", {playerId: playerId, type: type});
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

		player.on("login", (id, name) => {
			if (id == 87 && name == "ob") {
				obIO = player;
			} else if (id == 87 && name == "csie") {
				adminIO = player;
				player.emit("HowDoYouTurnThisOn");
				console.log("admin login!");
			} else {
				console.log("Player " + id + " login.");
				playerIO[id] = player;
				model.players[id].connect = true;
				model.players[id].name = name;
			}
			publish();
		})
		player.on("roll_dice", (playerId) => rollDice(playerId));
		player.on("buy_item",  (playerId, type, arg) => buyItem(playerId, type, arg));
		player.on("buy_house", buyHouse);
		player.on("answer_question", (ans) => answerQuestion(ans));
		player.on("update_house", updateHouse);
		player.on("switch", (pos) => teleport(pos));
		player.on("turn_over", itemEvent);
	});
}
module.exports = Controller;
