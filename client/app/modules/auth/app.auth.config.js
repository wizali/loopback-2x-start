'use strict';

angular.module('app.auth')
    .run(['$http', '$rootScope', '$location', 'UserService', function ($http, $rootScope, $location, UserService) {


        //当路由发生变化时，如果用户没有登录，则跳转到登录页面
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!UserService.getCurrentUser()) {
                if (!UserService.getCurrentUser() && toState.url !== '/regist') {
                    console.log('user not login yeat!');
                    $location.path('/login');
                }
            }
        });
    }]);