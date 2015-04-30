'use strict';
angular.module('app.auth')
    .controller('RegistCtrl', ['$scope', '$rootScope', 'authServ', '$location', '$http',
        function ($scope, $rootScope, authServ, $location, $http) {

            $scope.user = {
                email: 'admin@admin.com'
            };

            var Student = authServ.student,
                Teacher = authServ.teacher;

            $scope.login = function () {
                $location.path('/login')
            };

            $scope.regist = function () {
                var User = Teacher,
                    user = $scope.user;
                var useRole = $("input[type=radio]:checked").val();

                if (user.password !== user.password_r) {
                    $.tips('两次密码不一致！', 'error');
                    return false;
                }

                user.role = useRole;

                if (useRole === 'student'){
                    User = Student;
                }

                console.log('registing user!');
                User.save([user])
                    .success(function (data) {
                        console.log(data);
                        $.tips('regist success');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');

                    })
            }

        }]);