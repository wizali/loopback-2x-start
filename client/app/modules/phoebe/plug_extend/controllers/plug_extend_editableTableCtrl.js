/**
 * plug_extend_editableTableCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.plug_extend')
    .controller('editableTableCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }
    ]);