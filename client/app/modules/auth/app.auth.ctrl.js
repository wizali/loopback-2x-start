'use strict';

angular.module('app.auth')
    .controller('AuthCtrl', ['$http', '$scope', '$rootScope', '$location', 'UserService', 'authServ', function ($http, $scope, $rootScope, $location, UserService, authServ) {
        //render now page
        var apiServerUrl = 'http://localhost:8000/api';
        var url = $location.$$path;
        $(".active").removeClass('active');

        var Student = authServ.student,
            Teacher = authServ.teacher;

        //logout
        $scope.logout = function () {
            var currentUser = UserService.getCurrentUser();
            var userRole = currentUser.userRole;
            var params = {
                'access_token': currentUser.id,
                'accessToken': currentUser.id,
                'id': currentUser.id
            };

            if (userRole === 'student') {
                $http.post(apiServerUrl + '/students/logout?access_token=' + params.access_token)
//                Student.logout(null,params)
                    .success(function (data) {
                        logoutSuccess(data);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            } else {
                $http.post(apiServerUrl + '/teachers/logout?access_token=' + params.access_token)
//                Teacher.logout(null,params)
                    .success(function (data) {
                        logoutSuccess(data);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
        };

        function logoutSuccess(data) {
            console.log(data);
            UserService.userLogout();
            console.log(UserService.getCurrentUser());
            console.log(window.localStorage);
            $location.path('/login');
        }

    }]);