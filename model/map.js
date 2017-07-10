var map = {
	switch: { id: 'switch', type: 'switch', next: ['s01', 's21', 's31'] },
	t0: { id: 't0', type: 'home', owner: 0, tolls: 250, next: ['c01', 's03'] },
	s01: { id: 's01', type: 'server', owner: null, level: 0, next: ['switch', 's02'] },
	s02: { id: 's02', type: 'chance', next: ['s01', 's03'] },
	s03: { id: 's03', type: 'server', owner: null, level: 0, next: ['s02', 't0'] },
	c01: { id: 'c01', type: 'server', owner: null, level: 0, next: ['c02'] },
	c02: { id: 'c02', type: 'server', owner: null, level: 0, next: ['c03'] },
	c03: { id: 'c03', type: 'dhcp', next: ['c04'] },
	c04: { id: 'c04', type: 'server', owner: null, level: 0, next: ['c05'] },
	c05: { id: 'c05', type: 'question', owner: null, level: 0, next: ['t1'] },
	t1: { id: 't1', type: 'home', owner: 1, tolls: 250, next: ['c11'] },
	c11: { id: 'c11', type: 'server', owner: null, level: 0, next: ['c12'] },
	c12: { id: 'c12', type: 'server', owner: null, level: 0, next: ['c13'] },
	c13: { id: 'c13', type: 'server', owner: null, level: 0, next: ['c14'] },
	c14: { id: 'c14', type: 'server', owner: null, level: 0, next: ['c15'] },
	c15: { id: 'c15', type: 'question', owner: null, level: 0, next: ['t2'] },
	t2: { id: 't2', type: 'home', owner: 2, tolls: 250, next: ['c21', 's23'] },
	s21: { id: 's21', type: 'server', owner: null, level: 0, next: ['switch', 's22'] },
	s22: { id: 's22', type: 'question', owner: null, level: 0, next: ['s21', 's23'] },
	s23: { id: 's23', type: 'server', owner: null, level: 0, next: ['s22', 't2'] },
	c21: { id: 'c21', type: 'server', owner: null, level: 0, next: ['c22'] },
	c22: { id: 'c22', type: 'server', owner: null, level: 0, next: ['c23'] },
	c23: { id: 'c23', type: 'chance', next: ['c24'] },
	c24: { id: 'c24', type: 'server', owner: null, level: 0, next: ['c25'] },
	c25: { id: 'c25', type: 'question', owner: null, level: 0, next: ['t3'] },
	t3: { id: 't3', type: 'home', owner: 3, tolls: 250, next: ['c31', 's33'] },
	s31: { id: 's31', type: 'server', owner: null, level: 0, next: ['switch', 's32'] },
	s32: { id: 's32', type: 'question', owner: null, level: 0, next: ['s31', 's33'] },
	s33: { id: 's33', type: 'server', owner: null, level: 0, next: ['s32', 't3'] },
	c31: { id: 'c31', type: 'server', owner: null, level: 0, next: ['c32'] },
	c32: { id: 'c32', type: 'server', owner: null, level: 0, next: ['c33'] },
	c33: { id: 'c33', type: 'dhcp', next: ['c34'] },
	c34: { id: 'c34', type: 'server', owner: null, level: 0, next: ['c35'] },
	c35: { id: 'c35', type: 'question', owner: null, level: 0, next: ['t4'] },
	t4: { id: 't4', type: 'home', owner: 4, tolls: 250, next: ['c41'] },
	c41: { id: 'c41', type: 'server', owner: null, level: 0, next: ['c42'] },
	c42: { id: 'c42', type: 'server', owner: null, level: 0, next: ['c43'] },
	c43: { id: 'c43', type: 'server', owner: null, level: 0, next: ['c44'] },
	c44: { id: 'c44', type: 'server', owner: null, level: 0, next: ['c45'] },
	c45: { id: 'c45', type: 'question', owner: null, level: 0, next: ['t0'] }
}
for( id in map){
	var node = map[id];
	if(node.type=="server"){
		node.price=[500,1000,3000];
		node.tolls=[0,750,2250,9000];
		node.level=0;
	}
	if(node.type=="home"){
		node.tolls=[1000];
		node.level=0;
	}
	node.firewall=[false, false, false, false, false];
}
module.exports = map;
