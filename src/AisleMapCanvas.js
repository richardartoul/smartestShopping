var renderAisleMap = function(aisleMap){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	context.beginPath();
	context.moveTo(500 + aisleMap.path[0].x * 40, 500 + aisleMap.path[0].y * 40);

	//finds the next point at which the direction changes
	var findDirectionChange = function() {
	}
		
	var drawPath = function() {
		var counter = 0;

		context.beginPath();
		context.moveTo(500 + aisleMap.path[0].x * 40, 500 + aisleMap.path[0].y * 40);
		var animate = function() {
		  	context.lineTo(aisleMap.path[counter].x*40+500, -aisleMap.path[counter].y*40+500);

			context.lineWidth = 5;
			context.strokeStyle = 'blue';
			context.stroke();
			counter++;
			if (counter < aisleMap.path.length) {
				setTimeout(animate, 100);
			}
		}
		animate();	
	}	

	var drawAisles = function() {
		for (var i = 0; i < aisleMap.numAisles; i++) {
			context.beginPath();
			context.moveTo(480+40*i, 500);
			context.lineTo(480+40*i, 100);
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
		}
	} 

	var drawItems = function() {
		for (var i = 0; i < aisleMap.items.length; i++) {
			context.beginPath();
			context.arc(500 + 40*aisleMap.items[i].x, 500 - 40*aisleMap.items[i].y, 4, 0, 2 * Math.PI);
			context.stroke();
			// context.fillRect(500 + 40*aisleMap.items[i].x, 500 - 40*aisleMap.items[i].y,10,10)
		}
	}

	drawAisles();
	drawItems();
	drawPath();
}

module.exports = renderAisleMap;