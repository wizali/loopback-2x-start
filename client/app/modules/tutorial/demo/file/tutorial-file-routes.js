'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider

            .state("app.tutorial.demo.fileupload", {
                url: "/fileupload",
                templateUrl: '/app/modules/tutorial/demo/file/views/file-upload.html',
                controller: 'TutorialFileUploadCtrl'
            })
            .state("app.tutorial.demo.imgupload", {
                url: "/imgupload",
                templateUrl: '/app/modules/tutorial/demo/file/views/img-upload.html',
                controller: 'TutorialImgUploadCtrl'
            })
            .state("app.tutorial.demo.excelexport", {
                url: "/excelexport",
                templateUrl: '/app/modules/tutorial/demo/file/views/excel-export.html',
                controller: 'TutorialExcelExportCtrl'
            })

    });