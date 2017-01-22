/* Variables */
var wallColor = '#322B21';
var unknownColor = '#D5C9A9';
var floorColor = '#F5E9D9'
var selectedColor = '#D8D5AE';
var arcNumberColor = '#A8A57E';
var numberColor = '#FFFFFF';
var clearColor = '#FFFFFF';
var compassColor = '#303030';

/* Defines */
var unknownAlpha = 0.6;

var axis = {};
axis.north = 0;
axis.east = 1;
axis.south = 2;
axis.west = 3;

var smallSquare = {
	width: 150,
	height: 110,
	hall: false
	
};

var smallRoom = {
	width: 150,
	height: 80,
	hall: false
	
};
	
var mediumRoom = {
	width: 200,
	height: 130,
	hall: false
};
	
var bigRoom = {
	width: 250,
	height: 160,
	hall: false
};
	
var shortVerticalHall = {
	width: 60,
	height: 160,
	hall: true
};

var longVerticalHall = {
	width: 60,
	height: 250,
	hall: true
};

var shortHorizontalHall = {
	width: 160,
	height: 60,
	hall: true
};

var mediumHorizontalHall = {
	width: 200,
	height: 60,
	hall: true
};

var longHorizontalHall = {
	width: 250,
	height: 60,
	hall: true
};

var Alignment = {
	top: 0,
	right: 1,
	bottom: 2,
	left: 3,
	center: 4
};
	
/* Arrays */
var places = [];

/* Libraries */
function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
};

/* Classes */
function Door(_place, _locked, _exit) {
	this.place = _place;
	this.width = 32;
	this.height = 6;
	this.locked = {
		is: _locked,
		width: 16,
		height: 12
	};
	this.exit = _exit;
};

Door.prototype = {
	
	drawNorth: function() {		
		if (this.place instanceof Room) {
			ctx.rect(
				this.place.position.x + this.place.size.width/2 - this.width/2,
				this.place.position.y - this.height/2 + 1,
				this.width,
				this.height
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x + this.place.size.width/2 - this.locked.width/2,
					this.place.position.y - this.locked.height/2
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_north,
					this.place.position.x + this.place.size.width/2 - 16,
					this.place.position.y - 42
				);
			}
		}
		if (this.place instanceof Tower) {
			ctx.rect(
				this.place.position.x - this.width/2,
				this.place.position.y - this.height/2 - this.place.size + 3,
				this.width,
				this.height
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x - this.locked.width/2,
					this.place.position.y - this.locked.height/2 - this.place.size + 2
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_north,
					this.place.position.x - 16,
					this.place.position.y - 42 - this.place.size + 2
				);
			}
		}
	},
	drawEast: function() {
		if (this.place instanceof Room) {			
			ctx.rect(
				this.place.position.x + this.place.size.width - this.height/2 - 1,
				this.place.position.y + this.place.size.height/2 - this.width/2,
				this.height, 
				this.width
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x + this.place.size.width - this.locked.height/2 - 2,
					this.place.position.y + this.place.size.height/2 - this.locked.width/2 + 2
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_east,
					this.place.position.x + this.place.size.width + 14,
					this.place.position.y + this.place.size.height/2 - 16
				);
			}
		}
		if (this.place instanceof Tower) {			
			ctx.rect(
				this.place.position.x + this.place.size - this.height/2 - 3,
				this.place.position.y - this.width/2,
				this.height, 
				this.width
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x + this.place.size - this.locked.height/2 - 4,
					this.place.position.y - this.locked.width/2 + 2
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_east,
					this.place.position.x + this.place.size + 14,
					this.place.position.y - 16
				);
			}
		}
	},
	drawSouth: function() {
		if (this.place instanceof Room) {			
			ctx.rect(
				this.place.position.x + this.place.size.width/2 - this.width/2,
				this.place.position.y + this.place.size.height - this.height/2 - 1,
				this.width, 
				this.height
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x + this.place.size.width/2 - this.locked.width/2,
					this.place.position.y + this.place.size.height - this.locked.height/2 - 1
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_south,
					this.place.position.x + this.place.size.width/2 - 16,
					this.place.position.y + this.place.size.height + 10
				);
			}
		}
		if (this.place instanceof Tower) {			
			ctx.rect(
				this.place.position.x - this.width/2,
				this.place.position.y + this.place.size - this.height/2 - 3,
				this.width, 
				this.height
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x - this.locked.width/2,
					this.place.position.y + this.place.size - this.locked.height/2 - 3
				);	
			}
			if (this.exit) {
				ctx.drawImage(
					array_south,
					this.place.position.x - 16,
					this.place.position.y + this.place.size + 10
				);
			}
		}
	},
	drawWest: function() {
		if (this.place instanceof Room) {
			ctx.rect(
				this.place.position.x - this.height/2 + 1,
				this.place.position.y + this.place.size.height/2 - this.width/2,
				this.height, 
				this.width
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x - this.locked.height/2,
					this.place.position.y + this.place.size.height/2 - this.locked.width/2 + 2
				);
			}
			if (this.exit) {
				ctx.drawImage(
					array_west,
					this.place.position.x - 42,
					this.place.position.y + this.place.size.height/2 - 16
				);
			}
		}
		if (this.place instanceof Tower) {
			ctx.rect(
				this.place.position.x - this.place.size - this.height/2 + 3,
				this.place.position.y - this.width/2,
				this.height, 
				this.width
			);
			ctx.closePath();
			ctx.fill();
			if (this.locked.is) {
				ctx.drawImage(
					locked,
					this.place.position.x - this.place.size - this.locked.height/2,
					this.place.position.y - this.locked.width/2 + 2
				);
			}
			if (this.exit) {
				ctx.drawImage(
					array_west,
					this.place.position.x - this.place.size - 42,
					this.place.position.y - 16
				);
			}
		}
	},
	
	draw: function (_axis) {
		
		ctx.beginPath();
		ctx.fillStyle = wallColor;
		
		if (_axis === axis.north) {
			this.drawNorth();
		} else if (_axis === axis.east) {			
			this.drawEast();
		} else if (_axis === axis.south) {
			this.drawSouth();
		} else if (_axis === axis.west) {
			this.drawWest();
		}		
	}
	
};

