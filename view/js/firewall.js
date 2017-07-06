function showFirewall(){
	$("#firewallBox").show();
}

function closeFirewall() {

	var ans = [];
	$("#firewallBox input:checkbox:checked").each( function(){
	    ans.push( Number( $(this).val() ) );
	});
	socket.emit("firewall", ans);
	console.log(ans);

	$('#firewallBox').hide();
	showTurnOver();
}