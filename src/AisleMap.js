var AisleMap = function(options) {
  var options = options || {};
  var numAisles = options.numAisles || 10;
	this.numAisles = numAisles;
	this.numAislesWithItems = 0;
  //test data
	this.items = [
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
		{x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))},
	];
	this.grid = [];
	this.path = [];
	this.aislesWithItems = [];
	this.currentAisle = 0;
	this.currentPosition = 0;
	this.nextAisle = 0;
	this.nextItem = 0;
	this.direction;
	this.aisleLength = options.aisleLength || 10;
}

AisleMap.prototype.constructGrid = function() {
	for (var i = 0; i < this.numAisles; i++) {
	//array initializer makes array one size smaller than parameter
		this.grid.push(new Array(this.aisleLength+1)
		//fun way to initialize array values
			.join('0').split('').map(function(e) {return parseInt(e, 10);})
		);
	}
}

AisleMap.prototype.placeItems = function() {
	for (var i = 0; i < this.items.length; i++) {
		this.grid[this.items[i].x][this.items[i].y] = 1;
	}
}

AisleMap.prototype.findAislesWithItems = function() {
	var aislesWithItems = new Array(this.numAisles)
		.join('0').split('').map(function(e) {return parseInt(e, 10);});

	for (var i = 0; i < this.items.length; i++) {
		if (!aislesWithItems[this.items[i].x]) {
			this.numAislesWithItems++;
			aislesWithItems[this.items[i].x] = 1;
		}
	}

	this.aislesWithItems = aislesWithItems;
}

//checks if the aisle has more items
AisleMap.prototype.checkAisle = function(direction) {
	var currentAisle = this.currentAisle;
	var currentPosition = this.currentPosition;
	while (currentPosition < this.aisleLength && currentPosition >= 0) {
		if (this.direction === 1) {
			currentPosition++;
		}
		else {
			currentPosition--;
		}
		if (this.grid[currentAisle][currentPosition]) {
			return true;
		}
	}	
	return false;
}

AisleMap.prototype.moveToItem = function(direction) {
	while (this.currentPosition < this.aisleLength && this.currentPosition >= 0) {
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		if (this.direction === 1) {
			this.currentPosition++;
		}
		else {
			this.currentPosition--;
		}
		if (this.grid[this.currentAisle][this.currentPosition]) {
			break;
		}
	}
}

//path to end of aisle
AisleMap.prototype.moveToEnd = function(direction) {
	//if last aisle, head back to entrance
	if (this.currentAisle === this.nextAisle) {
		this.direction = -1;
	}
	if (this.direction === 1) {
		this.currentPosition++;
		for (var i = this.currentPosition; i < this.aisleLength; i++) {
			this.path.push({x: this.currentAisle, y:i});
		}
		this.currentPosition = this.aisleLength - 1;
		//simulates walking out into the walkway
		this.path.push({x: this.currentAisle, y: this.currentPosition+1});
		for (var i = 0; i < this.nextAisle - this.currentAisle; i++) {
			this.path.push({x: this.currentAisle+i+1, y: this.currentPosition+1});
		}
	}
	else if (this.direction === -1) {
		this.currentPosition--;
		for (var i = this.currentPosition; i >= 0; i--) {
			this.path.push({x: this.currentAisle, y:i});
			console.log("in move to end, current position is:", i);
		}
		this.currentPosition = 0;
		//simulates walking out into the walkway
		this.path.push({x: this.currentAisle, y: this.currentPosition-1});
		for (var i = 0; i < this.nextAisle - this.currentAisle; i++) {
			this.path.push({x: this.currentAisle+i+1, y: this.currentPosition-1});
		}

	}
}

AisleMap.prototype.chooseNextAisle = function() {
	for (var i = this.currentAisle+1; i < this.aislesWithItems.length; i++) {
		if (this.aislesWithItems[i]) {
			console.log("selected next aisle: ", i);
			this.nextAisle = i;
			return i;
		}
	}
}

AisleMap.prototype.chooseDirection = function(direction) {
	//if no more aisles to visit, just keep going in the same direction
	if (this.currentAisle === this.nextAisle) {
		return;
	}

	//correponds to direction, 1 is top half of aisle, -1 is bottom half of aisle
	var side;
	var hasItem = false;
	//figure out what side the current position is on
	console.log("before check, currentPosition is:", this.currentPosition);
	if (this.currentPosition < (this.aisleLength-1)/2) {
		side = -1;
	}
	else if (this.currentPosition > (this.aisleLength-1)/2) {
		side = 1;
	}
	else {
		side = this.direction;
	}
	//check if there are any items on that side
	if (side === 1) {
		for (var i = this.aisleLength-1; i > (this.aisleLength-1)/2; i--) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
		}
	}
	else if (side === -1) {
		for (var i = 0; i < (this.aisleLength-1)/2; i++) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
		}
	}
	//optimmization for last aisle
	if (this.nextAisle === this.aislesWithItems.length-1 && this.side === -1) {
		var topItem = false;
		for (var i = this.aisleLength-1; i > (this.aisleLength-1)/2; i--) {
			if (this.grid[this.nextAisle][i]) {
				topItem = true;
				break;
			}
		}
		if (topItem) {
			this.direction = 1;
			return;
		}
	}
	console.log("hasItem is:", hasItem);
	//if there is an item on the same side, head in that direction, otherwise continue in same direction
	if (hasItem) {
		this.direction = side;
	}
}

AisleMap.prototype.createPath = function() {
	var path = [];

	for (var i = 0; i < this.numAislesWithItems; i++) {
		//choose an initial direction
		if (this.currentPosition === 0) {
			this.direction = 1;
		}
		else {
			this.direction = -1;
		}
		console.log("main loop beforer start direction is", this.direction);
		//moves down the aisle until there are no more items
		while(this.checkAisle(this.direction)) {
			this.moveToItem(this.direction);
		}
		//if no more items in aisle, add current location to path
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		//figure out which aisle to move to next
		this.chooseNextAisle();
		console.log("next aisle:", this.nextAisle);
		//determine new direction
		this.chooseDirection();
		console.log("new direction:", this.direction);
		//move to end of current aisle in selected direction
		this.moveToEnd(this.direction);
		console.log("moved to end");
		//move to next aisle
		console.log("moved to aisle:", this.nextAisle);
		this.currentAisle = this.nextAisle;
		//rise and repeat until complete
	}
}


//tests
var testMap = new AisleMap();
testMap.constructGrid(5);
testMap.placeItems();
testMap.findAislesWithItems();
console.log("Aisles with items:", testMap.aislesWithItems);
testMap.createPath();
console.log(testMap.grid);
