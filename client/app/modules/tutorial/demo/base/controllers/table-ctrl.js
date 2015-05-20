/**
 * basic_tableCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial.base')
    .controller('TutorialTableCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);