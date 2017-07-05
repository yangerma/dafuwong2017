const MONEY_INIT = 2000;
Player = function(id, name) {
	return {
		id: id,
		name: name,
		money: MONEY_INIT,
		pos: "t" + id,
		last: null, 
		items: [0, 0, 0],	//firewall, vpn, 不知道
		connect: false,
		ip: "192.168." + id + ".1",
	}
}

module.exports = Player;
