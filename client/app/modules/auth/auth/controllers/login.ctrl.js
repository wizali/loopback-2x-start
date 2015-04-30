'use strict';
angular.module('app.auth')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'UserService', function ($scope, $rootScope, authServ, $location, UserService) {

        var apiServerUrl = 'http://localhost:8000/api';

        $scope.user = {
            "email": "admin@admin.com",
            "password": "123"
        };

        var Student = authServ.student,
            Teacher = authServ.teacher;

        function loginSuccess(data) {
            data.userRole = $scope.user.useRole;
            data.email = $scope.user.email;
            UserService.userLogin(data);
            $location.path('/app/auth/class');
        };

        $scope.login = function () {
            var useRole = $("input[type=radio]:checked").val();
            var user = $scope.user;
            user.useRole = useRole;
            //setting live time to 1000*60*24*7
            user.ttl = 1000 * 60 * 24 * 7;

            if (useRole === 'student') {
                Student.login(null, user)
                    .success(function (data) {
                        loginSuccess(data);
                    })
                    .error(function (err) {
                        $.tips('登录失败，请检查用户名或密码！', 'error');
                    });
            } else {
                Teacher.login(null, user)
                    .success(function (data) {
                        loginSuccess(data);
                    })
                    .error(function (err) {
                        $.tips('登录失败,请检查用户名或密码！', 'error');
                    });
            }
        };

        $scope.regist = function () {
            $location.path('/regist')
        }

    }]);