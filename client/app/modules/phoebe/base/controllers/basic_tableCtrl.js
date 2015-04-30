/**
 * basic_tableCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.base')
    .controller('PhoebeTableCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);