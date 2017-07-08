const MONEY_INIT = 5000;
Player = function(id, name) {
	return {
		id: id,
		name: name,
		money: MONEY_INIT,
		pos: "t" + id,
		last: null,
		boost: 0,
		stop: false,
		connect: false,
		ip: "192.168." + id + ".1",
	}
}

module.exports = Player;
