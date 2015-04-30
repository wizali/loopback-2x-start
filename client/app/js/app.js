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
    .run(['$http', '$rootScope', '$location', 'UserService', function ($http, $rootScope, $location, UserService) {

        UserService.setCurrentUser({
            username: "wizali",
            password: "wizali"
        });

        //当路由发生变化时，如果用户没有登录，则跳转到登录页面
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!UserService.getCurrentUser()) {
                if (!UserService.getCurrentUser() && toState.url !== '/regist') {
                    console.log('user not login yeat!');
                    $location.path('/login');
                }
            }
        });
    }])
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
