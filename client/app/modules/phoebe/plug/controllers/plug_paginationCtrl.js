/**
 * plug_pagionation
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.plug')
    .controller('paginationCtrl', ['$scope', '$http', '$compile', 'DateFormat', 'PhoebeResource', 'PhoebeDict', 'PhoebeController', '$location',
        function ($scope, $http, $compile, DateFormat, PhoebeResource, PhoebeDict, PhoebeController, $location) {
            console.log($location);
            $scope.familyFormVisible = false;
            var controller;
            setTimeout(function () {
                controller = new PhoebeController($scope).
                    preload('dict', ['archivetype', 'networkDeviceType']).
                    preload('options', [
                        {
                            name: 'familyOptions',
                            model: '/family'
                        },
                        {
                            name: 'carsOptions',
                            model: '/car',
                            trigger: 'familyid'
                        },
                        {
                            name: 'memberOptions',
                            model: '/member'
                        }
                    ]).
                    createModel('family', {
                        model: '/family',
                        wherestr: {
                            include: ['members', 'cars']
                        },

                        interface: {
                            customInterface: {
                                method: 'post',
                                path: true
                            }
                        }
                    });
                $scope.$on(controller.MODEL_OPERATION, function (evt, result, current) {
                    switch (result.model) {
                        case 'family':
                            familyEventHandler(result.optype, result.index, result.data, result.success, evt, result.trigger);
                            break;
                    }
                });
            });

            function familyEventHandler(type, index, data, success, evt, trigger) {
                /**
                 * 保存之前
                 */
                if (type == controller.optype.SAVING) {
                    console.log("[" + type + "]", trigger);
                    evt.defaultPrevented = true;
                }
                /**
                 * 保存之后
                 */
                if (type == controller.optype.SAVED) {
                    // 之后
                    console.log("[" + type + "]", trigger, data);
                    //console.log(data);
                }
                /**
                 * 删除处理器
                 */
                if (type == controller.optype.REMOVING) {
                    // 之前
                    if (window.confirm('是否删除')) {
                        $scope.$resoure.familyDelete(index);
                    }
                } else if (type == controller.optype.DELETED) {
                    // 之后
                    //console.log(data);
                }
                /**
                 * 批量删除
                 */
                if (type == controller.optype.BATCH_REMOVING) {
                    // 之前
                    if (window.confirm('是否删除')) {
                        $scope.$resoure.familyBatchDelete();
                    }
                } else if (type == controller.optype.BATCH_DELETED) {
                    // 之后
                    //console.log(data);
                }
            }

            $scope.getSelectedItem = function () {
                console.log($scope.$dataProvider.familyOptions.selectedItem.name);
            };
            /**
             * phoebe
             */
            $scope.phoebeFind = function () {
                console.log($scope.$model.phoebeDataSource);
            };
            $scope.phoebeAdd = function () {
                $scope.$resoure.phoebeAdd();
            };
            $scope.phoebeMidify = function () {
                $scope.$resoure.phoebeModify(2);
            };
            $scope.phoebeRemove = function () {
                $scope.$resoure.phoebeDelete(2);
            };
        }
    ]);