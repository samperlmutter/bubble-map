var Connection = function (context, fromBubble, mouseX, mouseY) {
	this.context = context;
	this.fromBubble = fromBubble;
	this.toBubble = null;
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.initEdgeX = null;
	this.initEdgeY = null;
};

Connection.prototype.draw = function () {
	if (this.toBubble != null) {
		var bubbleCenterDistance = Math.sqrt(Math.pow(this.fromBubble.centerX - this.toBubble.centerX, 2) + Math.pow(this.fromBubble.centerY - this.toBubble.centerY, 2));
		var bubbleLine = {
			start: {
				x: this.fromBubble.centerX + (this.fromBubble.radius * ((this.toBubble.centerX - this.fromBubble.centerX) / bubbleCenterDistance)),
				y: this.fromBubble.centerY + (this.fromBubble.radius * ((this.toBubble.centerY - this.fromBubble.centerY) / bubbleCenterDistance))
			},
			end: {
				x: this.toBubble.centerX + (this.toBubble.radius * ((this.fromBubble.centerX - this.toBubble.centerX) / bubbleCenterDistance)),
				y: this.toBubble.centerY + (this.toBubble.radius * ((this.fromBubble.centerY - this.toBubble.centerY) / bubbleCenterDistance))
			}
		};

		this.context.beginPath();
		this.context.moveTo(bubbleLine.start.x, bubbleLine.start.y);
		this.context.lineTo(bubbleLine.end.x, bubbleLine.end.y);
		this.context.stroke();

		//Draws arrow pointing to child bubble
//		this.context.beginPath();
//		this.context.moveTo(bubbleLine.end.x, bubbleLine.end.y);
//		this.context.lineTo(bubbleLine.end.x  (), bubbleLine.end.y);
//		this.context.stroke();
//		
//		this.context.beginPath();
//		this.context.moveTo(bubbleLine.end.x, bubbleLine.end.y);
//		this.context.lineTo(bubbleLine.end.x + (), bubbleLine.end.y);
//		this.context.stroke();
	} else {
		var mouseFromBubbleCenterDistance = Math.sqrt(Math.pow(this.mouseX - this.fromBubble.centerX, 2) + Math.pow(this.mouseY - this.fromBubble.centerY, 2));
		var fromBubbleMouseLine = {
			start: {
				x: this.fromBubble.centerX + (this.fromBubble.radius * ((this.mouseX - this.fromBubble.centerX) / mouseFromBubbleCenterDistance)),
				y: this.fromBubble.centerY + (this.fromBubble.radius * ((this.mouseY - this.fromBubble.centerY) / mouseFromBubbleCenterDistance))
			},
			end: {
				x: this.mouseX,
				y: this.mouseY
			}
		};

		this.context.beginPath();
		this.context.moveTo(fromBubbleMouseLine.start.x, fromBubbleMouseLine.start.y);
		this.context.lineTo(fromBubbleMouseLine.end.x, fromBubbleMouseLine.end.y);
		this.context.stroke();
	}
};