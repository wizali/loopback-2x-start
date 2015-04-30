/**
 * other_console
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.other')
    .controller('consoleCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);