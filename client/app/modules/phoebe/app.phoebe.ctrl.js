'use strict';

angular.module('app.phoebe')
    .controller('PhoebeCtrl', ['$scope', '$rootScope','$location', function ($scope, $rootScope,$location) {
        //该页面是空的，默认跳转到catalog
        if ($location.$$path === '/app/phoebe'){
            $location.path('/app/phoebe/catalog');
        }
    }]);
