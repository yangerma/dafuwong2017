 MAX_PLAYER = 5;
/* Define game state. */
const STOP = 0;
const START = 1;
const MOVE = 2;
const SWITCH = 3;
const WAIT_TO_ROLL = 4;
const QUESTION = 5;
const HOUSE = 6;
const DHCP = 7;
const HOME = 8;
const CHANCE = 9;

var password = ["meow", "beep", "wang", "woof", "oops"];

var map = require("./model/map.js");
var Player = require("./model/player.js");
var questions = require("./model/questions.js");
var items = require("./model/items.js");
var chances = require("./model/chance.js");

Controller = function(io) {
	var io = io;
	var playerIO = new Array();
	var adminIO = null;
	var obIO = new Array();
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
		chacne: null,
	}
	
	function notify(event, arg) {
		for (var i = 0; i < MAX_PLAYER; i++) {
			if (model.players[i].connect == true) {
				playerIO[i].emit(event, arg);
			}
		}
		if (adminIO != null)
			adminIO.emit(event, arg);
		obIO.forEach((io) => io.emit(event, arg));
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
		obIO.forEach((io) => io.emit("update", model));
	}

	function rollDice(id) {
		if (id == model.nowPlaying && model.state == WAIT_TO_ROLL) {
			var maxSteps = 4, diceResult;
			if (model.players[id].opticalFiber > 0) {
				maxSteps = 8;
				model.players[id].opticalFiber -= 1;
			}
			diceResult = Math.ceil(Math.random() * maxSteps);
			console.log("Player " + id + " roll " + diceResult);
			notify("dice_result", diceResult);
			model.state = MOVE;
			publish();
			setTimeout(() => move(diceResult), 1400);

		} else {
			console.log("Wrong player roll dice:" + id);
		}
	}

	function itemEvent() {
		if (itemQueue.length == 0) {
			setTimeout(nextTurn, 300);
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
			item.arg.blockList.forEach((id) => model.map[item.arg.pos].firewall[id] = true);
		} else if (item.type == "opticalFiber") {
			model.players[item.playerId].opticalFiber += 1;
		}
		publish()
		setTimeout(itemEvent, 300);
	}

	function nextTurn() {
		if (model.state == STOP) {
			model.players[model.nowPlaying].stop = false;
		}
		model.state = WAIT_TO_ROLL;
		var player = model.players[model.nowPlaying];
		/* dhcp over */
		if (model.map[player.pos].type == "server" && player.id != model.nowPlaying) {
			model.players[model.nowPlaying].id = model.nowPlaying;
			model.players[model.nowPlaying].ip = "192.168." + model.players[model.nowPlaying].id + ".1";
		}
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		console.log("player " + model.nowPlaying + "'s turn.");
		if (model.players[model.nowPlaying].stop) {
			model.state = STOP;
		}
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
		if (steps <= 1 || model.map[next].firewall[nowId])   {
			setTimeout(nodeEvent, 300);
		} else {
			setTimeout(() => move(steps - 1), 300);
		}
	}

	function nodeEvent() {
		var node = model.map[model.players[model.nowPlaying].pos]
		var nowId = model.players[model.nowPlaying].id;
		if (node.firewall[nowId]) {
			node.firewall.forEach((x, id, a) => a[id] = false);
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
			chanceEvent();		
		} else if (node.type == "home") {
			homeEvent();
		}
	}

	function questionEvent() {
		model.state = QUESTION;
		if (questions.length == 0) {
			questions = require("./model/questions.js");
		}
		model.question = questions.shift()
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
		var newIp = Math.floor(Math.random() * 5);
		model.state = DHCP;
		//model.players[model.nowPlaying].id = newIp;
		model.players[model.nowPlaying].ip = "192.168." + newIp + "." + Math.ceil(Math.random() * 86 + 1); // Can't higher than 87 !
		//console.log("player " + model.nowPlaying + "'s ip change to " + model.players[model.nowPlaying].ip);
		publish();
		notify("dhcp", {playerId: model.nowPlaying, ip: model.players[model.nowPlaying].ip});
	}

	function switchEvent() {
		model.state = SWITCH;
		publish();
	}

	function chanceEvent() {
		model.state = CHANCE;
		model.chance = chances[Math.floor(Math.random() * chances.length)];
		//model.chance = chances[3];
		var ret = model.chance.activate(model);
		console.log("chance on"+model.nowPlaying);
		publish();
		if(ret == true){//need nodeEvent();
			nodeEvent();
		}
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
			model.state = HOUSE;
			payTolls(nowId, home);
		}
	}	

	function answerQuestion(ans) {
		if (model.question == null) {
			return;
		}
		var correct = JSON.stringify(model.question.correct) == JSON.stringify(ans);
		if ( correct ) {
			model.players[model.nowPlaying].money += model.question.money;
		}
		model.question = null;
		publish();
		notify("show_answer", correct);
	}

	function buyHouse() {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.price[house.level];
		house.owner = nowId;
		house.level = 1;
		console.log("Player " + nowId + " buy " + house.id);
		publish();
		notify("buy_house", {playerId: nowId});
	}

	function updateHouse() {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.price[house.level];
		house.level += 1;
		publish();
		notify("update_house", {playerId: nowId});
	}

	function payTolls(id, house) {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		var tolls = house.tolls[house.level];
		if(house.type=="home"){
			tolls = house.tolls;
		}
		model.players[nowId].money -= tolls;
		model.players[house.owner].money += tolls;
		publish();
		notify("pay_tolls", {playerId: nowId, ownerId: house.owner});
	}

	function teleport(pos) {
		console.log("Player " + model.nowPlaying + " tp " + pos);
		model.players[model.nowPlaying].pos = pos;
		model.players[model.nowPlaying].last = null;
		publish();
		nodeEvent();
	}

	function buyItem(playerId, type, arg) {
		itemQueue.push({playerId: playerId, type: type, arg: arg});
		model.players[playerId].money -= model.items[type].cost;
		console.log("Player " + playerId + " buy " + type);
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

		player.on("login", (id, name, psw) => {
			if (id == 87 && name == "csie") {
				adminIO = player;
				player.emit("HowDoYouTurnThisOn");
				console.log("admin login!");
			} else if (id >= 0 && id < 5 && psw == password[id]) {
				console.log("Player " + id + " login.");
				playerIO[id] = player;
				model.players[id].connect = true;
				model.players[id].name = name;
			} else {
				obIO.push(player);
				player.emit("youCantDoNothing!");
				publish();
				return;	
			}
			publish();
			player.on("roll_dice", (playerId) => rollDice(playerId));
			player.on("buy_item",  (playerId, type, arg) => buyItem(playerId, type, arg));
			player.on("buy_house", buyHouse);
			player.on("answer_question", (ans) => answerQuestion(ans));
			player.on("update_house", updateHouse);
			player.on("switch", (pos) => teleport(pos));
			player.on("turn_over", itemEvent);
		})
	});
}
module.exports = Controller;
