/* Variables */
var wallColor = '#322B21';
var floorColor = '#F5E9D9'
var selectedColor = '#D8D5AE';
var arcNumberColor = '#A8A57E';
var numberColor = '#FFFFFF';
var clearColor = '#FFFFFF';
var compassColor = '#303030';

/* Defines */
var axis = {};
axis.north = 0;
axis.east = 1;
axis.south = 2;
axis.west = 3;

var smallRoom = {};
smallRoom.width = 150;
smallRoom.height = 80;

var mediumRoom = {};
mediumRoom.width = 200;
mediumRoom.height = 130;

var bigRoom = {};
bigRoom.width = 250;
bigRoom.height = 160;

var shortVerticalHall = {};
shortVerticalHall.width = 60;
shortVerticalHall.height = 160;

var longVerticalHall = {};
longVerticalHall.width = 60;
longVerticalHall.height = 250;

var shortHorizontalHall = {};
shortHorizontalHall.width = 160;
shortHorizontalHall.height = 60;

var longHorizontalHall = {};
longHorizontalHall.width = 250;
longHorizontalHall.height = 60;

/* Arrays */
var towers = [];
var rooms = [];

/* Classes */
function Door(_axis,_room,_locked,_exit) {
	this.axis = _axis;
	this.room = _room;
	this.width = 32;
	this.height = 6;
	this.locked = {};
	this.locked.is = _locked;
	this.locked.width = 16;
	this.locked.height = 12;
	this.exit = _exit;
};

function Neighbor(_object,_axis) {
	this.next = _object;
	this.axis = _axis;
};

function Room(_number,_up,_down, _size, _hall=false, _showable=true) {
	this.number = _number;
	this.width = _size.width;
	this.height = _size.height;
	this.selected = false;
	this.position = {};	
	this.doors = [];
	this.stairs = {};
	this.stairs.up = _up;
	this.stairs.down = _down;
	this.hall = _hall;
	this.showable = _showable;
	this.displayed = false;
	
	this.neighbors = [];
};

function Tower(_number, _up, _down, _showable) {
	this.number = _number;
	this.size = 54;
	this.selected = false;
	this.position = {};
	this.stairs = {};
	this.stairs.up = _up;
	this.stairs.down = _down;
	this.showable = _showable;

	this.neighbors = [];		
};

/* Functions */
function clearDisplayed() {
	rooms.forEach(function(entry){
		entry.displayed = false;
	});
};

function setNeighbors(_parent,_neighbor,_axis) {
	_axis_parent = ( _axis + 2 ) % 4;
	_parent.neighbors[ _parent.neighbors.length ] = new Neighbor(_neighbor,_axis);
	_neighbor.neighbors[ _neighbor.neighbors.length ] = new Neighbor(_parent,_axis_parent);
};

