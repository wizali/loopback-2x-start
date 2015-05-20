'use strict';

angular.module('app.tutorial.base')
    .config(function ($stateProvider) {
        $stateProvider

            .state("app.tutorial.demo.button", {
                url: "/button",
                templateUrl: '/app/modules/tutorial/demo/base/views/button.html',
                controller: 'TutorialButtonCtrl'
            })
            .state("app.tutorial.demo.table", {
                url: "/table",
                templateUrl: '/app/modules/tutorial/demo/base/views/table.html',
                controller: 'TutorialTabCtrl'
            })
            .state("app.tutorial.demo.tab", {
                url: "/tab",
                templateUrl: '/app/modules/tutorial/demo/base/views/tab.html',
                controller: 'TutorialTabCtrl'
            })

    });