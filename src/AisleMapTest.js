var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

context.beginPath();
context.moveTo(500 + testMap.path[0].x * 40, 500 + testMap.path[0].y * 40);

// line 1
for (var i = 0; i < testMap.path.length; i++) {
	console.log("x:", testMap.path[i].x*40+500, "y:", testMap.path[i].y*40+500)
  context.lineTo(testMap.path[i].x*40+500, -testMap.path[i].y*40+500);
}

context.lineWidth = 5;
context.strokeStyle = 'blue';
context.stroke();