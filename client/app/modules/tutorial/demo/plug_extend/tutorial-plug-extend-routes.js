'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider

        /*************************plug extend*********************************/
            .state("app.tutorial.demo.tree", {
                url: "/tree",
                templateUrl: '/app/modules/tutorial/demo/plug_extend/views/tree.html',
                controller: 'TutorialTreeCtrl'
            })
            .state("app.tutorial.demo.editabletable", {
                url: "/editabletable",
                templateUrl: '/app/modules/tutorial/demo/plug_extend/views/editable-able.html',
                controller: 'TutorialEditableTableCtrl'
            })
            .state("app.tutorial.demo.mimeograph", {
                url: "/mimeograph",
                templateUrl: '/app/modules/tutorial/demo/plug_extend/views/mimeograph.html',
                controller: 'TutorialMimeographCtrl'
            })

    });