function printDoor(_door) {
	ctx.beginPath();
	ctx.fillStyle = wallColor;
	
	if (_door.axis === axis.south) {
		ctx.rect(
			_door.room.position.x + _door.room.width/2 - _door.width/2,
			_door.room.position.y + _door.room.height - _door.height/2,
			_door.width, 
			_door.height
		);
		ctx.closePath();
		ctx.fill();
		if (_door.locked.is) {
			ctx.drawImage(
				locked,
				_door.room.position.x + _door.room.width/2 - _door.locked.width/2,
				_door.room.position.y + _door.room.height - _door.locked.height/2
			);	
		}
		if (_door.exit) {
			ctx.drawImage(
				array_south,
				_door.room.position.x + _door.room.width/2 - 16,
				_door.room.position.y + _door.room.height + 10
			);
		}
	} else if (_door.axis === axis.north) {			
		ctx.rect(
			_door.room.position.x + _door.room.width/2 - _door.width/2,
			_door.room.position.y - _door.height/2,
			_door.width, 
			_door.height
		);
		ctx.closePath();
		ctx.fill();
		if (_door.locked.is) {
			ctx.drawImage(
				locked,
				_door.room.position.x + _door.room.width/2 - _door.locked.width/2,
				_door.room.position.y - _door.locked.height/2
			);	
		}
		if (_door.exit) {
			ctx.drawImage(
				array_north,
				_door.room.position.x + _door.room.width/2 - 16,
				_door.room.position.y - 42
			);
		}
	} else if (_door.axis === axis.east) {
		ctx.rect(
			_door.room.position.x + _door.room.width - _door.height/2,
			_door.room.position.y + _door.room.height/2 - _door.width/2,
			_door.height, 
			_door.width
		);
		ctx.closePath();
		ctx.fill();
		if (_door.locked.is) {
			ctx.drawImage(
				locked,
				_door.room.position.x + _door.room.width - _door.locked.height/2,
				_door.room.position.y + _door.room.height/2 - _door.locked.width/2 + 2
			);	
		}
		if (_door.exit) {
			ctx.drawImage(
				array_east,
				_door.room.position.x + _door.room.width + 14,
				_door.room.position.y + _door.room.height/2 - 16
			);
		}
	} else if (_door.axis === axis.west) {
		ctx.rect(
			_door.room.position.x - _door.height/2,
			_door.room.position.y + _door.room.height/2 - _door.width/2,
			_door.height, 
			_door.width
		);
		ctx.closePath();
		ctx.fill();
		if (_door.locked.is) {
			ctx.drawImage(
				locked,
				_door.room.position.x - _door.locked.height/2,
				_door.room.position.y + _door.room.height/2 - _door.locked.width/2 + 2
			);
		}
		if (_door.exit) {
			ctx.drawImage(
				array_west,
				_door.room.position.x - 42,
				_door.room.position.y + _door.room.height/2 - 16
			);
		}
	}
};

function printRoom(_room) {
	
	if (_room.displayed) return;
	
	/* Room displayed */			
	_room.displayed = true;
	
	_room.neighbors.forEach(function(entry) {
		if (entry.next instanceof Tower) {
			if (entry.axis === axis.north) {
				entry.next.position.x = _room.position.x + _room.width/2;
				entry.next.position.y = _room.position.y - entry.next.size + 5;
				printTower(entry.next);
			}
			if (entry.axis === axis.south) {
				entry.next.position.x = _room.position.x + _room.width/2;
				entry.next.position.y = _room.position.y + _room.height + entry.next.size - 3;
				printTower(entry.next);
			}
			if (entry.axis === axis.east) {
				entry.next.position.x = _room.position.x + _room.width + entry.next.size/2 + 22;
				entry.next.position.y = _room.position.y + _room.height/2;
				printTower(entry.next,true);
			}
			if (entry.axis === axis.west) {
				entry.next.position.x = _room.position.x - entry.next.size/2 - 22;
				entry.next.position.y = _room.position.y + _room.height/2;
				printTower(entry.next,true);
			}
		} else if (entry.next instanceof Room) {
			/* Room displayed */			
			entry.next.displayed = true;
			
			if (entry.axis === axis.north) {
				entry.next.position.x = _room.position.x + _room.width/2 - entry.next.width/2;
				entry.next.position.y = _room.position.y - entry.next.height + 2;
				printRoom(entry.next);
			}
			if (entry.axis === axis.south) {
				entry.next.position.x = _room.position.x + _room.width/2 - entry.next.width/2;
				entry.next.position.y = _room.position.y + _room.height - 2;
				printRoom(entry.next);
			}
			if (entry.axis === axis.east) {
				entry.next.position.x = _room.position.x + _room.width - 2;
				entry.next.position.y = _room.position.y + _room.height/2 - entry.next.height/2;
				printRoom(entry.next);
			}
			if (entry.axis === axis.west) {
				entry.next.position.x = _room.position.x - entry.next.width + 2;
				entry.next.position.y = _room.position.y + _room.height/2 - entry.next.height/2;
				printRoom(entry.next);
			}			
		}
	});

	// showable?????????
	
	// Wall
	ctx.beginPath();
	ctx.fillStyle = wallColor;
	ctx.rect(_room.position.x, _room.position.y, _room.width, _room.height);
	ctx.closePath();
	ctx.fill();

	// Floor
	ctx.beginPath();
	ctx.fillStyle = floorColor;
	ctx.rect(_room.position.x + 2, _room.position.y + 2, _room.width - 4, _room.height - 4);
	ctx.closePath();
	ctx.fill();
	
	// Selected
	if (_room.selected) {
		ctx.beginPath();
		ctx.fillStyle = selectedColor;
		ctx.rect(_room.position.x + 3, _room.position.y + 3, _room.width - 5, _room.height - 6);
		ctx.closePath();
		ctx.fill();
	}
	
	// Doors
	_room.doors.forEach(function(entry){
		printDoor(entry);
	});
	
	/* Stairs */
	if (_room.stairs.up) {
		if (_room.hall && (_room.height>_room.width)) {
			ctx.drawImage(stairs_up,_room.position.x+_room.width-46,_room.position.y+_room.height/2-50);
		} else if (_room.hall && (_room.width>_room.height)) {
			ctx.drawImage(stairs_up,_room.position.x+_room.width/2-50,_room.position.y+_room.height/2-16);
		} else if (!_room.hall) {
			ctx.drawImage(stairs_up,_room.position.x+14,_room.position.y+14);
		}
	}	
	if (_room.stairs.down) {
		if (_room.hall && (_room.height>_room.width)) {
			ctx.drawImage(stairs_down,_room.position.x+_room.width-46,_room.position.y+_room.height/2+18);
		} if (_room.hall && (_room.width>_room.height)) {
			ctx.drawImage(stairs_down,_room.position.x+_room.width/2+18,_room.position.y+_room.height/2-16);
		} else if (!_room.hall) {
			ctx.drawImage(stairs_down,_room.position.x+_room.width-46,_room.position.y+14);
		}
	}
	
	// Room Number Arc
	ctx.beginPath();
	ctx.arc(
		_room.position.x + _room.width/2,
		_room.position.y + _room.height/2,
		14,
		0,
		2*Math.PI
	);
	ctx.fillStyle = arcNumberColor;
	ctx.closePath();
	ctx.fill();
	
	// Room Number
	ctx.beginPath();
	ctx.font = "bold 20px Courier New";
	ctx.fillStyle = numberColor;
	ctx.textAlign = "center";
	ctx.closePath();
	ctx.fillText(
		_room.number,
		_room.position.x + _room.width/2,
		_room.position.y + _room.height/2+6
	);
};

