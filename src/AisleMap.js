var AisleMap = function(options) {
  var options = options || {};
  //test data
	this.items = [
		{x: 0, y:1},
		{x: 0, y:3},
		{x: 1, y:1},
		{x: 2, y:4},
		{x: 4, y:0},
	];
	this.grid = [];
	this.path = [];
	this.aislesWithItems = [];
	this.currentAisle = 0;
	this.currentPosition = 0;
	this.nextAisle = 0;
	this.nextItem = 0;
	this.direction = 1;
	//array initializer makes array one size smaller than parameter
	this.aisleLength = options.aisleLength + 1 || 11;
	this.numAisles = options.numAisles || 5;
}

AisleMap.prototype.constructGrid = function() {
	for (var i = 0; i < this.numAisles; i++) {
		//fun way to initialize array values
		this.grid.push(new Array(this.aisleLength)
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
		direction ? currentPosition++ : currentPosition --;
		if (this.grid[currentAisle][currentPosition]) {
			console.log(currentAisle, currentPosition);
			return true;
		}
	}	
	console.log("false");
	console.log(currentAisle, currentPosition);

	return false;
}

AisleMap.prototype.moveToItem = function(direction) {
	while (this.currentPosition < this.aisleLength && this.currentPosition >= 0) {
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		direction ? this.currentPosition++ : this.currentPosition --;

		if (this.grid[this.currentAisle][this.currentPosition]) {
			console.log("moved to", this.currentAisle, this.currentPosition);
			break;
		}
	}
	console.log("moved to", this.currentAisle, this.currentPosition);
}

//path to end of aisle
AisleMap.prototype.moveToEnd = function(direction) {
	if (direction === 1) {
		for (var i = this.currentPosition; i < this.aisleLength; i++) {
			this.currentPosition++;
			this.path.push({x: this.currentAisle, y:this.currentPosition});
		}
	}
	else if (direction === -1) {
		for (var i = this.currentPosition; i > 0; i--) {
			this.currentPosition--;
			this.path.push({x: this.currentAisle, y:this.currentPosition});
		}
	}
}

AisleMap.prototype.chooseNextAisle = function() {
	for (var i = this.currentAisle+1; i < this.aislesWithItems.length; i++) {
		if (this.aislesWithItems[i]) {
			this.nextAisle = i;
			return i;
		}
	}
}

AisleMap.prototype.chooseDirection = function(direction) {
	//correponds to direction, 1 is top half of aisle, -1 is bottom half of aisle
	var side;
	var hasItem = false;
	//figure out what side the current position is on
	if (this.currentPosition < this.aisleLength/2) {
		side = -1;
	}
	else if (this.currentPosition > this.aisleLength/2) {
		side = -1;
	}
	else {
		side = direction;
	}

	console.log("current position is:", this.currentPosition);
	console.log("side is:", side);
	//check if there are any items on that side
	if (side === 1) {
		for (var i = this.aisleLength-1; i > 0; i--) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
		}
	}
	else if (side === -1) {
		for (var i = 0; i < this.aisleLength; i++) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
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

	for (var i = 0; i < this.aislesWithItems)
		//moves down the aisle until there are no more items
		while(this.checkAisle(1)) {
			this.moveToItem(1);
		}
		//if no more items in aisle, add current location to path
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		//determine new direction
		this.chooseNextAisle();
		console.log("next aisle:", this.nextAisle);
		this.chooseDirection();
		console.log("new direction:", this.direction);
		this.moveToEnd(-1);
		console.log(this.path);
		this.currentAisle = this.nextAisle;
	}

	// 	//moves down the aisle until there are no more items
	// while(this.checkAisle(1)) {
	// 	this.moveToItem(1);
	// }
	// //if no more items in aisle, add current location to path
	// this.path.push({x: this.currentAisle, y:this.currentPosition});
	// //determine new direction
	// this.chooseNextAisle();
	// console.log("next aisle:", this.nextAisle);
	// this.chooseDirection();
	// console.log("new direction:", this.direction);
	// this.moveToEnd(-1);
	// console.log(this.path);
}


//tests
var testMap = new AisleMap();
testMap.constructGrid(5);
testMap.placeItems();
testMap.findAislesWithItems();
console.log("Aisles with items:", testMap.aislesWithItems);
testMap.createPath();
console.log(testMap.grid);
