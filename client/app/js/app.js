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
    'app.core',
    'app.auth',
    'app.auth.class',
    'app.auth.evaluate',
    'app.auth.student',
    'app.auth.subject',
    'app.auth.teacher',
    'app.phoebe',
    'app.phoebe.base',
    'app.phoebe.file',
    'app.phoebe.form',
    'app.phoebe.other',
    'app.phoebe.plug',
    'app.phoebe.plug_extend'
]);

application

    .config(['$stateProvider', '$locationProvider', '$phoebeProvider', 'appconst',
        function ($stateProvider, $locationProvider, $phoebeProvider, appconst) {
            // paginationTemplateProvider.setPath('phoebe/src/library/pagination/phoebe.lib.pagination.tpl.html');
            // Phoebe level.
            $phoebeProvider
                .preinit('serverUrl', appconst.apiServerUrl)
                .preinit('dict', {
                    mainModel: 'dict',
                    include: 'dictoptions',
                    foreignKey: 'dict',
                    key: 'key',
                    value: 'value'
                });

            $locationProvider.html5Mode(true);
        }
    ]);
