var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var counter = 0;
var fade = 0;
fadeDirection = 0.01;
var tweenedPath = [];

context.beginPath();
context.moveTo(500 + testMap.path[0].x * 40, 500 + testMap.path[0].y * 40);

//finds the next point at which the direction changes
var findDirectionChange = function() {
}

var updateFade = function() {
	if (fade >= 1) {
		fadeDirection = -0.01;
	}
	else if (fade <= 0.01) {
		fadeDirection = 0.01;
	}
	fade += fadeDirection;
	console.log(fade);
}

var determineDirection = function(array, index, property) {
	if (!array[index+1] && property === 'y') {
		if (index > testMap.aisleLength-1) {
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
	for (var i = 0; i < testMap.path.length; i++) {

	}
}

var preTween = function() {
	console.log(testMap.path);
	for (var i = 0; i < testMap.path.length; i++) {
		for (var j = 0; j < 20; j++) {
			x = testMap.path[i].x;
			y = testMap.path[i].y;
			var tweenedCoordinates = {};
			var xDirection = determineDirection(testMap.path, i, 'x');
			var yDirection = determineDirection(testMap.path, i, 'y');
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
  	ctx.lineTo(x+15,y+10);
    ctx.lineTo(x+7.5, y+20);
    ctx.lineTo(x,y+10);
	ctx.fillStyle = "rgb(102, 204, 0)"; //filled green for inner content
	ctx.lineWidth = 1; // 1px width of outline
	ctx.strokeStyle = "rgb(0, 50, 200)"; //filled red for outline
	ctx.closePath(); 
	//Fill the shape with colors that defined above
	ctx.fill();
	ctx.stroke();
}
	
var drawPath = function() {

	context.beginPath();
	var x = 500 + tweenedPath[counter].x * 40;
	var y = 500 - tweenedPath[counter].y * 40
	context.moveTo(x+7.5,y);
	var animate = function() {
	  	// context.lineTo(testMap.path[counter].x*40+500, -testMap.path[counter].y*40+500);
	  	drawDiamond(context,x,y);
		// context.lineWidth = 5;
		// context.strokeStyle = 'blue';
		// context.stroke();
		// if (counter < testMap.path.length) {
		// 	setTimeout(animate, 100);
		// }
	}
	animate();	
}	

var drawAisles = function() {
	for (var i = 0; i < testMap.numAisles; i++) {
		context.beginPath();
		context.moveTo(480+40*i, 500);
		context.lineTo(480+40*i, 100);
		context.lineWidth = 2;
		context.strokeStyle = 'black';
		context.stroke();
	}
} 

var drawItems = function() {
	context.save();
	context.globalAlpha = fade
	for (var i = 0; i < testMap.items.length; i++) {
		context.beginPath();
		context.arc(500 + 40*testMap.items[i].x, 500 - 40*testMap.items[i].y, 4, 0, 2 * Math.PI);
		context.fillStyle = "rgb(250, 5, 5)";
		context.strokeStyle = "rgb(250, 5, 5)";
		context.fill();
		context.stroke();
	}
	context.restore();
}

var render = function() {
	clearCanvas();
	drawAisles();
	drawItems();
	drawPath();
	updateFade();
	counter++;
}

preTween();
console.log(tweenedPath);
setInterval(render,16);