'use strict';
angular.module('app.auth.student')
    .controller('studentCtrl', ['$scope', '$rootScope', 'authServ', function ($scope, $rootScope, authServ) {

        $scope.studentList = [];
        $scope.genderList = [];
        $scope.classList = [];

        var Student = authServ.student,
            Gender = authServ.gender,
            Classes = authServ.classes;
        Gender.query()
            .success(function (data) {
                $scope.genderList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });
        Classes.query()
            .success(function (data) {
                $scope.classList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        //query student list
        Student.query()
            .success(function (data) {
                $scope.studentList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        $scope.addStudent = function () {

        }


    }]);