'use strict';

angular.module('app.auth')
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.auth', {
                url: '/auth',
                templateUrl: '/app/modules/auth/auth.html',
                controller: 'AuthCtrl'
            })

            .state('app.auth.user', {
                url: "/user",
                templateUrl: "/app/modules/auth/user/views/user.manage.html",
                controller: "AuthUserCtrl"
            })
            .state('app.auth.role', {
                url: "/role",
                templateUrl: "/app/modules/auth/role/views/role.manage.html",
                controller: "AuthRoleCtrl"
            })
            .state('app.auth.func', {
                url: "/func",
                templateUrl: "/app/modules/auth/principle/views/func.manage.html",
                controller: "AuthPrincipleCtrl"
            })

    });