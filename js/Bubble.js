var Bubble = function (context, centerX, centerY) {
	this.context = context;
	this.centerX = centerX;
	this.centerY = centerY;
	this.text = "";
	this.radiusMultiplier = 10;
	this.connections = [];
	
	this.selectedBorderColor = "#FF0000";
	this.selectedBorderWidth = 2;
};

Bubble.radiusRatio = 5.0 / 3.5;

Bubble.radiusXConstant = 5.0;

Bubble.radiusYConstant = 3.5;

Bubble.textPaddingX = 15;

Bubble.textPaddingY = 10;

Bubble.textHeight = 10;

Bubble.prototype.draw = function () {
	this.context.beginPath();
	this.context.strokeStyle = "#000000";
	this.context.fillStyle = "#FFFFFF";
	this.context.ellipse(this.centerX, this.centerY, this.getRadiusX(), this.getRadiusY(), 0, 0, 2 * Math.PI);
	this.context.fill();
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
        if (!this.lineToLong(currentLine + " " + word)) {
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

Bubble.prototype.lineToLong = function (line) {
	return this.context.measureText(line).width >= (2 * this.getRadiusX()) - (2 * Bubble.textPaddingX);
};

Bubble.prototype.contains = function (x, y) {
	var pointCenterDistance = CanvasManager.distanceTo(x, y, this.centerX, this.centerY);
	var angle = (Math.acos((x - this.centerX) / pointCenterDistance) * 180) / Math.PI;
	var radiusPointX = this.centerX + (this.getRadiusX() * ((x - this.centerX) / pointCenterDistance));
	var radiusPointY = this.centerY + (this.getRadiusY() * ((y - this.centerY) / pointCenterDistance));
	var radius = CanvasManager.distanceTo(this.centerX, this.centerY, radiusPointX, radiusPointY);
	
	return radius > pointCenterDistance;
};