/**
 * plug_tipsCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.plug')
    .controller('tipsCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog);

            var f = 0;
            $scope.tip = function () {
                if (!f) {
                    $scope.successTip();
                } else {
                    $scope.failureTip();
                }
                f = !f;
            };

            $scope.successTip = function () {
                $.tips('成功提示框是绿色的。弹出后将在3妙后消失！', 'success');
            };

            $scope.failureTip = function () {
                $.tips('失败提示框是红色的。弹出后将在3妙后消失！', 'error');
            }
        }
    ]);