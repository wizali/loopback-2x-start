'use strict';

angular.module('app.auth')
/**
 * 用于判断用户是否对按钮有可用权限，如果按钮不可用，则从页面中删除
 * 被验证的按钮必须有"data-access-btn"属性，且该属性的值必须和页面中某个按钮权限的sign字段对应
 * 如果该按钮不属于权限管理的范围，可以不用验证
 * 验证方法是：用该按钮"data-access-btn"属性的值和该页面中可被访问的按钮数组对比
 * 校验前监听AccessServ.getPrinciple()，如果有值，才进行验证
 */
    .directive('accessBtn', ['$rootScope', '$location', 'AccessServ',
        function ($rootScope, $location, AccessServ) {

            function accessAble(btns, sign) {
                var f = 0;
                angular.forEach(btns, function (b) {
                    if (b.sign === sign) {
                        f = 1
                    }
                });
                return f;
            }

            return {
                link: function (scope, iElem, iAttr) {
                    var path = $location.$$path;
                    var sign = iAttr.accessBtn;

                    if (sign && sign !== '') {

                        scope.$watch(function () {
                            return AccessServ.getPrinciple();
                        }, function (newVal, oldVal, scope) {
                            if (newVal) {
                                var btns = AccessServ.getButtons(path);
                                if (!accessAble(btns, sign)) {
                                    iElem.remove();
                                }
                            }
                        });

                    }
                }
            }
        }]);