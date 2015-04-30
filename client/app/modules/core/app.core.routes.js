'use strict';

angular.module('app.core')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            //login and regist
            .state('login', {
                url: '/login',
                templateUrl: 'app/modules/auth/auth/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('regist', {
                url: '/regist',
                templateUrl: 'app/modules/auth/auth/views/regist.html',
                controller: 'RegistCtrl'
            })
//            .state('router', {
//                url: '/router',
//                template: '<div class="lockscreen" style="height: 100%"></div>',
//                controller: 'RouteCtrl'
//            })
            .state('app', {
//                abstract: true,
                url: '/app',
                template: '<div ui-view></div>',
                controller: 'HomeCtrl'
            })
            .state('app.main', {
                url: '/main',
                templateUrl: '/app/modules/core/views/welcome.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('/app/main');
    });