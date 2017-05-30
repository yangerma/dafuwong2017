//For houses or firewalls.
function Pair(first, second) {
	this.F = first;
	this.S = second;
}

function Node(id, property, position, nextA, nextB) {
	this.id = id;	//its id in css
	this.property = property;
	/*
	* 'sw' for switch
	* 'dh' for dhcp
	* 'hm' for home
	* 'pb' for problem
	* 'cf' for chance/fate
	* 'no' for nothing
	*/
	this.house = new Pair(-1, -1);
	this.position = position;	//(left, top) pair
	
	this.next = new Array(nextA, nextB);	//id of two possible next Nodes
}

const var money_init = 9487;
function Player(id, name) {
	this.id = id;	//0-indexed
	this.ip = '192.168.'+(id+1)+'.1';
	this.name = name;
	this.pos = 't'+i;
	this.money = money_init;
	this.toolcount = new Array(0, 0, 0);	//for each tool, count how many does he have
}

//map initialization

var firewall = new Array();
var player = new Array();

for(var i = 0; i < 5; i++) {
	player.push(new Player(i, "Meow"));
}

var map = new Map();
map.set('switch', new Node('switch', 'sw', 's31', 's31'));
for (var i = 0; i < 5; i++) {

	if(i==0 || i==2) {
		map.set('t'+i, new Node('t'+i, 'hm', 'c'+i+'1', 's'+i+'3'));
	} else {
		map.set('t'+i, new Node('t'+i, 'hm', 'c'+i+'1', 'c'+i+'1'));
	}

	if( i==0 || i==2 ) {
		for (var j = 1; j < 4; j++) {
				var nxt = (j==1) ? 'switch' : 's'+i+''+(j-1);			
				map.set('s'+i+''+j, new Node('s'+i+''+j, 'no', nxt, nxt));

			}
		}
	}
	if( i==3 ) {
		for (var j = 1; j < 4; j++) {
				var nxt = (j==3) ? 't'+i : 's'+i+''+(j+1);
				map.set('s'+i+''+j, new Node('s'+i+''+j, 'no', nxt, nxt));
			}
		}
	}

	for (var j = 1; j < 6; j++) {
		if(j==5) {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'no', 't'+((i+1)%5), 't'+((i+1)%5)));
		} else if( (i==0 || i==3) && j==3) {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'dh', 'c'+i+'4', 'c'+i+'4'));
		} else {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'no', 'c'+i+''+(j+1), 'c'+i+''+(j+1));
		}
    }	

}
