'use strict';

angular.module('app.phoebe')
    .config(function ($stateProvider) {

        $stateProvider
            .state('app.phoebe', {
                url: '/phoebe',
                template: '<div ui-view></div>',
                controller: 'PhoebeCtrl'
            })
            .state("app.phoebe.catalog", {
                url: "/catalog",
                templateUrl: '/app/modules/phoebe/01/catalog.html',
                controller: 'PhoebeCatalogCtrl'
            })
            .state("app.phoebe.demo", {
                url: "/demo",
                templateUrl: "/app/modules/phoebe/01/demo.html",
                controller: "PhoebeDemoCtrl"
            })
        /*************************basic*********************************/
            .state("app.phoebe.demo.button", {
                url: "/button",
                templateUrl: '/app/modules/phoebe/base/views/basic_button.html',
                controller: 'PhoebeButtonCtrl'
            })
            .state("app.phoebe.demo.table", {
                url: "/table",
                templateUrl: '/app/modules/phoebe/base/views/basic_table.html',
                controller: 'PhoebeTabCtrl'
            })
            .state("app.phoebe.demo.tab", {
                url: "/tab",
                templateUrl: '/app/modules/phoebe/base/views/basic_tab.html',
                controller: 'PhoebeTabCtrl'
            })
        /*************************basic*********************************/
        /*************************form*********************************/
            .state("app.phoebe.demo.widget", {
                url: "/widget",
                templateUrl: '/app/modules/phoebe/form/views/form_widget.html',
                controller: 'widgetCtrl'
            })
            .state("app.phoebe.demo.checkbox", {
                url: "/checkbox",
                templateUrl: '/app/modules/phoebe/form/views/form_checkbox.html',
                controller: 'checkboxCtrl'
            })
            .state("app.phoebe.demo.radiobox", {
                url: "/radiobox",
                templateUrl: '/app/modules/phoebe/form/views/form_radiobox.html',
                controller: 'radioboxCtrl'
            })
            .state("app.phoebe.demo.searchabledropdown", {
                url: "/searchabledropdown",
                templateUrl: '/app/modules/phoebe/form/views/form_searchableDropdown.html',
                controller: 'searchableDropdownCtrl'
            })
            .state("app.phoebe.demo.datepicker", {
                url: "/datepicker",
                templateUrl: '/app/modules/phoebe/form/views/form_datepicker.html',
                controller: 'datePickerCtrl'
            })
            .state("app.phoebe.demo.cascadingdropdown", {
                url: "/cascadingdropdown",
                templateUrl: '/app/modules/phoebe/form/views/form_cascadingDropdown.html',
                controller: 'cascadingDropdownCtrl'
            })
        /*************************form*********************************/
        /*************************plug in*********************************/
            .state("app.phoebe.demo.pagination", {
                url: "/pagination",
                templateUrl: '/app/modules/phoebe/plug/views/plug_pagination.html',
                controller: 'paginationCtrl'
            })
            .state("app.phoebe.demo.tips", {
                url: "/tips",
                templateUrl: '/app/modules/phoebe/plug/views/plug_tips.html',
                controller: 'tipsCtrl'
            })
            .state("app.phoebe.demo.popbox", {
                url: "/popbox",
                templateUrl: '/app/modules/phoebe/plug/views/plug_widget.html',
                controller: 'popboxCtrl'
            })
        /*************************plug in*********************************/
        /*************************plug extend*********************************/
            .state("app.phoebe.demo.tree", {
                url: "/tree",
                templateUrl: '/app/modules/phoebe/plug_extend/views/plug_extend_tree.html',
                controller: 'treeCtrl'
            })
            .state("app.phoebe.demo.editabletable", {
                url: "/editabletable",
                templateUrl: '/app/modules/phoebe/plug_extend/views/plug_extend_editableTable.html',
                controller: 'editableTableCtrl'
            })
            .state("app.phoebe.demo.mimeograph", {
                url: "/mimeograph",
                templateUrl: '/app/modules/phoebe/plug_extend/views/plug_extend_mimeograph.html',
                controller: 'mimeographCtrl'
            })
        /*************************plug extend*********************************/
        /*************************file*********************************/
            .state("app.phoebe.demo.fileupload", {
                url: "/fileupload",
                templateUrl: '/app/modules/phoebe/file/views/file_fileUpload.html',
                controller: 'fileUploadCtrl'
            })
            .state("app.phoebe.demo.imgupload", {
                url: "/imgupload",
                templateUrl: '/app/modules/phoebe/file/views/file_imgUpload.html',
                controller: 'imgUploadCtrl'
            })
            .state("app.phoebe.demo.excelexport", {
                url: "/excelexport",
                templateUrl: '/app/modules/phoebe/file/views/file_excelExport.html',
                controller: 'excelExportCtrl'
            })
        /*************************file*********************************/
        /*************************others*********************************/
            .state("app.phoebe.demo.console", {
                url: "/console",
                templateUrl: '/app/modules/phoebe/other/views/other_console.html',
                controller: 'consoleCtrl'
            });
        /*************************others*********************************/
    });