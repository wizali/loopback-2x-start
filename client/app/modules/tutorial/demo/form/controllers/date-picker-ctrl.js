/**
 * form_datePickerCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial.form')
    .controller('TutorialDatePickerCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog);

            $scope.change = function (s) {
                console.log(s)
            }

        }
    ]);

