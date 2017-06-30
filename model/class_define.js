function Node(id, type, next) {
	this.id = id;	//its id in css
	this.type = type;
	this.next = next	//id of two possible next Nodes
}

const money_init = 9487;
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
var rank = new Array(0, 1, 2, 3, 4);

for(var i = 0; i < 5; i++) {
	player.push(new Player(i, "Meow"));
}

var map = new Map();
map.set('switch', new Node('switch', 'switch', 's31', 's31'));
for (var i = 0; i < 5; i++) {

	if(i==0 || i==2) {
		map.set('t'+i, new Node('t'+i, 'home', 'c'+i+'1', 's'+i+'3'));
	} else {
		map.set('t'+i, new Node('t'+i, 'home', 'c'+i+'1', 'c'+i+'1'));
	}

	if( i==0 || i==2 ) {
		for (var j = 1; j < 4; j++) {
			var nxt = (j==1) ? 'switch' : 's'+i+''+(j-1);			
			map.set('s'+i+''+j, new Node('s'+i+''+j, 'nothing', nxt, nxt));
		}
	}
	if( i==3 ) {
		for (var j = 1; j < 4; j++) {
			var nxt = (j==3) ? 't'+i : 's'+i+''+(j+1);
			map.set('s'+i+''+j, new Node('s'+i+''+j, 'nothing', nxt, nxt));
		}
	}
	

	for (var j = 1; j < 6; j++) {
		if(j==5) {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'nothing', 't'+((i+1)%5), 't'+((i+1)%5)));
		} else if( (i==0 || i==3) && j==3) {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'dhcp', 'c'+i+'4', 'c'+i+'4'));
		} else {
			map.set('c'+i+''+j, new Node('c'+i+''+j, 'nothing', 'c'+i+''+(j+1), 'c'+i+''+(j+1)));
		}
    }	

}
console.log(map);
