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
const ENVIRONMENT = 10;
const WAIT_TURN_OVER = 87;
const ITEM = "ITEM";
const END = "END GAME";

var password = ["meow", "beep", "wang", "woof", "oops"];

var map = require("./model/map.js");
var Player = require("./model/player.js");
var questions = require("./model/questions.js")();
var items = require("./model/items.js");
var chances = require("./model/chance.js");
var fs = require("fs");
var environments = require("./model/environment.js");

Controller = function(io, model) {
	var io = io;
	var playerIO = new Array();
	var adminIO = null;
	var obIO = new Array();
	var itemQueue = new Array();
	var model;
	model = model || {
		pause: false,
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
		playerIO.forEach((io) => {
			if (io) io.emit(event, arg)
		});
		if (adminIO)
			adminIO.emit(event, arg);
		obIO.forEach((io) => io.emit(event, arg));
	}

	function publish() {
		playerIO.forEach((io) => {
			if (io) io.emit("update", model);
		});
		if (adminIO) {
			adminIO.emit("update", model);
		}
		obIO.forEach((io) => io.emit("update", model));
	}

	function rollDice(id) {
		if (id == model.nowPlaying && model.state == WAIT_TO_ROLL) {
			var maxSteps = 4, diceResult;
			if (model.players[id].opticalFiber) {
				maxSteps = 8;
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
		if (model.state == STOP) {
			model.players[model.nowPlaying].stop = false;
		}
		if (itemQueue.length == 0) {
			if(model.nowPlaying == MAX_PLAYER-1)
				setTimeout(environmentEvent, 300);
			else
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
		}
		model.state=ITEM;
		publish();
		setTimeout(itemEvent, 300);
	}

	function environmentEvent() {
		model.state = ENVIRONMENT;
		model.environment = environments[Math.floor(Math.random() * environments.length)];
		var ret = model.environment.activate(model);
		console.log("environment!!");
		chat(model.environment.effect);
		publish();
		setTimeout(nextTurn, 2500);
	}

	function nextTurn() {
		if (model.state == WAIT_TO_ROLL) {
			return;
		}
		model.state = WAIT_TO_ROLL;
		var player = model.players[model.nowPlaying];
		/* dhcp over */
		if ((model.map[player.pos].type == "server" || model.map[player.pos].type == "home") && 
			player.id != model.nowPlaying) {
			model.players[model.nowPlaying].id = model.nowPlaying;
			model.players[model.nowPlaying].ip = "192.168." + model.nowPlaying + ".1";
		}
		model.nowPlaying = (model.nowPlaying + 1) % MAX_PLAYER;
		console.log("player " + model.nowPlaying + "'s turn.");
		if (model.players[model.nowPlaying].stop) {
			model.state = STOP;
		}
		publish();
		fs.writeFileSync('./backup.json', JSON.stringify(model), 'utf8');
	}

	function move(steps) {
		var next;
		var current = model.map[model.players[model.nowPlaying].pos];
		var srcId = current.next.indexOf(model.players[model.nowPlaying].last);
		var nowId = model.players[model.nowPlaying].id;
		var player = model.players[model.nowPlaying];
		if (current.type == "switch") {
			next = current.next[(srcId + model.switchState + 3) % 3];
			model.switchState *= -1;
		} else {
			next = current.next[srcId == 0 ? 1 : 0];
			current.next.reverse();
		}
		player.pos = next;
		player.last = current.id;
		publish();
		if (steps <= 1 || (!player.opticalFiber && model.map[next].firewall[nowId]))   {
			player.opticalFiber = false;
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
			chat(model.players[model.nowPlaying].name + " 撞牆了, 幫QQ");
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
			questions = require("./model/questions.js")();
		}
		model.question = questions.shift()
		console.log("Question: " + model.question.id);
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
		var newIp;
		do {
			newIp = Math.floor(Math.random() * 5);
		} while (newIp == model.nowPlaying); 
		model.state = DHCP;
		model.players[model.nowPlaying].id = newIp;
		model.players[model.nowPlaying].ip = "192.168." + newIp + "." + Math.ceil(Math.random() * 86 + 1); // Can't higher than 87 !
		console.log("player " + model.nowPlaying + "'s ip change to " + model.players[model.nowPlaying].ip);
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
		var ret = model.chance.activate(model);
		console.log("chance on" + model.nowPlaying);
		publish();
		if(ret == true) {//need nodeEvent();
			nodeEvent();
		}
	}

	function homeEvent() {
		model.state = HOME;
		var nowId = model.players[model.nowPlaying].id;
		var home = model.map[model.players[model.nowPlaying].pos];
		if (nowId == home.owner) {
			var reward = 3000;
			model.players[model.nowPlaying].money += reward;
			publish();
			notify("home", {playerId: model.nowPlaying, reward: reward});
		} else {
			model.state = HOUSE;
			payTolls(nowId, home);
		}
	}	

	function answerQuestion(ans) {
		console.log("Player answer: " + ans);
		if (model.question == null) {
			return;
		}
		var correct = JSON.stringify(model.question.correct) == JSON.stringify(ans);
		if ( correct ) {
			model.players[model.nowPlaying].money += model.question.money;
		}
		publish();
		notify("show_answer", correct);
		model.state = WAIT_TURN_OVER;
		model.question = null;
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
		model.state = WAIT_TURN_OVER;
	}

	function updateHouse() {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		model.players[nowId].money -= house.price[house.level];
		house.level += 1;
		model.state = WAIT_TURN_OVER;
		publish();
		notify("update_house", {playerId: nowId});
		if(house.level == 3) {
			chat("糟了! 是世界奇觀!");
		}
	}

	function payTolls(id, house) {
		var house = model.map[model.players[model.nowPlaying].pos];
		var nowId = model.players[model.nowPlaying].id;
		var tolls = house.tolls[house.level];
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
		if(type == "opticalFiber")
			model.players[playerId].opticalFiber = true;
		else
			itemQueue.push({playerId: playerId, type: type, arg: arg});
		model.players[playerId].money -= model.items[type].cost;
		console.log("Player " + playerId + " buy " + type);
		publish();
		notify("buy_item", {playerId: playerId, type: type});
		chat(model.players[playerId].name + " 購買了 " + model.items[type].name + "!");
	}

	function pause() {
		model.pause = (model.pause + 1) % 2;
		publish();
	}
	function chat(msg) {
		if(msg[0] == '/'){
			msg = msg.slice(1).split(' ');
			io.emit('cmd','[DEBUG]' + msg.length);
			if(msg[0]=="addmoney"){
				if(msg.length==3 && Number(msg[1])<5 && Number(msg[1])>=0 ){
					model.players[Number(msg[1])].money+=Number(msg[2]);
					chat('關主被賄賂了 呵呵');
					publish();
				}
				else{
					io.emit('cmd','usage : /addmoney [playerId] [money]')
				}
			}
		}
		else{
			msg = "[系統] " + msg;
			io.emit('chat_message', msg ,"SYSTEM");
		}
	}
	function chatPlayer(msg,id){
		msg = model.players[id].name + " 說: "+msg;
		io.emit('chat_message', msg ,"PLAYER");
	}
	function callGame() {
		var serverValue=[0,250,750,2250];
		model.state = END;
		var asset=[{},{},{},{},{}];
		for( var i = 0; i < 5; i++ ){
			asset[i].money = model.players[i].money;
			asset[i].total = model.players[i].money;
			asset[i].servers = [0,0,0,0];
		}
		for(var i in model.map){
			node = model.map[i];
			if(node.type=='server' && node.owner!=null){
				asset[node.owner].servers[node.level]+=1;
				asset[node.owner].total += serverValue[node.level];
			}
		}
		console.log(asset);
		io.emit('call_game',asset);
		
	}

	/* Listen new connection */
	io.on("connection", (player) => {

		console.log("New connection.");

		player.on("disconnect", () => {
			var id = playerIO.indexOf(player);
			console.log("Player " + id + " disconnect.");
			if (id >= 0) {
				playerIO[id] = null;
			}
		});

		player.on("login", (id, name, psw) => {
			if (id == 87 && psw == "csie") {
				adminIO = player;
				player.emit("HowDoYouTurnThisOn");
				player.on("WhosYourDaddy", (newModel) => model = newModel);
				player.on("pause", () => pause());
				player.on("call_game", () => callGame());
				player.on('chat_message', (msg) => chat(msg));
				console.log("admin login!");
			}else if (id >= 0 && id < 5 && psw == password[id]) {
				console.log("Player " + id + " login.");
				playerIO[id] = player;
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
			if(id != 87) {
				chat("玩家 " + name + " 上線了! 大家跟他打聲招呼吧!");
				player.on('chat_message', (msg) => chatPlayer(msg,id));
			}
		})
	});
}
module.exports = Controller;
