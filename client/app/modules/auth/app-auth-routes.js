'use strict';

angular.module('app.auth')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/modules/auth/login/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('regist', {
                url: '/regist',
                templateUrl: 'app/modules/auth/login/views/regist.html',
                controller: 'RegistCtrl'
            })

            .state('app.auth', {
                url: '/auth',
                templateUrl: '/app/modules/auth/auth.html',
                controller: 'AuthCtrl'
            })

            .state('app.auth.user', {
                url: "/user",
                templateUrl: "/app/modules/auth/user/views/user.html",
                controller: "AuthUserCtrl"
            })
            .state('app.auth.role', {
                url: "/role",
                templateUrl: "/app/modules/auth/role/views/role.html",
                controller: "AuthRoleCtrl"
            })
            .state('app.auth.func', {
                url: "/func",
                templateUrl: "/app/modules/auth/principle/views/principle.html",
                controller: "AuthPrincipleCtrl"
            })

    });