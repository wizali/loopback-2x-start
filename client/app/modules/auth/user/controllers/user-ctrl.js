'use strict';
angular.module('app.auth')
    .filter('dict', function () {
        return function (key) {
            if (key === "1") {
                return '启用';
            } else {
                return '停用'
            }
        }
    })
    .controller('AuthUserCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'AccessServ', 'PhoebeController',
        function ($scope, $rootScope, authServ, $location, AccessServ,PhoebeController) {

        var apiServerUrl = 'http://localhost:8000/api';

        $scope.oper = false;
        $scope.operType = '';

        $scope.userList = [];
        $scope.statusList = [
            {
                "key": "1",
                "value": "启用"
            },
            {
                "key": "2",
                "value": "停用"
            }
        ];

        var User = authServ.user;

        User.query()
            .success(function (data) {
                $scope.userList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });
        // var controller = new PhoebeController($scope).
        //     createModel('userList', {
        //         model: '/user'
        //     })

        $scope.addOrUpdateUser = function (type, u) {
            if (u) {
                $scope.user = u;
            } else {
                $scope.user = {}
            }
            $scope.oper = true;
            $scope.operType = type;
        };

        $scope.saveUser = function (u) {
            if (!u.password) {
                u.password = '123456';
            }
            u.created = new Date().getTime();
            User.save([$scope.user])
                .success(function (data) {
                    if ($scope.operType === 'add') {
                        $scope.userList.push(data[0]);
                    }
                    $scope.oper = false;
                    $.tips('操作成功！');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        $scope.changeUserStatus = function (u, f) {
            if (u.status === f){
                return false;
            }
            u.status = f;
            User.save([u])
                .success(function (data) {
                    $.tips('操作成功！');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        $scope.delUser = function (u, index) {
            if (window.confirm('确定删除吗？')) {
                User.delete([u.id])
                    .success(function (data) {
                        $scope.userList.splice(index, 1);
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    })
            }
        };

    }]);