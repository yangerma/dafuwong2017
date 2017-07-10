$("#cpy_map div").on("mouseover", function() {
    var nodeID = $( this ).prop('id');
    nodeID = nodeID.substr(4);
    showNodeProperty( nodeID );
}).on("mouseout", function() {
    $('#nodeProperty').hide();
});

function showNodeProperty( nodeID ) {

	// set content
	var node = model.map[nodeID];
	var title, owner, level, price, des;
	var house = false;
	switch( node.type ) {
		case ("server"):
			owner = node.owner;
			if( owner == null ) {
				title = "一塊無主的地";
				price = node.price[node.level];
				des = "幸運的話，你可能可以花 ฿" + price +" 把這塊地買下來喔";
			}
			else {
				house = true;
				title = "一塊被佔據的地";
				level = node.level;
				price = node.price[node.level];
				tolls = node.tolls[node.level];
			}
		break;
		case ("home"):
			owner = node.owner;
			title = "這裡是"+ model.players[owner].name +"溫暖的家";
			price = node.tolls;
			des = "踩到人家家裡，要付 ฿" + price +" 的過路費喔";
		break;
		case ("chance"):
			title = "機會?命運!";
			des = "在這裡可能會有意想不到的事情發生！";
		break;
		case ("dhcp"):
			title = "DHCP";
			des = "DHCP server 會發給你一個暫時性的ip!";
		break;
		case ("question"):
			title = "問題來了！";
			des = "準備接招吧小朋友";
		break;
		case ("switch"):
			title = "Switch"
			des	= "switch作為網路交通的樞紐，可以讓你指定要去哪裡！"
		break;
		default:
			console.log(node.type + "是三小鬼東西?!!!");
		break;
	}

	$('#nodeProperty #nodeType').text(title);
	if( house == true ) {
		$('#nodeProperty #houseInfo').show();
		$('#nodeProperty #otherInfo').hide();
		$('#nodeProperty #nodeOwner strong').text(model.players[owner].name);
		$('#nodeProperty #nodeLevel strong').text(level);
		$('#nodeProperty #nodePrice strong').text(price);
		$('#nodeProperty #nodeTolls strong').text(tolls);
	}
	else {
		$('#nodeProperty #houseInfo').hide();
		$('#nodeProperty #otherInfo').show();
		$('#nodeProperty #otherInfo p').text(des);
	}
	var firewallList = "";
	
	node.firewall.forEach((v,id) => {
		if (v) {
			firewallList += '192.168.' + id + '.0/255.255.255.0\n';
		}
	});
	if (firewallList.length > 0) {
		$('#nodeProperty #firewallInfo p').text('防火牆：\n' + firewallList);
	}

	// move the block
	var x = $('#' + nodeID).offset().left - 50;
	var y = $('#' + nodeID).offset().top -  50;
	$("#nodeProperty").css('top', y);
	$("#nodeProperty").css('left', x);

	// hover to show / hide
	$('#nodeProperty').show();

}
