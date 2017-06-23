var Bubble = function (context, centerX, centerY) {
	this.context = context;
	this.centerX = centerX;
	this.centerY = centerY;
	this.text = "";
	this.radiusMultiplier = 20;
	this.connections = [];

	this.selectedBorderColor = "#FF0000";
	this.selectedBorderWidth = 2;
};

Bubble.radiusXConstant = 5.0;

Bubble.radiusYConstant = 3.5;

Bubble.radiusRatio = Bubble.radiusXConstant / Bubble.radiusYConstant;

Bubble.textPaddingX = 15;

Bubble.textPaddingY = 10;

Bubble.textPadding = 10;

Bubble.textHeight = 10;

Bubble.prototype.draw = function () {
	this.context.beginPath();
	this.context.strokeStyle = "#000000";
	this.context.fillStyle = "#FFFFFF";
	this.context.ellipse(this.centerX, this.centerY, this.getRadiusX(), this.getRadiusY(), 0, 0, 2 * Math.PI);
	this.context.fill();
	this.context.stroke();

	this.context.beginPath();
	this.context.strokeStyle = "#000000";
	this.context.moveTo(this.getEdgeCoordinate.fromY(this.centerY - 40).leftX, this.centerY - 40);
	this.context.lineTo(this.getEdgeCoordinate.fromY(this.centerY - 40).rightX, this.centerY - 40);
	this.context.stroke();

	this.drawText();
};

Bubble.prototype.drawSelected = function () {
	this.context.beginPath();
	this.context.strokeStyle = this.selectedBorderColor;
	this.context.fillStyle = "#FFFFFF";
	this.context.lineWidth = this.selectedBorderWidth;
	this.context.ellipse(this.centerX, this.centerY, this.getRadiusX(), this.getRadiusY(), 0, 0, 2 * Math.PI);
	this.context.fill();
	this.context.stroke();

	this.drawText();
};

Bubble.prototype.drawText = function () {
	var lines = this.getLines();

	this.context.textAlign = "center";
	this.context.textBaseline = "middle";
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 1;
	this.context.font = Bubble.textHeight + "px sans-serif";
	for (var i = 0; i < lines.length; i++) {
		this.context.strokeText(lines[i], this.centerX, this.calculateLineCenter(i, lines.length));
	}
};

Bubble.prototype.getRadiusX = function () {
	return Bubble.radiusXConstant * this.radiusMultiplier;
};

Bubble.prototype.getRadiusY = function () {
	return Bubble.radiusYConstant * this.radiusMultiplier;
};

Bubble.prototype.calculateLineCenter = function (lineNum, numLines) {
	return numLines > 0 ? this.centerY + (10 * lineNum) + ((-5 * numLines) + 5) : this.centerY;
};

Bubble.prototype.getLines = function () {
	var words = this.text.split(" ");
	var lines = [];
	var currentLine = words[0];

	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		if (!this.lineTooLong(currentLine + " " + word)) {
			//Add word to line
			currentLine += " " + word;
		} else {
			//Wrap line
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);

	if (lines[0] != "") {
		//Check if too many lines for bubble height
		if (this.getRadiusY() - (this.centerY - (this.calculateLineCenter(0, lines.length) - (Bubble.textHeight / 2))) <= Bubble.textPaddingY) {
			//Increase bubble size appropriately
			this.radiusMultiplier = ((this.centerY - this.calculateLineCenter(0, lines.length)) + (Bubble.textHeight / 2) + Bubble.textPaddingY) / Bubble.radiusYConstant;
		}
	}

	return lines;
};

Bubble.prototype.fitToText = function (lines) {
	for (var i = 0; i < lines.length; i++) {
		var rightEdgeX = this.centerX + (this.context.measureText(line).width / 2);
		var rightEdgeY = this.calculateLineCenter(i, lines.length);
	}
};

Bubble.prototype.lineTooLong = function (line) {
	return this.context.measureText(line).width >= (2 * this.getRadiusX()) - (2 * Bubble.textPaddingX);
};

