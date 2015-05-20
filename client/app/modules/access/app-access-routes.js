'use strict';

angular.module('app.access')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                template: '<div ui-view></div>',
                controller: 'AppCtrl'
            })
            .state('app.main', {
                url: '/main',
                templateUrl: '/app/modules/access/welcome/views/welcome.html',
                controller: 'WelcomeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/modules/access/login/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('regist', {
                url: '/regist',
                templateUrl: 'app/modules/access/login/views/regist.html',
                controller: 'RegistCtrl'
            });

        $urlRouterProvider.otherwise('/app/main');
    });