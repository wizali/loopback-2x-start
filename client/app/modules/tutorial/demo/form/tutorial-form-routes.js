'use strict';

angular.module('app.tutorial')
    .config(function ($stateProvider) {

        $stateProvider

            .state("app.tutorial.demo.widget", {
                url: "/widget",
                templateUrl: '/app/modules/tutorial/demo/form/views/widget.html',
                controller: 'TutorialWidgetCtrl'
            })
            .state("app.tutorial.demo.checkbox", {
                url: "/checkbox",
                templateUrl: '/app/modules/tutorial/demo/form/views/checkbox.html',
                controller: 'TutorialCheckboxCtrl'
            })
            .state("app.tutorial.demo.radiobox", {
                url: "/radiobox",
                templateUrl: '/app/modules/tutorial/demo/form/views/radiobox.html',
                controller: 'TutorialRadioboxCtrl'
            })
            .state("app.tutorial.demo.searchabledropdown", {
                url: "/searchabledropdown",
                templateUrl: '/app/modules/tutorial/demo/form/views/searchable-dropdown.html',
                controller: 'TutorialSearchableDropdownCtrl'
            })
            .state("app.tutorial.demo.datepicker", {
                url: "/datepicker",
                templateUrl: '/app/modules/tutorial/demo/form/views/date-picker.html',
                controller: 'TutorialDatePickerCtrl'
            })
            .state("app.tutorial.demo.cascadingdropdown", {
                url: "/cascadingdropdown",
                templateUrl: '/app/modules/tutorial/demo/form/views/cascading-dropdown.html',
                controller: 'TutorialCascadingDropdownCtrl'
            })

    });