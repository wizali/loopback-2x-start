'use strict';

angular.module('app.auth')
    .controller('RegistCtrl', ['$scope', '$rootScope', 'authServ', '$location',
        function ($scope, $rootScope, authServ, $location) {

            $scope.user = {
                email: 'admin@admin.com'
            };

            var User = authServ.user;

            $scope.regist = function () {
                var user = $scope.user;

                if (user.password !== user.password_r) {
                    $.tips('两次密码不一致！', 'error');
                    return false;
                }

                User.save([user])
                    .success(function (data) {
                        $.tips('regist success');

                        //when regist success, go to /login page
                        $scope.login();
                    })
                    .error(function (err) {
                        $.tips(err, 'error');

                    })
            };

            $scope.login = function () {
                $location.path('/login');
            };

        }]);
