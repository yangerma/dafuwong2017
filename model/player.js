const MONEY_INIT = 2000;
Player = function(id, name) {
	return {
		id: id,
		name: name,
		money: MONEY_INIT,
		pos: "t" + id,
		item: [0, 0, 0],	//firewall, vpn, 不知道
		connect: false
	}
}

module.exports = Player;