Bubble.prototype.contains = function (x, y) {
	var angle = Math.atan2(y - this.centerY, x - this.centerX);
	var t = Math.atan((this.getRadiusX() * Math.tan(angle)) / this.getRadiusY());
	var angleDeg = (-angle * 180) / Math.PI;
	if (angleDeg > 90 && angleDeg < 180) {
		t += Math.PI;
	} else if (angleDeg < -90 && angleDeg > -180) {
		t -= Math.PI;
	}
	var xComp = this.getRadiusX() * Math.cos(t);
	var yComp = this.getRadiusY() * Math.sin(t);

	var radius = Math.sqrt((xComp * xComp) + (yComp * yComp));
	var mouseRadius = CanvasManager.distanceTo(this.centerX, this.centerY, x, y);

	return radius >= mouseRadius;
};

Bubble.prototype.onEdge = function (x, y) {
	var angle = Math.atan2(y - this.centerY, x - this.centerX);
	var t = Math.atan((this.getRadiusX() * Math.tan(angle)) / this.getRadiusY());
	var angleDeg = (-angle * 180) / Math.PI;
	if (angleDeg > 90 && angleDeg < 180) {
		t += Math.PI;
	} else if (angleDeg < -90 && angleDeg > -180) {
		t -= Math.PI;
	}
	var xComp = this.getRadiusX() * Math.cos(t);
	var yComp = this.getRadiusY() * Math.sin(t);

	var radius = Math.sqrt((xComp * xComp) + (yComp * yComp));
	var mouseRadius = CanvasManager.distanceTo(this.centerX, this.centerY, x, y);
	var radiiDiff = Math.abs(mouseRadius - radius);

	return radiiDiff >= this.selectedBorderWidth - 4 && radiiDiff <= this.selectedBorderWidth + 4;
};

Bubble.prototype.getEdgeCoordinate = {
	fromX: function (x) {
		var a = this.radiusMultiplier * Bubble.radiusXConstant * 2;
		var b = this.radiusMultiplier * Bubble.radiusYConstant * 2;
		var leftY, rightY;

		leftY = this.centerY - Math.sqrt((b * b) * (1 - ((this.centerX - x) * (this.centerX - x) / (a * a))));
		rightY = this.centerY + Math.sqrt((b * b) * (1 - ((this.centerX - x) * (this.centerX - x) / (a * a))));

		return {
			leftY: leftY,
			rightY: rightY
		};
	},
	fromY: function (y) {
		console.log(y);
		var a = this.radiusMultiplier * Bubble.radiusXConstant * 2;
		var b = this.radiusMultiplier * Bubble.radiusYConstant * 2;
		var leftX, rightX;

		leftX = this.centerX - Math.sqrt((a * a) * (1 - ((this.centerY - y) * (this.centerY - y) / (b * b))));
		rightX = this.centerX + Math.sqrt((a * a) * (1 - ((this.centerY - y) * (this.centerY - y) / (b * b))));

		return {
			leftX: leftX,
			rightX: rightX
		};
	}
}
Bubble.prototype.changeSize = function (x, y) {
	var angle = Math.atan2(y - this.centerY, x - this.centerX);
	var t = Math.atan((this.getRadiusX() * Math.tan(angle)) / this.getRadiusY());
	var angleDeg = (-angle * 180) / Math.PI;
	if (angleDeg > 90 && angleDeg < 180) {
		t += Math.PI;
	} else if (angleDeg < -90 && angleDeg > -180) {
		t -= Math.PI;
	}
	var xComp = this.getRadiusX() * Math.cos(t);
	var yComp = this.getRadiusY() * Math.sin(t);

	var radius = Math.sqrt((xComp * xComp) + (yComp * yComp));
	var mouseRadius = CanvasManager.distanceTo(this.centerX, this.centerY, x, y);

	this.radiusMultiplier *= mouseRadius / radius;

	this.getLines();
};
