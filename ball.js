'use strict';

var Balls = Balls || {};

Balls.BouncingBall = (function () {

	var currentBalls = [];
	var interval;

	var moveBalls = function () {

		//if i haven't been started yet, start it up
		if (!interval) {
			interval = setInterval(function () {
				for (var i = 0; i < currentBalls.length; i++) {
					var ball = currentBalls[i];
					ball.move(currentBalls);
				}
			}, 10);
		}

		return interval;
	};

	var BouncingBall = function (canvas) {
		this.canvas = canvas;
		this.color = 'red';
		this.radius = 20;
		this.velocity = 2;

		//random starting location
		var startX = Math.randomBetween(0, canvas.width - (2 * this.radius));
		var startY = Math.randomBetween(0, canvas.height - (2 * this.radius));
		this.location = {
			x: this.radius + startX,
			y: this.radius + startY
		};

		//random direction
		this.xForward = Math.randomBetween(0, 1);
		this.yForward = Math.randomBetween(0, 1);

		var context = this.canvas.getContext('2d');
		this.drawCircle(context, this.location.x, this.location.y, this.radius);

		this.id = currentBalls.length;
		currentBalls.push(this);
		moveBalls();
	};

	return BouncingBall;

})();

Balls.BouncingBall.prototype.move = function (currentBalls) {
	var context = this.canvas.getContext('2d');

	//undraw me
	this.clearCircle(context, this.location.x, this.location.y, this.radius);

	//bounce if collisions with the walls
	if (this.location.x + this.radius > this.canvas.width || this.location.x - this.radius < 0)
		this.xForward = !this.xForward;
	if (this.location.y + this.radius > this.canvas.height || this.location.y - this.radius < 0)
		this.yForward = !this.yForward;

	//bounce if collisions with other balls
	for (var i = 0; i < currentBalls.length; i++) {
		var otherBall = currentBalls[i];

		if (otherBall.id === this.id)
			continue;

		if (this.intersects(otherBall)) {
			this.xForward = !this.xForward;
			this.yForward = !this.yForward;
		}
	}

	//now update my location
	if (this.xForward)
		this.location.x += this.velocity;
	else
		this.location.x -= this.velocity;

	if (this.yForward)
		this.location.y += this.velocity;
	else
		this.location.y -= this.velocity;

	//redraw me
	this.drawCircle(context, this.location.x, this.location.y, this.radius);
};

Balls.BouncingBall.prototype.drawCircle = function (context, x, y, radius) {
	context.save();
	context.fillStyle = this.color;
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
	context.restore();
};

Balls.BouncingBall.prototype.clearCircle = function (context, x, y, radius) {
	context.save();
	context.globalCompositeOperation = 'destination-out';
	context.beginPath();
	context.arc(x, y, radius + .5, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
	context.restore();
};

Balls.BouncingBall.prototype.intersects = function (otherBall) {

	//rudimentary collection detection check
	var dx = (this.location.x + this.radius) - (otherBall.location.x + otherBall.radius);
	var dy = (this.location.y + this.radius) - (otherBall.location.y + otherBall.radius);
	var distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < this.radius + otherBall.radius) {
		return true;
	}

};