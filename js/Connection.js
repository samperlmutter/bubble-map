var Connection = function (context, fromBubble, mouseX, mouseY) {
	this.context = context;
	this.fromBubble = fromBubble;
	this.toBubble = null;
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.initEdgeX = null;
	this.initEdgeY = null;
};

CanvasManager.test = 1;

Connection.prototype.draw = function () {
//	if (!this.fromBubble.contains(this.mouseX, this.mouseY)) {
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
					x: null,
					y: null
				},
				end: {
					x: this.mouseX,
					y: this.mouseY
				}
			};
			
			switch (CanvasManager.test) {
				//Startpoint's fixed and changes when bubble entered
				case 1:
					fromBubbleMouseLine.start.x = this.initEdgeX;
					fromBubbleMouseLine.start.y = this.initEdgeY;
					break;
				//Startpoint's always at the closest edgepoint to the mouse - inside line visible
				case 2:
				//Startpoint's always at the closest edgepoint to the mouse - inside line not visible
				case 3:
					fromBubbleMouseLine.start.x = this.fromBubble.centerX + (this.fromBubble.radius * ((this.mouseX - this.fromBubble.centerX) / mouseFromBubbleCenterDistance))
					fromBubbleMouseLine.start.y = this.fromBubble.centerY + (this.fromBubble.radius * ((this.mouseY - this.fromBubble.centerY) / mouseFromBubbleCenterDistance))
					break;
			}

			this.context.beginPath();
			this.context.moveTo(fromBubbleMouseLine.start.x, fromBubbleMouseLine.start.y);
			this.context.lineTo(fromBubbleMouseLine.end.x, fromBubbleMouseLine.end.y);
			this.context.stroke();
		}
//	} else {
//		this.context.beginPath();
//		this.context.moveTo(this.initEdgeX, this.initEdgeY);
//		this.context.lineTo(this.mouseX, this.mouseY);
//		this.context.stroke();
//	}
};

Connection.prototype.setInnerLinePoints = function (initEdgeX, initEdgeY) {
	var mouseFromBubbleCenterDistance = Math.sqrt(Math.pow(initEdgeX - this.fromBubble.centerX, 2) + Math.pow(initEdgeY - this.fromBubble.centerY, 2));
	this.initEdgeX = this.fromBubble.centerX + (this.fromBubble.radius * ((initEdgeX - this.fromBubble.centerX) / mouseFromBubbleCenterDistance));
	this.initEdgeY = this.fromBubble.centerY + (this.fromBubble.radius * ((initEdgeY - this.fromBubble.centerY) / mouseFromBubbleCenterDistance));
};