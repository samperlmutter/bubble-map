var Bubble = function (context, centerX, centerY) {
	this.context = context;
	this.centerX = centerX;
	this.centerY = centerY;
	this.text = "";
	this.radius = 50;
	this.children = [];
	
	this.selectedBorderColor = "#FF0000";
	this.selectedBorderWidth = 2;
};

Bubble.prototype.draw = function () {
	this.context.beginPath();
	this.context.strokeStyle = "#000000";
	this.context.fillStyle = "#FFFFFF";
	this.context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
	this.context.fill();
	this.context.stroke();
	
	this.context.textAlign = "center";
	this.context.textBaseline = "middle";
	this.context.strokeStyle = "#000000";
	this.context.strokeText(this.text, this.centerX, this.centerY);
};

Bubble.prototype.drawSelected = function () {
	this.context.beginPath();
	this.context.strokeStyle = this.selectedBorderColor;
	this.context.lineWidth = this.selectedBorderWidth;
	this.context.fillStyle = "#FFFFFF";
	this.context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
	this.context.fill();
	this.context.stroke();
	
	this.context.textAlign = "center";
	this.context.textBaseline = "middle";
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 1;
	this.context.strokeText(this.text, this.centerX, this.centerY);
}

Bubble.prototype.addChild = function (bubble) {
	this.children.push(bubble);
};

Bubble.prototype.contains = function (x, y) {
	var pointCenterDistance = CanvasManager.distanceTo(x, y, this.centerX, this.centerY);
	
	return this.radius > pointCenterDistance;
}