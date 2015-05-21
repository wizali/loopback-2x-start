'use strict';

angular.module('app.auth')
    .run(['$http', '$rootScope', '$location', 'AccessServ', function ($http, $rootScope, $location, AccessServ) {
        /**
         * 在这里设置用户权限相关信息
         * 1、TTL                用户有效期，单位是毫秒。默认：1000 * 60 * 24 * 7
         * 2、NO_LOGIN_PAGE      用户未登录时默认跳转页面。默认：'/login'
         * 3、WHITE_LIST         页面白名单，即不用登录也可以访问的页面。默认：['/regist', '/login']
         */
        AccessServ.config({

        })

    }]);