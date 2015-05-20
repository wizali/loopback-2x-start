'use strict';

/**
 * Created by felix on 8/4/14.
 */

var application = angular.module('application', [
    'config',
    'ui.router',
    'phoebe',
    'phoebe.library',
    'ngCookies',
    'app.auth',
    'app.tutorial'
]);

application

    .config(['$stateProvider', '$locationProvider', '$phoebeProvider', 'appconst',
        function ($stateProvider, $locationProvider, $phoebeProvider, appconst) {
            // Phoebe level.
            $phoebeProvider
                .preinit('serverUrl', appconst.apiServerUrl)
                .preinit('dict', {
                    modelName: 'dict',
                    foreignKey: 'dict',
                    optionsField: 'options',
                    keyField: 'key',
                    valueField: 'value'
                });

            $locationProvider.html5Mode(true);
        }
    ])
    .controller('AppCtrl', function ($scope, $rootScope) {

    });
