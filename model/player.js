const MONEY_INIT = 2000;
Player = function(id, name) {
	return {
		id: id,
		name: name,
		money: MONEY_INIT,
		pos: "t" + id,
		last: null, 
		item: [0, 0, 0],
		connect: false
	}
}

module.exports = Player;
