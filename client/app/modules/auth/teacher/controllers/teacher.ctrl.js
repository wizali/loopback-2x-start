'use strict';

angular.module('app.auth.teacher')
.controller('teacherCtrl',['$scope','$rootScope','authServ',function ($scope,$rootScope,authServ){

	$scope.theachaerList = [];

	var Teacher = authServ.teacher;

	Teacher.query()
	.success(function (data){
		$scope.theachaerList = data;
	})
	.error(function (err){
		$.tips(err,'error');
	})

}]);