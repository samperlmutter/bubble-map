var Connection = function (context, fromBubble, mouseX, mouseY) {
	this.context = context;
	this.fromBubble = fromBubble;
	this.toBubble = null;
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.initEdgeX = null;
	this.initEdgeY = null;
	this.line = {
		start: {
			x: null,
			y: null
		},
		end: {
			x: null,
			y: null
		}
	};
	
	this.selectedBorderColor = "#FF0000";
	this.selectedBorderWidth = 2;
};

Connection.prototype.calculateEndpoints = function () {
	if (this.toBubble != null) {
		var bubbleCenterDistance = CanvasManager.distanceTo(this.fromBubble.centerX, this.fromBubble.centerY, this.toBubble.centerX, this.toBubble.centerY);
		this.line.start.x = this.fromBubble.centerX/* + (this.fromBubble.radius * ((this.toBubble.centerX - this.fromBubble.centerX) / bubbleCenterDistance))*/;
		this.line.start.y = this.fromBubble.centerY/* + (this.fromBubble.radius * ((this.toBubble.centerY - this.fromBubble.centerY) / bubbleCenterDistance))*/;
		this.line.end.x = this.toBubble.centerX/* + (this.toBubble.radius * ((this.fromBubble.centerX - this.toBubble.centerX) / bubbleCenterDistance))*/;
		this.line.end.y = this.toBubble.centerY/* + (this.toBubble.radius * ((this.fromBubble.centerY - this.toBubble.centerY) / bubbleCenterDistance))*/;
	} else {
		var mouseFromBubbleCenterDistance = CanvasManager.distanceTo(this.mouseX, this.mouseY, this.fromBubble.centerX, this.fromBubble.centerY);
//		this.line.start.x = this.fromBubble.centerX + (this.fromBubble.radius * ((this.mouseX - this.fromBubble.centerX) / mouseFromBubbleCenterDistance));
//		this.line.start.y = this.fromBubble.centerY + (this.fromBubble.radius * ((this.mouseY - this.fromBubble.centerY) / mouseFromBubbleCenterDistance));
		this.line.start.x = this.fromBubble.centerX;
		this.line.start.y = this.fromBubble.centerY;
		this.line.end.x = this.mouseX;
		this.line.end.y = this.mouseY;
	}
}

Connection.prototype.draw = function () {
		this.calculateEndpoints();

		this.context.beginPath();
		this.context.moveTo(this.line.start.x, this.line.start.y);
		this.context.lineTo(this.line.end.x, this.line.end.y);
		this.context.stroke();
		
		//Draws arrow pointing to child bubble
//		this.context.beginPath();
//		this.context.moveTo(this.line.end.x, this.line.end.y);
//		this.context.lineTo(this.line.end.x  (), this.line.end.y);
//		this.context.stroke();
//		
//		this.context.beginPath();
//		this.context.moveTo(this.line.end.x, this.line.end.y);
//		this.context.lineTo(this.line.end.x + (), this.line.end.y);
//		this.context.stroke();
};

Connection.prototype.drawSelected = function () {
	this.calculateEndpoints();

	this.context.beginPath();
	this.context.strokeStyle = this.selectedBorderColor;
	this.context.lineWidth = this.selectedBorderWidth;
	this.context.moveTo(this.line.start.x, this.line.start.y);
	this.context.lineTo(this.line.end.x, this.line.end.y);
	this.context.stroke();

	//Draws arrow pointing to child bubble
//	this.context.beginPath();
//	this.context.moveTo(this.line.end.x, this.line.end.y);
//	this.context.lineTo(this.line.end.x  (), this.line.end.y);
//	this.context.stroke();
//
//	this.context.beginPath();
//	this.context.moveTo(this.line.end.x, this.line.end.y);
//	this.context.lineTo(this.line.end.x + (), this.line.end.y);
//	this.context.stroke();
	
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 1;
};

Connection.prototype.contains = function (x, y) {
	var leftBound;
	var rightBound;
	var topBound;
	var bottomBound;
	
	if (this.fromBubble.centerX < this.toBubble.centerX) {
		leftBound = this.fromBubble.centerX;
		rightBound = this.toBubble.centerX;
	} else {
		leftBound = this.toBubble.centerX;
		rightBound = this.fromBubble.centerX;
	}
	if (this.fromBubble.centerY < this.toBubble.centerY) {
		topBound = this.fromBubble.centerY;
		bottomBound = this.toBubble.centerY;
	} else {
		topBound = this.toBubble.centerY;
		bottomBound = this.fromBubble.centerY;
	}
	
	if (x < leftBound || x > rightBound || y < topBound || y > bottomBound) {
		return false;
	} else if (x > leftBound && x < rightBound && y > topBound && y < bottomBound) {
		var mouseSlope = (y - this.line.start.y) / (x - this.line.start.x);
		var lineSlope = (this.line.end.y - this.line.start.y) / (this.line.end.x - this.line.start.x);
		var error = 0.05;
		var acceptable = mouseSlope <= lineSlope + error && mouseSlope >= lineSlope - error;
		
		return acceptable;
	}
}