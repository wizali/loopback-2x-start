/**
 * other_console
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial.other')
    .controller('TutorialConsoleCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);