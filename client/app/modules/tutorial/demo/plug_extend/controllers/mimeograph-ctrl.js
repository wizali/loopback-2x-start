/**
 * plug_extend_mimeographCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial.plug_extend')
    .controller('TutorialMimeographCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);