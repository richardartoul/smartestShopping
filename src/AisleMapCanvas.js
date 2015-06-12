var renderAisleMap = function(aisleMap){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var backgroundCanvas = document.getElementById('backgroundCanvas');
	var backgroundContext = backgroundCanvas.getContext('2d');
	var counter = 0;
	var lastAisleWithItem = -1;
	var fade = 0;
	var grow = 0;
	var xOffset = 200;
	var yOffset = 500;
	fadeDirection = 0.01;
	var growDirection = 0.1;
	var tweenedPath = [];

	context.beginPath();
	context.moveTo(xOffset + aisleMap.path[0].x * 40, yOffset + aisleMap.path[0].y * 40);

	//finds the next point at which the direction changes
	var findDirectionChange = function() {
	}

	var findLastAisleWithItem = function() {
		for (var i = 0; i < aisleMap.aislesWithItems.length; i++) {
			if (aisleMap.aislesWithItems[i]) {
				lastAisleWithItem++;
			}
		}
	}

	var updateFade = function() {
		if (fade >= 1) {
			fadeDirection = -0.01;
		}
		else if (fade <= 0.01) {
			fadeDirection = 0.01;
		}
		fade += fadeDirection;
	}

	var updateGrow = function() {
		if (grow >= 5) {
			growDirection = -0.1;
		}
		else if (grow <= 0) {
			growDirection = 0.1;
		}
		grow += growDirection;
	}

	var determineDirection = function(array, index, property) {
		if (!array[index+1] && property === 'y') {
			if (index > aisleMap.aisleLength-1) {
				return 1;
			}
			else {
				return -1;
			}
		}
		else if (!array[index+1]) {
			return 0;
		}
		if (array[index+1][property] > array[index][property]) {
			return 1;
		}
		else if (array[index+1][property] < array[index][property]) {
			return -1;
		}
		else {
			return 0;
		}
	}

	var addWalkways = function() {
		for (var i = 0; i < aisleMap.path.length; i++) {

		}
	}

	var preTween = function() {
		console.log(aisleMap.path);
		for (var i = 0; i < aisleMap.path.length; i++) {
			for (var j = 0; j < 20; j++) {
				x = aisleMap.path[i].x;
				y = aisleMap.path[i].y;
				var tweenedCoordinates = {};
				var xDirection = determineDirection(aisleMap.path, i, 'x');
				var yDirection = determineDirection(aisleMap.path, i, 'y');
				tweenedCoordinates.x = x+0.05*xDirection*j;
				tweenedCoordinates.y = y+0.05*yDirection*j;
				tweenedPath.push(tweenedCoordinates);
			}
		}
	}

	var clearCanvas = function() {
		context.clearRect(0,0,canvas.width, canvas.height);
	}

	var drawDiamond = function(ctx,x,y) {
		ctx.moveTo(x+7.5,y-grow);
		ctx.lineTo(x+15+grow,y+10);
	  ctx.lineTo(x+7.5, y+20+grow);
	  ctx.lineTo(x-grow,y+10);
		ctx.fillStyle = "rgb(102, 204, 0)"; //filled green for inner content
		ctx.lineWidth = 1+0.2*grow; // 1px width of outline
		ctx.strokeStyle = "rgb(0, 50, 200)"; //filled red for outline
		ctx.closePath(); 
		//Fill the shape with colors that defined above
		ctx.fill();
		ctx.stroke();
	}
		
	var drawPath = function() {
		context.beginPath();
		var x = xOffset-6 + tweenedPath[counter].x * 40;
		var y = yOffset - tweenedPath[counter].y * 40
		drawDiamond(context,x,y);	
	}	

	var drawAisles = function() {
		backgroundContext.beginPath();
		backgroundContext.moveTo(xOffset + aisleMap.path[0].x * 40, yOffset + aisleMap.path[0].y * 40);

		for (var i = 0; i < aisleMap.numAisles; i++) {
			backgroundContext.moveTo(xOffset-20+40*i, yOffset+20);
			backgroundContext.lineTo(xOffset-20+40*i, 125);
			backgroundContext.lineWidth = 12;
			backgroundContext.strokeStyle = 'black';
			backgroundContext.stroke();
			backgroundContext.font ="18px serif";
			backgroundContext.fillText((i+1).toString(), xOffset-6+40*i, yOffset+40);
		}
	} 

	var drawItems = function() {
		context.save();
		for (var i = 0; i < aisleMap.items.length; i++) {
			// if (i % 2 === 0) {
			context.globalAlpha = fade+Math.random()*0.001*i;
			// }
			// else {
			// 	context.globalAlpha = fade-0.04*i;
			// }
			var x = xOffset+20 + 40*aisleMap.items[i].x;
			var y = yOffset - 40*aisleMap.items[i].y;
			// backgroundContext.clearRect(x-4,y-4,8, 8);
			context.beginPath();
			context.fillStyle = "rgb(250, 5, 5)";
			context.strokeStyle = "black";
			context.lineWidth = 0.5
			// context.fill();
			// context.stroke();
			// context.arc(x, y, 4, 0, 2 * Math.PI);
			// var aisleSide = Math.floor(Math.random() * 2);

			// console.log(i%2);
			if (i % 2 === 1 && aisleMap.items[i].x !== lastAisleWithItem) {
				backgroundContext.clearRect(x,y-4,4, 8);
				context.fillRect(x,y-4,4, 8);
				context.strokeRect(x,y-4,4, 8);
			}
			else {
				backgroundContext.clearRect(x-44,y-4,4, 8);
				context.fillRect(x-44,y-4,4, 8);
				context.strokeRect(x-44,y-4,4, 8);
			}
		}
		context.restore();
	}

	var render = function() {
		//restart animation
		if (counter === tweenedPath.length - 20) {
			counter = 0;
		}
		clearCanvas();
		drawItems();
		drawPath();
		updateFade();
		updateGrow();
		counter++;
		requestAnimationFrame(render);
	}

	drawAisles();
	preTween();
	findLastAisleWithItem();
	render();
	console.log("last aisle is:", lastAisleWithItem);
}

module.exports = renderAisleMap;