'use strict';

angular.module('app.auth')
    .controller('AuthCtrl', ['$http', '$scope', '$rootScope', '$location', 'UserService', 'authServ', function ($http, $scope, $rootScope, $location, UserService, authServ) {
        //render now page
        var apiServerUrl = 'http://localhost:8000/api';
        var url = $location.$$path;
        $(".active").removeClass('active');

        var User = authServ.user,
            Page = authServ.page;

        //logout
        $scope.logout = function () {
            var currentUser = UserService.getCurrentUser();
            var userRole = currentUser.userRole;
            var params = {
                'access_token': currentUser.id,
                'accessToken': currentUser.id,
                'id': currentUser.id
            };

            $http.post(apiServerUrl + '/users/logout?access_token=' + params.access_token)
//                User.logout(null,params)
                .success(function (data) {
                    logoutSuccess(data);
                })
                .error(function (err) {
                    console.log(err);
                });
        };

        function logoutSuccess(data) {
            console.log(data);
            UserService.userLogout();
            console.log(UserService.getCurrentUser());
            console.log(window.localStorage);
            $location.path('/login');
        }

        //left_nav
        var user = UserService.getCurrentUser(),
            routes = [];
//        console.log(user);
        authServ.getRoutes(user.userId)
            .success(function (data){
                routes = data;
                angular.forEach(data,function (d){
                    $("#left_nav").append($('<li><a href="'+ d.url+'">'+ d.name+'</a></li>'))
                })
            })
            .error(function (err){
                $.tips(err,'error');
            })

    }]);