/**
 * file_excelExportCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.file')
    .controller('excelExportCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {

            $scope.excelExpory = function () {
                // $state.go('http://0.0.0.0:3000/api/families/exportfamily')
                window.location = "http://0.0.0.0:3000/api/families/exportfamily"
            }
        }
    ]);