function printTower(_tower, _vertical_layout=false) {
	
	// showable?????????
	
	// Wall
	ctx.beginPath();
	ctx.arc(_tower.position.x,_tower.position.y,_tower.size,0,2*Math.PI);
	ctx.fillStyle = wallColor;
	ctx.closePath();
	ctx.fill();
	
	// Floor
	ctx.beginPath();
	ctx.arc(_tower.position.x,_tower.position.y,_tower.size-2,0,2*Math.PI);
	ctx.fillStyle = floorColor;
	ctx.closePath();
	ctx.fill();
	
	// Selected 
	if (_tower.selected) {
		ctx.beginPath();
		ctx.arc(_tower.position.x,_tower.position.y,_tower.size-3,0,2*Math.PI);
		ctx.fillStyle = selectedColor;
		ctx.closePath();
		ctx.fill();
	}
	
	// Stairs
	if (_tower.stairs.up) {
		if (_vertical_layout) {
			ctx.drawImage(stairs_up,_tower.position.x-16,_tower.position.y-48);
		} else {
			ctx.drawImage(stairs_up,_tower.position.x-48,_tower.position.y-16);
		}
	}
	if (_tower.stairs.down) {
		if (_vertical_layout) {
			ctx.drawImage(stairs_down,_tower.position.x-16,_tower.position.y+16);
		} else {
			ctx.drawImage(stairs_down,_tower.position.x+16,_tower.position.y-16);
		}
	}
	
	// Tower Number Arc
	ctx.beginPath();
	ctx.arc(_tower.position.x,_tower.position.y,14,0,2*Math.PI);
	ctx.fillStyle = arcNumberColor;
	ctx.closePath();
	ctx.fill();
	
	// Tower Number
	ctx.beginPath();
	ctx.font = "bold 20px Courier New";
	ctx.fillStyle = numberColor;
	ctx.textAlign = "center";
	ctx.closePath();
	ctx.fillText(_tower.number,_tower.position.x,_tower.position.y+6);
};