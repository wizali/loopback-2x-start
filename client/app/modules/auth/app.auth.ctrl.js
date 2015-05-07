'use strict';

angular.module('app.auth')
    .controller('AuthCtrl', ['$http', '$scope', '$rootScope', '$location', 'UserService', 'authServ', 'TreeService',
        function ($http, $scope, $rootScope, $location, UserService, authServ, TreeService) {
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
            var user = UserService.getCurrentUser();
            authServ.getRoutes(user.userId)
                .success(function (data) {
                    var config = {
                        treeData: TreeService.arrayToTreeData(data, 'id', 'parentId', '0'),
                        id: "left_nav_ul"
                    };

                    TreeService.buildLinkTree(config, $("#left_nav"));

                })
                .error(function (err) {
                    $.tips(err, 'error');
                })

        }]);