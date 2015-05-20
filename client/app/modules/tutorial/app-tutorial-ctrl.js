'use strict';

angular.module('app.tutorial')
    .controller('TutorialCtrl', ['$scope', '$rootScope','$location', function ($scope, $rootScope,$location) {
        //该页面是空的，默认跳转到catalog
        if ($location.$$path === '/app/tutorial'){
            $location.path('/app/tutorial/catalog');
        }
    }]);
