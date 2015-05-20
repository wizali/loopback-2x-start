'use strict';

angular.module('app.auth')
    .run(['$http', '$rootScope', '$location', 'AccessServ', function ($http, $rootScope, $location, AccessServ) {
        AccessServ.config({

        })

    }]);