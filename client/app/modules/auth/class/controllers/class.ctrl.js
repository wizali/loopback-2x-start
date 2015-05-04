'use strict';

angular.module('app.auth.class')
    .controller('AuthClassCtrl', ['$scope', '$rootScope', 'authServ', function ($scope, $rootScope, authServ) {
        console.log('into controller');

        $scope.classList = [];
        var classes = authServ.classes,
            subject = authServ.subject;

        //list all classess
        classes.query()
            .success(function (data) {
                console.log(data.length);
                $scope.classList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        $scope.addClassSubmit = function () {
            classes.save([$scope.class])
                .success(function (data) {
                    $scope.classList.push(data[0]);
                    $scope.class = {}
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        //del function
        $scope.delClass = function (classId, index) {
            if (window.confirm('确实要删除吗？')) {
                classes.delete([classId])
                    .success(function (data) {
                        $scope.classList.splice(index, 1);
                        $.tips('operation success!');
                    })
                    .error(function (err) {
                        $.tips('operation failed!', 'error');
                    })
            }
        }

    }]);