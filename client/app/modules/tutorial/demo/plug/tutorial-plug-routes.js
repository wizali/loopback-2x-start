'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider

            .state("app.tutorial.demo.pagination", {
                url: "/pagination",
                templateUrl: '/app/modules/tutorial/demo/plug/views/pagination.html',
                controller: 'TutorialPaginationCtrl'
            })
            .state("app.tutorial.demo.tips", {
                url: "/tips",
                templateUrl: '/app/modules/tutorial/demo/plug/views/tips.html',
                controller: 'TutorialTipsCtrl'
            })
            .state("app.tutorial.demo.popbox", {
                url: "/popbox",
                templateUrl: '/app/modules/tutorial/demo/plug/views/widget.html',
                controller: 'TutorialPopboxCtrl'
            })

    });