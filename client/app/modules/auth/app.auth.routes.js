'use strict';

angular.module('app.auth')
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.auth', {
                url: '/auth',
                templateUrl: '/app/modules/auth/auth.html',
                controller: 'AuthCtrl',
                authenticate: true
            })
            .state('app.auth.user', {
                url: "/user",
                templateUrl: "/app/modules/auth/auth/views/user.manage.html",
                controller: "AuthUserCtrl"
            })
            .state('app.auth.role', {
                url: "/role",
                templateUrl: "/app/modules/auth/auth/views/role.manage.html",
                controller: "AuthRoleCtrl"
            })
            .state('app.auth.func', {
                url: "/func",
                templateUrl: "/app/modules/auth/auth/views/func.manage.html",
                controller: "AuthFuncCtrl"
            })

            //auth demo route
            .state('app.auth.evaluate', {
                url: '/evaluate',
                templateUrl: "/app/modules/auth/evaluate/views/evaluate.html",
                controller: 'evaluateCtrl'
            })

    });