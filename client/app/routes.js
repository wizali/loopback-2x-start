'use strict';

angular.module('application')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                template: '<div ui-view></div>',
                controller: 'AppCtrl'
            })
            .state('app.main', {
                url: '/main',
                templateUrl: '/app/modules/welcome.html',
                controller: 'WelcomeCtrl'
            })
        ;

        $urlRouterProvider.otherwise('/app/main');
    });