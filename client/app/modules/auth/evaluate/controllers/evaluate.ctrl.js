'use strict';
angular.module('app.auth.evaluate')
.controller('evaluateCtrl',['$scope','$rootScope','authServ',function ($scope,$rootScope,authServ){

	$scope.evaluateList = [];

	var evaluate = authServ.evaluate;

	evaluate.query()
	.success(function (data){
		$scope.evaluateList = data;
	})
	.error(function (err){
		$.tips(err,'error');
	})

}])