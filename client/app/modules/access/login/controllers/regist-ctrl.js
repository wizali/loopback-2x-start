'use strict';

angular.module('app.access')
    .controller('RegistCtrl', ['$scope', '$rootScope', 'authServ', '$location', '$http',
        function ($scope, $rootScope, authServ, $location, $http) {

            $scope.user = {
                email: 'admin@admin.com'
            };

            var User = authServ.user;

            $scope.login = function () {
                $location.path('/login');
            };

            $scope.regist = function () {
                var User = Teacher,
                    user = $scope.user;

                if (user.password !== user.password_r) {
                    $.tips('两次密码不一致！', 'error');
                    return false;
                }

                console.log('registing user!');
                User.save([user])
                    .success(function (data) {
                        console.log(data);
                        $.tips('regist success');

                        //when regist success, go to /login page
                        $scope.login();
                    })
                    .error(function (err) {
                        $.tips(err, 'error');

                    })
            }

        }]);
