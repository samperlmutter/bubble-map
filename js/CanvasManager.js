var CanvasManager = function (context) {
	this.context = context;
	var state = this;
	
	this.valid = true;
	this.dragging = false;
	this.connectionStarted = false;
	this.inControlPanel = false;
	
	this.bubbles = [];
	this.selectedBubble = null;
	this.selectedLine = null;
	this.currentLine = null;
	this.connections = [];
	
	this.dragOffsetX = 0;
	this.dragOffsetY = 0;
	this.refreshRate = 15;
	
	$("#canvas").get(0).addEventListener('selectstart', function (e) {
		e.preventDefault();
		return false;
	}, false);
	
	$("#controlPanel").get(0).addEventListener('selectstart', function (e) {
		if (state.dragging) {
			e.preventDefault();
		}
		return false;
	}, true);
	
	$("#canvas").dblclick(function (e) {
		state.bubbles.push(new Bubble(state.context, e.pageX, e.pageY));
		state.valid = false;
	});
	
	$("#canvas").mousedown(function (e) {
		switch (e.button) {
			//Left click
			case 0:
				for (var i = state.bubbles.length - 1; i >= 0; i--) {
					if (state.bubbles[i].contains(e.pageX, e.pageY)) {
						state.selectedBubble = state.bubbles[i];
						state.selectedLine = null;
						state.dragOffsetX = e.pageX - state.selectedBubble.centerX;
						state.dragOffsetY = e.pageY - state.selectedBubble.centerY;
						state.valid = false;
						state.dragging = true;
						return;
					}

					if (state.selectedBubble) {
						state.selectedBubble = null;
						state.selectedLine = null;
						state.valid = false;
					}
				}

				for (var i  = state.connections.length - 1; i >= 0; i--) {
					if (state.connections[i].contains(e.pageX, e.pageY)) {
						state.selectedLine = state.connections[i];
						state.selectedBubble = null;
						state.valid = false;
						return;
					}

					if (state.selectedLine) {
						state.selectedBubble = null;
						state.selectedLine = null;
						state.valid = false;
					}
				}

				break;
			//Right click
			case 2:
				for (var i = state.bubbles.length - 1; i >= 0; i--) {
					if (!state.connectionStarted) {
						if (state.bubbles[i].contains(e.pageX, e.pageY)) {
							state.connectionStarted = true;
							state.currentLine = new Connection(state.context, state.bubbles[i], e.pageX, e.pageY);
							state.valid = false;
						}
					}
				}

				break;
		}
	});
	
	$("#canvas").mouseup(function (e) {
		state.dragging = false;
	});
	
	$(document).mousemove(function (e) {
		if (state.selectedBubble != null && (state.selectedBubble.centerX + state.selectedBubble.radius > $("#controlPanel").offset().left && state.selectedBubble.centerX - state.selectedBubble.radius < $("#controlPanel").offset().left + $("#controlPanel").outerWidth(true)) && (state.selectedBubble.centerY - state.selectedBubble.radius < $("#controlPanel").offset().top + $("#controlPanel").outerHeight(true) && state.selectedBubble.centerY + state.selectedBubble.radius > $("#controlPanel").offset().top)) {
			state.inControlPanel = true;
		} else {
			state.inControlPanel = false;
		}
	});
	
	$("#canvas").mousemove(function (e) {
		var newCenterX = e.pageX - state.dragOffsetX;
		var newCenterY = e.pageY - state.dragOffsetY;
		var leftBound = $("#controlPanel").offset().left;
		var rightBound = $("#controlPanel").offset().left + $("#controlPanel").outerWidth(true);
		var bottomBound = $("#controlPanel").offset().top + $("#controlPanel").outerHeight(true);
		var topBound = $("#controlPanel").offset().top;
		
		if (state.dragging) {
			if (state.inControlPanel) {
				if (newCenterX > rightBound || newCenterX < leftBound || newCenterY > bottomBound || newCenterY < topBound) {
					state.selectedBubble.centerX = newCenterX;
					state.selectedBubble.centerY = newCenterY;
				}
			} else {
				state.selectedBubble.centerX = newCenterX;
				state.selectedBubble.centerY = newCenterY;
			}
			
			state.valid = false;
		}
		
		if (state.connectionStarted) {
			state.currentLine.mouseX = e.pageX;
			state.currentLine.mouseY = e.pageY;
			state.valid = false;
		}
	});
	
	$("#canvas").contextmenu(function (e) {
		var notInBubble = true;
		for (var i = 0; i < state.bubbles.length; i++) {
			if (state.bubbles[i].contains(e.pageX, e.pageY)) {
				notInBubble = false;
				e.preventDefault();
				if (state.bubbles[i] != state.currentLine.fromBubble) {
					state.currentLine.toBubble = state.bubbles[i];
					if (!state.connectionExists(state.currentLine)) {
						state.connections.push(state.currentLine);
						state.currentLine.fromBubble.connections.push(state.currentLine);
						state.currentLine.toBubble.connections.push(state.currentLine);
					}
					state.currentLine = null;
					state.valid = false;
				}
			}
		}
		if (notInBubble) {
			state.currentLine = null;
			state.valid = false;
		}
		if (state.connectionStarted) {
			e.preventDefault();
			state.connectionStarted = false;
		}
	});
	
	setInterval(function () {
		state.draw();
	}, this.refreshRate);
};

CanvasManager.distanceTo = function (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

CanvasManager.prototype.connectionExists = function (connection) {
	for (var i = 0; i < this.connections.length; i++) {
		if ((this.connections[i].fromBubble == connection.fromBubble && this.connections[i].toBubble == connection.toBubble) || (this.connections[i].fromBubble == connection.toBubble && this.connections[i].toBubble == connection.fromBubble)) {
			return true;
		}
	}
	
	return false;
}

CanvasManager.prototype.clear = function () {
	this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

CanvasManager.prototype.draw = function () {
	if (!this.valid) {
		this.clear();
		
		for (var i = 0; i < this.connections.length; i++) {
			this.connections[i].draw();
		}
		
		if (this.selectedLine != null) {
			this.selectedLine.drawSelected();
		}

		if (this.connectionStarted) {
			this.currentLine.draw();
		}

		for (var i = 0; i < this.bubbles.length; i++) {
			this.bubbles[i].draw();
		}

		if (this.selectedBubble != null) {
			this.selectedBubble.drawSelected();
		}
		
		this.valid = true;
	}
};