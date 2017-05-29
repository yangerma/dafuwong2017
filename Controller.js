/* 
 * This controller can only handle sequential event for every players turn.
 * I think at least there should be 1 more controller to handle realtime event (eg: buy items).
 */

var MAX_PLAYER = 5;

/* Define game state. */
var GAMEOVER = 0;
var START = 1;

function Controller() {
	this._state = START;
	this._nowPlaying = 0;
	this._turns = 0;
}
Controller.prototype = {
	nextPlayer : function() {
		this._nowPlaying = (this._nowPlaying + 1) % MAX_PLAYER;
		this._turns++;
	}
	start : function() {
		while (this._state != GMEOVER) {
			// wait player roll dice
			// update dice view (?)
			// move
			// handle event
			nextPlayer();
		}
	}
}

/*
 * mode1: 
 *	controller ---  model
 *		  	  |(bind when initialize controller)
 *			view
 *
 * mode2:
 *	controller --- model
 *	     |
 *	   view
 *
 * or????
 *
 */
