'use strict';
angular.module('app.auth.subject')
    .controller('subjectCtrl', ['$scope', '$rootScope', 'authServ', function ($scope, $rootScope, authServ) {

        $scope.subjectList = [];

        var subject = authServ.subject;
        subject.query()
            .success(function (data) {
                $scope.subjectList = data;
                console.log(data)
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        //add subject function
        $scope.addSubject = function () {
            subject.save([$scope.subject])
                .success(function (data) {
                    $scope.subjectList.push(data[0]);
                    $scope.subject = {}
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        //del function
        $scope.delSubject = function (subjectId, index) {
            if (window.confirm('确实要删除吗？')) {
                subject.delete([subjectId])
                    .success(function (data) {
                        $scope.subjectList.splice(index, 1);
                        $.tips('operation success!');
                    })
                    .error(function (err) {
                        $.tips('operation failed!', 'error');
                    })
            }
        }

    }]);