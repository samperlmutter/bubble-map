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
	
});