var socket = io();
function rollDiceEvent() {
	socket.emit("roll_dice");
}
