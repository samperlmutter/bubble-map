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
	$scope.selectionType = $scope.selectionCase.NOTHING;
	$scope.selection = null;
	
	$scope.updateSelection = function () {
		if (canvasManager.selectedBubble != null) {
			$scope.selectionType = $scope.selectionCase.BUBBLE;
			$scope.selection = canvasManager.selectedBubble;
		} else if (canvasManager.selectedLine != null) {
			$scope.selectionType = $scope.selectionCase.LINE;
			$scope.selection = canvasManager.selectedLine;
		} else {
			$scope.selectionType = $scope.selectionCase.NOTHING;
			$scope.selection = null;
		}
	};
	
	$scope.invalidate = function () {
		canvasManager.valid = false;
	};
});