var timesDrawed = {
	none: 0,
	once: 1,
	twice: 2,
	three: 3,
	four: 4
};

function Drawed() {
	this.was = timesDrawed.none;
};

Drawed.prototype = {
	clear: function() {
		this.was = timesDrawed.none;
	}
};

function Neighbor(_drawed, _parent, _next, _axis, _locked=false, _exit=false) {
	this.parent = _parent;
	this.next = _next;
	this.axis = _axis;
	this.door = new Door(_parent, _locked, _exit);
	this.drawed = _drawed;
};

Neighbor.prototype = {
	drawNeighbor: function() {		
		this.drawed.was = this.drawed.was + 1;
		if (this.drawed.was === timesDrawed.once) {			
			if (!this.next.invisible) {	
				this.parent.setPositionWith(this);	
				this.next.draw(this.axis);
			}
		}
	},
	drawDoor: function() {		
		this.drawed.was = this.drawed.was + 1;
		if ( (this.drawed.was === timesDrawed.four) || (this.drawed.was === timesDrawed.twice)) {
			if (!this.next.invisible) {	
				this.door.draw(this.axis);
			}
		}		
	}
};

function Entrance(_drawed, _parent, _axis, _locked=false) {
	// Call the parent's constructor
	Neighbor.call(this,_drawed, _parent, new NullablePlace(), _axis, _locked, true);	
};

function Place(_number,_up,_down, _size, _invisible=false, _unknown=false) {
	this.number = _number;
	this.size = _size;
	this.stairs = {
		up: _up,
		down: _down
	};	
	this.invisible = _invisible;
	this.unknown = _unknown;
	
	this.position = {};
	this.selected = false;	
	this.neighbors = [];
};

Place.prototype = {

	calcParentNeighbor: function (_axis) {
		return ( _axis + 2 ) % 4;
	},
		
	addNeighbor: function (_neighbor, _axis, _locked=false, _exit=false) {
		var drawed = new Drawed();
		var axis_parent = this.calcParentNeighbor(_axis);
		this.neighbors.push( new Neighbor(drawed, this, _neighbor, _axis, _locked, _exit, this.invisible) );
		_neighbor.neighbors.push( new Neighbor(drawed, _neighbor, this, axis_parent, _locked, false, this.invisible) );
	},
	
	addEntrance: function (_axis, _locked=false) {			
		var drawed = new Drawed();					
		this.neighbors.push( new Entrance(drawed, this, _axis, _locked) );
	},
	
	draw: function() {
		// Abstract
	},
	
	setPositionWith: function(_neighbor) {
		if (_neighbor.axis === axis.north) {
			this.setNorth(_neighbor);
		}
		if (_neighbor.axis === axis.east) {
			this.setEast(_neighbor);
		}
		if (_neighbor.axis === axis.south) {
			this.setSouth(_neighbor);
		}		
		if (_neighbor.axis === axis.west) {
			this.setWest(_neighbor);
		}
	},
	
	setNorth: function(_neighbor) {
		// Abstract
	},
	setEast: function(_neighbor) {
		// Abstract
	},
	setSouth: function(_neighbor) {
		// Abstract
	},
	setWest: function(_neighbor) {
		// Abstract
	}
	
};

