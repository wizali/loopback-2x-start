'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:RouteCtrl
 * @description Redirect for acess
 * @requires $scope
 * @requires $location
 * @requires UserService
 **/
angular.module('app.core')
    .controller('RouteCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
        if (!UserService.getCurrentUser()) {
            console.log('Redirect to login');
            $location.path('/login');
        } else {
            console.log('Redirect to app');
            $location.path('/app/main');
        }
    }]);
