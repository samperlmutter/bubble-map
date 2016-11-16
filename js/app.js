var context;
var canvasManager;
$(document).ready(function () {
	context = $("#canvas").get(0).getContext("2d");
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
	
	canvasManager = new CanvasManager(context);
});

var app;
app = angular.module('app', []);


app.controller("ControlsController", function ($scope) {
	$("#controlPanel").get(0).addEventListener('selectstart', function (e) {
		if (canvasManager.dragging) {
			e.preventDefault();
		}
		return false;
	}, true);
	
	$scope.selectionCase = {
		NOTHING: 0,
		BUBBLE: 1,
		LINE: 2
	};
	
	$scope.selection = {
		type: $scope.selectionCase.NOTHING,
		selection: null
	};
	
	$scope.updateSelection = function () {
		if (canvasManager.selectedBubble != null) {
			$scope.selection.type = $scope.selectionCase.BUBBLE;
			$scope.selection.selection = canvasManager.selectedBubble;
		} else if (canvasManager.selectedLine != null) {
			$scope.selection.type = $scope.selectionCase.LINE;
			$scope.selection.selection = canvasManager.selectedLine;
		} else {
			$scope.selection.type = $scope.selectionCase.NOTHING;
			$scope.selection.selection = null;
		}
	};
	
	$("#canvas").mousemove(function (e) {
		$scope.$apply(function () {
			$scope.updateSelection();
		});
	});
	
	$scope.invalidate = function () {
		canvasManager.valid = false;
	};
	
	$scope.delete = function () {
		switch ($scope.selection.type) {
			case $scope.selectionCase.BUBBLE:
				var numConnections = canvasManager.selectedBubble.connections.length;
				for (var i = 0; i < numConnections; i++) {
					var connection = canvasManager.selectedBubble.connections[i];
					canvasManager.connections.splice(canvasManager.connections.indexOf(connection), 1);
					
					connection.fromBubble.connections[connection.fromBubble.connections.indexOf(connection)] = null;
					connection.toBubble.connections[connection.toBubble.connections.indexOf(connection)] = null;
					
					connection.fromBubble = null;
					connection.toBubble = null;
				}
				for (var i = 0; i < canvasManager.bubbles.length; i++) {
					var bubble = canvasManager.bubbles[i];
					for (var j = bubble.connections.length - 1; j >= 0; j--) {
						var connection = bubble.connections[j];
						if (connection == null) {
							bubble.connections.splice(j, 1);
						}
					}
				}
				canvasManager.bubbles.splice(canvasManager.bubbles.indexOf($scope.selection.selection), 1);
				canvasManager.selectedBubble = null;
				break;
			case $scope.selectionCase.LINE:
				canvasManager.connections.splice(canvasManager.connections.indexOf($scope.selection.selection), 1);
				canvasManager.selectedLine.fromBubble.connections.splice(canvasManager.selectedLine.fromBubble.connections.indexOf($scope.selection.selection), 1);
				canvasManager.selectedLine.toBubble.connections.splice(canvasManager.selectedLine.toBubble.connections.indexOf($scope.selection.selection), 1);
				canvasManager.selectedLine = null;
				break;
		}
		
		$scope.invalidate();
		$scope.updateSelection();
	};
});