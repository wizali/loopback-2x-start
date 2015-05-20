'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider
            .state('app.tutorial', {
                url: '/tutorial',
                template: '<div ui-view></div>',
                controller: 'TutorialCtrl'
            })
            .state("app.tutorial.catalog", {
                url: "/catalog",
                templateUrl: '/app/modules/tutorial/catalog/views/catalog.html',
                controller: 'TutorialCatalogCtrl'
            })
            .state("app.tutorial.demo", {
                url: "/demo",
                templateUrl: "/app/modules/tutorial/demo/demo.html",
                controller: "TutorialDemoCtrl"
            })

    });