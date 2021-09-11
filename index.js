let canvas = document.getElementById("main"),
	ctx = canvas.getContext("2d"),
	height = canvas.height = window.innerHeight,
	width = canvas.width = window.innerWidth,
	running = true;

function meterToPixels(meter) {
	// pixel = .1 meter
	return meter * 10;
}

function pixelsToMeter(pixels) {
	return pixels / 10;
}

var astronaut = {
	x: meterToPixels(12),
	y: meterToPixels(5),
	vy: meterToPixels(0),
	vx: meterToPixels(-4), // 4m/s
	update: function(delta) {
		this.x += this.vx * delta;
		this.y += this.vy * delta;
		if (this.x <= 0) {
			this.x = meterToPixels(12);
			running = false;
		}
	},
	draw: function() {
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y + meterToPixels(1));
		ctx.lineTo(this.x, this.y - meterToPixels(1));
		ctx.stroke();
		ctx.closePath();
	},
};

var ball = {
	x: meterToPixels(12),
	y: meterToPixels(5),
	vy: 0,
	vx: meterToPixels(-11),
	totalDistance: 0,
	update: function(delta) {
		this.x += this.vx * delta;
		this.y += this.vy * delta;
		if (this.x >= astronaut.x) {
			this.vx = -this.vx;
			// Correcting position (should be easy since motion is linear)
			let distanceOff = this.x - astronaut.x;
			this.x -= distanceOff;
		}
		if (this.x <= 0) {
			this.vx = -this.vx;
			// Correcting position
			let distanceOff = -this.x;
			this.x += distanceOff;
		}

		this.totalDistance += pixelsToMeter(Math.abs(this.vx * delta));
	},
	draw: function() {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
	}
};

var lastTime = Date.now();

function update() {
	let elapsedTime = (Date.now() - lastTime) / 1000;
	ball.update(elapsedTime);
	astronaut.update(elapsedTime);
	lastTime = Date.now();
}

function draw() {
	ctx.clearRect(0, 0, width,height);
	astronaut.draw();
	ball.draw();
	ctx.font = "30px serif";
	ctx.fillText(`Distance traveled by Ping Pong in meters: ${Math.round(ball.totalDistance)}m`, 20, meterToPixels(5 + 5));
	update();
	if (running)
		raf = window.requestAnimationFrame(draw);
}

draw();
