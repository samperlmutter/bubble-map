var Bubble = function (context, centerX, centerY) {
	this.context = context;
	this.centerX = centerX;
	this.centerY = centerY;
	this.text = "";
	this.radius = 50;
	this.radiusX = 50;
	this.radiusY = 30;
	this.radiusRatio = 5.0 / 3.0;
	this.connections = [];
	
	this.selectedBorderColor = "#FF0000";
	this.selectedBorderWidth = 2;
};

Bubble.textPaddingX = 15;

Bubble.textPaddingY = 10;

Bubble.textHeight = 10;

Bubble.prototype.draw = function () {
	this.context.beginPath();
	this.context.strokeStyle = "#000000";
	this.context.fillStyle = "#FFFFFF";
	this.context.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
	this.context.fill();
	this.context.stroke();
	
	this.drawText();
};

Bubble.prototype.drawSelected = function () {
	this.context.beginPath();
	this.context.strokeStyle = this.selectedBorderColor;
	this.context.fillStyle = "#FFFFFF";
	this.context.lineWidth = this.selectedBorderWidth;
	this.context.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
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
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
	
	if (lines[0] != "") {
		if (this.radiusY - (this.centerY - (this.calculateLineCenter(0, lines.length) - (Bubble.textHeight / 2))) <= Bubble.textPaddingY) {
			this.radiusY = (this.centerY - this.calculateLineCenter(0, lines.length)) + (Bubble.textHeight / 2) + Bubble.textPaddingY;
			
			this.radiusX = this.radiusRatio * this.radiusY;
		}
	}
	
	return lines;
};

Bubble.prototype.lineToLong = function (line) {
	return this.context.measureText(line).width >= (2 * this.radiusX) - (2 * Bubble.textPaddingX);
};

Bubble.prototype.contains = function (x, y) {
	var pointCenterDistance = CanvasManager.distanceTo(x, y, this.centerX, this.centerY);
	var angle = (Math.acos((x - this.centerX) / pointCenterDistance) * 180) / Math.PI;
	var radiusPointX = this.centerX + (this.radiusX * ((x - this.centerX) / pointCenterDistance));
	var radiusPointY = this.centerY + (this.radiusY * ((y - this.centerY) / pointCenterDistance));
	var radius = CanvasManager.distanceTo(this.centerX, this.centerY, radiusPointX, radiusPointY);
	
	return radius > pointCenterDistance;
};