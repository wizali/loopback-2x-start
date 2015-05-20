'use strict';

angular.module('app.auth')
    .controller('AuthCtrl', ['$http', '$scope', '$rootScope', '$location', 'AccessServ', 'authServ', 'TreeService',
        function ($http, $scope, $rootScope, $location, AccessServ, authServ, TreeService) {
            //render now page
            var apiServerUrl = 'http://localhost:8000/api';
            var url = $location.$$path;
            $(".active").removeClass('active');

            //logout
            $scope.logout = function () {
                var currentUser = AccessServ.getUser();

                $http.post(apiServerUrl + '/users/logout?access_token=' + currentUser.access_token)
                    .success(function (data) {
                        logoutSuccess(data);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            };

            function logoutSuccess(data) {
                AccessServ.logout();
                $location.path('/login');
            }

            //left_nav
            var user = AccessServ.getUser();
            var Page = authServ.page;
            Page.getRoutes(null,{userId: user.userid})
                .success(function (data) {
                    AccessServ.setPrinciple(data);
                    var config = {
                        treeData: TreeService.arrayToTreeData(data, 'id', 'parentId', '0'),
                        id: "left_nav_ul"
                    };

                    TreeService.buildLinkTree(config, $("#left_nav"));
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });

        }]);