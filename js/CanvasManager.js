var CanvasManager = function (context) {
	this.context = context;
	var state = this;
	
	this.valid = true;
	this.dragging = false;
	this.connectionStarted = false;
	
	this.bubbles = [];
	this.selectedBubble = null;
	this.currentLine = null;
	this.connections = [];
	
	this.dragOffsetX = 0;
	this.dragOffsetY = 0;
	this.refreshRate = 15;
	
	$("#canvas").dblclick(function (e) {
		state.bubbles.push(new Bubble(state.context, e.pageX, e.pageY));
		state.valid = false;
	});
	
	$("#canvas").mousedown(function (e) {
		for (var i = state.bubbles.length - 1; i >= 0; i--) {
			switch (e.button) {
				case 0:
					if (state.bubbles[i].contains(e.pageX, e.pageY)) {
						state.selectedBubble = state.bubbles[i];
						state.dragOffsetX = e.pageX - state.selectedBubble.centerX;
						state.dragOffsetY = e.pageY - state.selectedBubble.centerY;
						state.valid = false;
						state.dragging = true;
						return;
					}


					if (state.selectedBubble) {
						state.selectedBubble = null;
						state.valid = false;
					}
					
					break;
				case 2:
					if (!state.connectionStarted) {
						if (state.bubbles[i].contains(e.pageX, e.pageY)) {
							state.connectionStarted = true;
							state.currentLine = new Connection(state.context, state.bubbles[i], e.pageX, e.pageY);
							state.valid = false;
							if (CanvasManager.test == 1) {
								state.currentLine.setInnerLinePoints(e.pageX, e.pageY);
							}
						}
					}
					break;
			}
		}
	});
	
	$("#canvas").mouseup(function (e) {
		state.dragging = false;
	});
	
	var startConnectionInsideState;
	var previousStartConnectionInsideState;
	$("#canvas").mousemove(function (e) {
		if (state.dragging) {
			state.selectedBubble.centerX = e.pageX - state.dragOffsetX;
			state.selectedBubble.centerY = e.pageY - state.dragOffsetY;
			state.valid = false;
		}
		
		if (state.connectionStarted) {
			startConnectionInsideState = state.currentLine.fromBubble.contains(e.pageX, e.pageY);
			state.currentLine.mouseX = e.pageX;
			state.currentLine.mouseY = e.pageY;
			state.valid = false;
			
			if (!previousStartConnectionInsideState && startConnectionInsideState) {
				state.currentLine.setInnerLinePoints(e.pageX, e.pageY);
			}
//			console.log(!previousStartConnectionInsideState && startConnectionInside);
			previousStartConnectionInsideState = state.currentLine.fromBubble.contains(e.pageX, e.pageY);
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
						state.currentLine.fromBubble.children.push({
							child: state.currentLine.toBubble,
							connection: state.currentLine
						});
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
		
		if (CanvasManager.test == 3) {
			for (var i = 0; i < this.connections.length; i++) {
				this.connections[i].draw();
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
		} else {
			for (var i = 0; i < this.connections.length; i++) {
				this.connections[i].draw();
			}

			for (var i = 0; i < this.bubbles.length; i++) {
				this.bubbles[i].draw();
			}

			if (this.selectedBubble != null) {
				this.selectedBubble.drawSelected();
			}

			if (this.connectionStarted) {
				this.currentLine.draw();
			}
		}
		
		
		this.valid = true;
	}
};