function NullablePlace() {
	// Call the parent's constructor
	Place.call(this, 0,false,false, smallRoom, false, false);
};

NullablePlace.prototype = {
	addNeighbor: function (_neighbor, _axis, _locked=false, _exit=false) {
		// Nullable method
	},
	setPositionWith: function(_neighbor) {
		// Nullable method
	}
};

function Room(_number,_up,_down, _size, _invisible=false, _unknown=false, _alignment=Alignment.center) {
	// Call the parent's constructor
	Place.call(this, _number,_up,_down, _size, _invisible, _unknown);
	this.hall = _size.hall;
	this.alignment = _alignment;

	if (DEBUG) {
		console.log(this);
	}
};

Room.prototype = {
	draw: function() {
	
		// Draw neighbors
		for(var i=0;i<this.neighbors.length;i++) {
			this.neighbors[i].drawNeighbor();
		}
	
		if (!this.unknown) {
			// Wall
			ctx.beginPath();		
			ctx.fillStyle = wallColor;			
			ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
			ctx.closePath();
			ctx.fill();
			
			// Floor
			ctx.beginPath();
			ctx.fillStyle = floorColor;
			ctx.rect(this.position.x + 2, this.position.y + 2, this.size.width - 4, this.size.height - 4);
			ctx.closePath();
			ctx.fill();			
		} else {
			// Unknown
			ctx.beginPath();
			ctx.fillStyle = unknownColor;
			ctx.globalAlpha = unknownAlpha;
			ctx.rect(this.position.x + 2, this.position.y + 2, this.size.width - 4, this.size.height - 4);
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1;			
		}
		
		// Selected
		if (this.selected) {
			ctx.beginPath();
			ctx.fillStyle = selectedColor;
			ctx.rect(this.position.x + 3, this.position.y + 3, this.size.width - 5, this.size.height - 6);
			ctx.closePath();
			ctx.fill();
		}				
		
		// Draw doors
		for(var i=0;i<this.neighbors.length;i++) {
			this.neighbors[i].drawDoor();
		}
		
		if (!this.unknown) {
			
			/* Stairs */
			if (this.stairs.up) {
				if (this.hall && (this.size.height>this.size.width)) {
					ctx.drawImage(stairs_up,this.position.x+this.size.width-46,this.position.y+this.size.height/2-50);
				} else if (this.hall && (this.size.width>this.size.height)) {
					ctx.drawImage(stairs_up,this.position.x+this.size.width/2-50,this.position.y+this.size.height/2-16);
				} else if (!this.hall) {
					ctx.drawImage(stairs_up,this.position.x+14,this.position.y+14);
				}
			}	
			if (this.stairs.down) {
				if (this.hall && (this.size.height>this.size.width)) {
					ctx.drawImage(stairs_down,this.position.x+this.size.width-46,this.position.y+this.size.height/2+18);
				} if (this.hall && (this.size.width>this.size.height)) {
					ctx.drawImage(stairs_down,this.position.x+this.size.width/2+18,this.position.y+this.size.height/2-16);
				} else if (!this.hall) {
					ctx.drawImage(stairs_down,this.position.x+this.size.width-46,this.position.y+14);
				}
			}
			
			// Room Number Arc
			ctx.beginPath();
			ctx.arc(
				this.position.x + this.size.width/2,
				this.position.y + this.size.height/2,
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
				this.number,
				this.position.x + this.size.width/2,
				this.position.y + this.size.height/2+6
			);
			
		} // unknown
		
	},
    setNorth: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {
			_neighbor.next.position.x = this.position.x + this.size.width/2;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size + 5;
		} else if (_neighbor.next instanceof Room) {
			_neighbor.next.position.x = this.position.x + this.size.width/2 - _neighbor.next.size.width/2;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size.height + 2;
		}
	},
	setEast: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {						
			if (_neighbor.axis === axis.east) {
				_neighbor.next.position.x = this.position.x + this.size.width + _neighbor.next.size/2 + 27;
				_neighbor.next.position.y = this.position.y + this.size.height/2;				
			}			
		} else if (_neighbor.next instanceof Room) {			
			if (_neighbor.axis === axis.east) {
				_neighbor.next.position.x = this.position.x + this.size.width - 2;
				_neighbor.next.position.y = this.position.y + this.size.height/2 - _neighbor.next.size.height/2;				
			}			
		}
	},
	setSouth: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {			
			if (_neighbor.axis === axis.south) {
				_neighbor.next.position.x = this.position.x + this.size.width/2;
				_neighbor.next.position.y = this.position.y + this.size.height + _neighbor.next.size - 3;				
			}			
		} else if (_neighbor.next instanceof Room) {
			if (_neighbor.axis === axis.south) {
				_neighbor.next.position.x = this.position.x + this.size.width/2 - _neighbor.next.size.width/2;
				_neighbor.next.position.y = this.position.y + this.size.height - 2;				
			}			
		}
	},
	setWest: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {						
			if (_neighbor.axis === axis.west) {
				_neighbor.next.position.x = this.position.x - _neighbor.next.size/2 - 27;
				_neighbor.next.position.y = this.position.y + this.size.height/2;				
			}
		} else if (_neighbor.next instanceof Room) {			
			if (_neighbor.axis === axis.west) {
				_neighbor.next.position.x = this.position.x - _neighbor.next.size.width + 2;
				if (_neighbor.next.alignment === Alignment.center) {									
					_neighbor.next.position.y = this.position.y + this.size.height/2 - _neighbor.next.size.height/2;
				} else if (_neighbor.next.alignment === Alignment.top) {					
					_neighbor.next.position.y = this.position.y + this.size.height - _neighbor.next.size.height;
				}								
			}
		}
	}
};

