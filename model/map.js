const OUT = 0;
const IN = 1;
const LEFT = 0;
const RIGHT = 1;
var map = {
	switch: { id: 'switch', type: 'switch', next: ['s01', 's21', 's31'] },
	t0: { id: 't0', type: 'home', next: ['c01', 's03']},
	s01: { id: 's01', type: 'nothing', next: ['switch', 's02'] },
	s02: { id: 's02', type: 'nothing', next: ['s01', 's03'] },
	s03: { id: 's03', type: 'nothing', next: ['s02', 't0'] },
	c01: { id: 'c01', type: 'nothing', next: ['c02'] },
	c02: { id: 'c02', type: 'nothing', next: ['c03'] },
	c03: { id: 'c03', type: 'dhcp', next: ['c04'] },
	c04: { id: 'c04', type: 'nothing', next: ['c05'] },
	c05: { id: 'c05', type: 'nothing', next: ['t1'] },
	t1: { id: 't1', type: 'home', next: ['c11'] },
	c11: { id: 'c11', type: 'nothing', next: ['c12'] },
	c12: { id: 'c12', type: 'nothing', next: ['c13'] },
	c13: { id: 'c13', type: 'nothing', next: ['c14'] },
	c14: { id: 'c14', type: 'nothing', next: ['c15'] },
	c15: { id: 'c15', type: 'nothing', next: ['t2'] },
	t2: { id: 't2', type: 'home', next: ['c21', 's23']},
	s21: { id: 's21', type: 'nothing', next: ['switch', 's22'] },
	s22: { id: 's22', type: 'nothing', next: ['s21', 's23'] },
	s23: { id: 's23', type: 'nothing', next: ['s22', 't2'] },
	c21: { id: 'c21', type: 'nothing', next: ['c22'] },
	c22: { id: 'c22', type: 'nothing', next: ['c23'] },
	c23: { id: 'c23', type: 'nothing', next: ['c24'] },
	c24: { id: 'c24', type: 'nothing', next: ['c25'] },
	c25: { id: 'c25', type: 'nothing', next: ['t3'] },
	t3: { id: 't3', type: 'home', next: ['c31', 's33']},
	s31: { id: 's31', type: 'nothing', next: ['switch', 's32'] },
	s32: { id: 's32', type: 'nothing', next: ['s31', 's33'] },
	s33: { id: 's33', type: 'nothing', next: ['s32', 't3'] },
	c31: { id: 'c31', type: 'nothing', next: ['c32'] },
	c32: { id: 'c32', type: 'nothing', next: ['c33'] },
	c33: { id: 'c33', type: 'dhcp', next: ['c34'] },
	c34: { id: 'c34', type: 'nothing', next: ['c35'] },
	c35: { id: 'c35', type: 'nothing', next: ['t4'] },
	t4: { id: 't4', type: 'home', next: ['c41'] },
	c41: { id: 'c41', type: 'nothing', next: ['c42'] },
	c42: { id: 'c42', type: 'nothing', next: ['c43'] },
	c43: { id: 'c43', type: 'nothing', next: ['c44'] },
	c44: { id: 'c44', type: 'nothing', next: ['c45'] },
	c45: { id: 'c45', type: 'nothing', next: ['t0'] }
}
module.exports = map;
