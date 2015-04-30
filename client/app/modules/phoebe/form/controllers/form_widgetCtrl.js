/**
 * form_widget
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.form')
    .controller('widgetCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            $scope.data = {
                select: [
                    {
                        key: 'breakfast',
                        value: '早上喝豆浆'
                    },
                    {
                        key: 'lunch',
                        value: '中午吃米饭'
                    },
                    {
                        key: 'supper',
                        value: '晚上炸酱面'
                    }
                ]
            };

            $scope.change = function (s) {
                console.log(s)
            };
            $scope.keydown = function (s) {
                console.log(s)
            };
            $scope.keypress = function (s) {
                console.log(s)
            };
            $scope.keyup = function (s) {
                console.log(s)
            };

            $scope.alt = function (s, a) {
                alert(s);
                alert(a);
            }
        }
    ]);