function Tower(_number,_up,_down, _invisible=false, _unknown=false) {
	// Call the parent's constructor
	Place.call(this, _number,_up,_down, 64, _invisible, _unknown);
	
	if (DEBUG) {
		console.log(this);
	}
};

Tower.prototype = {
	draw: function() {
	
		// Draw neighbors
		for(var i=0;i<this.neighbors.length;i++) {
			this.neighbors[i].drawNeighbor();
		}
	
		if (!this.unknown) {
			// Wall
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.size,0,2*Math.PI);
			ctx.fillStyle = wallColor;
			ctx.closePath();
			ctx.fill();
			
			// Floor
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.size-2,0,2*Math.PI);
			ctx.fillStyle = floorColor;
			ctx.closePath();
			ctx.fill();
		} else {
			// Unknown
			ctx.beginPath();
			ctx.fillStyle = unknownColor;
			ctx.globalAlpha = unknownAlpha;			
			ctx.arc(this.position.x,this.position.y,this.size-2,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();			
			ctx.globalAlpha = 1;
		}		
		
		// Selected 
		if (this.selected) {
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.size-3,0,2*Math.PI);
			ctx.fillStyle = selectedColor;
			ctx.closePath();
			ctx.fill();
		}
		
		// Draw doors
		for(var i=0;i<this.neighbors.length;i++) {
			this.neighbors[i].drawDoor();
		}
		
		if (!this.unknown) {
			
			// Stairs
			if (this.stairs.up) {
				ctx.drawImage(stairs_up,this.position.x-48,this.position.y-16);
			}
			if (this.stairs.down) {
				ctx.drawImage(stairs_down,this.position.x+16,this.position.y-16);
			}
			
			// Tower Number Arc
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,14,0,2*Math.PI);
			ctx.fillStyle = arcNumberColor;
			ctx.closePath();
			ctx.fill();
			
			// Tower Number
			ctx.beginPath();
			ctx.font = "bold 20px Courier New";
			ctx.fillStyle = numberColor;
			ctx.textAlign = "center";
			ctx.closePath();
			ctx.fillText(this.number,this.position.x,this.position.y+6);
			
		} // unknown
		
	},
	setNorth: function(_neighbor) {		
		if (_neighbor.next instanceof Tower) {			
			_neighbor.next.position.x = this.position.x;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size*2 + 6;
		} else if (_neighbor.next instanceof Room) {
			_neighbor.next.position.x = this.position.x - _neighbor.next.size.width/2;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size.height - this.size + 4;
		}
	},
	setEast: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {						
			_neighbor.next.position.x = this.position.x + this.size*2 - 6;
			_neighbor.next.position.y = this.position.y;
		} else if (_neighbor.next instanceof Room) {			
			_neighbor.next.position.x = this.position.x + this.size - 3;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size.height/2;		
		}
	},
	setSouth: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {			
			_neighbor.next.position.x = this.position.x;
			_neighbor.next.position.y = this.position.y + this.size*2 - 5;
		} else if (_neighbor.next instanceof Room) {
			_neighbor.next.position.x = this.position.x - _neighbor.next.size.width/2;
			_neighbor.next.position.y = this.position.y + this.size - 4;						
		}
	},
	setWest: function(_neighbor) {
		if (_neighbor.next instanceof Tower) {						
			_neighbor.next.position.x = this.position.x - _neighbor.next.size*2 + 5;
			_neighbor.next.position.y = this.position.y;
		} else if (_neighbor.next instanceof Room) {			
			_neighbor.next.position.x = this.position.x - _neighbor.next.size.width - this.size + 4;
			_neighbor.next.position.y = this.position.y - _neighbor.next.size.height/2;								
		}
	}
	
};

// Setup the prototype chain the right way
extend(Place, Room);
extend(Place, NullablePlace);
extend(Place, Tower);
extend(Neighbor,Entrance);