/**
 * plug_extend_mimeographCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.plug_extend')
    .controller('mimeographCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);