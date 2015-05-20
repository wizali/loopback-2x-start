'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider

            .state("app.tutorial.demo.console", {
                url: "/console",
                templateUrl: '/app/modules/tutorial/demo/other/views/console.html',
                controller: 'TutorialConsoleCtrl'
            });
    });