const MONEY_INIT = 5000;
Player = function(id, name) {
	return {
		id: id,
		name: name,
		money: MONEY_INIT,
		pos: "t" + id,
		last: null,
		stop: false,
		ip: "192.168." + id + ".1",
		opticalFiber: 0
	}
}

module.exports = Player;
