'use strict';

angular.module('app.access')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'UserService',
        function ($scope, $rootScope, authServ, $location, UserService) {

        var apiServerUrl = 'http://localhost:8000/api';

        $scope.user = {
            "email": "admin@admin.com",
            "password": "123456"
        };

        var User = authServ.user;

        function loginSuccess(data) {
            data.userRole = $scope.user.useRole;
            data.email = $scope.user.email;
            UserService.userLogin(data);
            $location.path('/app/auth');
        }

        //login func
        $scope.login = function () {
            var user = $scope.user;
            //setting live time to 1000*60*24*7
            user.ttl = 1000 * 60 * 24 * 7;
            User.login(null, user)
                .success(function (data) {
                    loginSuccess(data);
                })
                .error(function (err) {
                    $.tips('登录失败，请检查用户名或密码！', 'error');
                });

        };

        $scope.regist = function () {
            $location.path('/regist')
        }

    }]);
