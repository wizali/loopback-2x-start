'use strict';

angular.module('app.auth')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'AccessServ',
        function ($scope, $rootScope, authServ, $location, AccessServ) {
            $scope.user = {
                "email": "admin@admin.com",
                "password": "123456"
            };

            var User = authServ.user;
            var ttl = AccessServ.getTtl();

            //login func
            $scope.login = function () {
                var user = $scope.user;
                user.ttl = ttl;
                User.login(null, user)
                    .success(function (data) {
                        var o = {
                            username: $scope.user.email,
                            userid: data.userId,
                            access_token: data.id
                        };
                        AccessServ.setUser(o);
                        $location.path('/app/main');
                    })
                    .error(function (err) {
                        $.tips('登录失败，请检查用户名或密码！', 'error');
                    });

            };

            $scope.regist = function () {
                $location.path('/regist')
            }

        }]);
