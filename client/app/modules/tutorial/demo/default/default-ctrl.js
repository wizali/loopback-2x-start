/**
 * Created by felix on 10/17/14.
 */

application.controller('DefaultCtrl', ['$scope', '$http', '$compile', 'DateFormat', 'PhoebeResource', 'PhoebeDict', 'PhoebeController',
    function($scope, $http, $compile, DateFormat, PhoebeResource, PhoebeDict, PhoebeController) {

        $scope.showForm = function() {
            var ielement = angular.element('#autoForm');
            ielement.append('<level:one></level:one>');
            $compile(ielement);
        };

        $scope.selectedItem = '12121212';

        $scope.title = '点击展开';
        $scope.text = '这里是内部的内容。';

        $scope.currentDate = DateFormat.getDate();

        $scope.familyFormVisible = false;
        $scope.memberFormVisible = false;

        var controller = new PhoebeController($scope).
        preload('dict', ['archivetype', 'networkDeviceType']).
        preload('options', [{
            name: 'familyOptions',
            model: '/family'
        }, {
            name: 'carsOptions',
            model: '/car',
            trigger: 'familyid'
        }, {
            name: 'memberOptions',
            model: '/member'
        }]).
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
        }).
        createModel('member', {
            model: '/member',
            wherestr: {
                include: ['family']
            }
        }).
        createModel('phoebe', {
            model: '/phoebe',
            PK: 'phoebeid'
        });

        $scope.$on(controller.DICT_LOADED, function(evt, success, current) {
            //console.log('[dict]:', success, $scope.$dataProvider.archivetype, $scope.$dataProvider.networkDeviceType);
        });

        $scope.$on(controller.OPTION_LOADED, function(evt, success, current) {
            //console.log('[option]:', success, $scope.$dataProvider.carsOptions, $scope.$dataProvider.memberOptions);
        });

        $scope.$on(controller.MODEL_LOADED, function(evt, result, current) {
            //console.log('[Model]:', result, $scope.$model);
        });

        $scope.$on(controller.MODEL_OPERATION, function(evt, result, current) {
            switch (result.model) {
                case 'family':
                    familyEventHandler(result.optype, result.index, result.data, result.success, evt, result.trigger);
                    break;
                case 'member':
                    memberEventHandler(result.optype, result.index, result.data, result.success, evt);
                    break;
                case 'phoebe':
                    phoebeEventHandler(result, evt);
                    break;
            }
        });

        function familyEventHandler(type, index, data, success, evt, trigger) {

            //console.log('[family.'+ type +']: ', success);
            /**
             * 添加处理器
             */
            if (type == controller.optype.ADDING) {
                // 之前
            }

            /**
             * 修改处理器
             */
            //
            if (type == controller.optype.MODIFYING) {
                // 之前
            }

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

        function memberEventHandler(type, index, data, success, evt) {
            //console.log('[member.'+ type +']: ', success);
            /**
             * 添加处理器
             */
            if (type == controller.optype.ADDING) {
                // 之前
            } else if (type == controller.optype.SAVED) {
                // 之后
                //console.log(data);
            }

            /**
             * 修改处理器
             */
            //
            if (type == controller.optype.MODIFYING) {
                // 之前
            } else if (type == controller.optype.SAVED) {
                // 之后
                //console.log(data);
            }
            /**
             * 删除处理器
             */
            if (type == controller.optype.REMOVING) {
                // 之前
                if (window.confirm('是否删除')) {
                    $scope.$resoure.memberDelete(index);
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
                    $scope.$resoure.memberBatchDelete();
                }
            } else if (type == controller.optype.BATCH_DELETED) {
                // 之后
                //console.log(data);
            }
        }

        console.log($scope);

        $scope.getSelectedItem = function() {
            console.log($scope.$dataProvider.familyOptions.selectedItem.name);
        };

        /**
         * phoebe
         */

        $scope.phoebeFind = function() {
            console.log($scope.$model.phoebeDataSource);
        };

        $scope.phoebeAdd = function() {
            $scope.$resoure.phoebeAdd();
        };

        $scope.phoebeMidify = function() {
            $scope.$resoure.phoebeModify(2);
        };

        $scope.phoebeRemove = function() {
            $scope.$resoure.phoebeDelete(2);
        };


        function phoebeEventHandler(result, evt) {
            if (result.optype == controller.optype.ADDING) {
                $scope.$model.phoebe = {};
                $scope.$model.phoebe.phoebeid = '3';
                $scope.$model.phoebe.name = 'aaaa';
                $scope.$resoure.phoebeSave();
            }

            if (result.optype == controller.optype.MODIFYING) {
                $scope.$model.phoebe = {};
                $scope.$model.phoebe.phoebeid = '3';
                $scope.$model.phoebe.name = 'bbbb';
                $scope.$resoure.phoebeSave();
            }

            if (result.optype == controller.optype.SAVED) {
                // 之后
                //console.log(result.data);
            }
        }

        //$scope.$dataProvider
        //$scope.$model
        //$scope.$resoure.

        /*PhoebeCotroller
            .preload('scope', $scope)
            .preload('dict', ['archivetype', 'networkDeviceType'])
            .preload('options', [
                {name: 'carsOptions', model: '/car'},
                {name: 'memberOptions', model: '/member', param: 'carid'}
             ])
            .createModel('family', {
                model: '/family',
                wherestr: {include: ['members', 'cars']},
                viewDataModels: ['familyList', 'family']
            })
        ;*/

        /*$scope.$dataProvider;  // family

        // pre level.


        $scope.$resoure;
        PhoebeCotroller
            .regResoure('family', DefaultResoure.family)
            .regResoure('family', DefaultResoure.family)
        ;

        // reg
        PhoebeCotroller.callback();*/

        /*var family = DefaultResoure.family;
        family.query({include: ['members', 'cars']}).success(function(list){
            $scope.items = list;
        });

        $scope.editHandler = function(item){
            $scope.saveItem = angular.copy(item);
        };

        $scope.removeHandler = function(id, index){
            family.delete([]).success(function(data){
                console.log('==>',data);
            });
            //family.delete([id]);
            //$scope.items.splice(index, 1);
        };

        $scope.saveHandler = function(){
            family.save([$scope.saveItem]).success(function(data){

            });
        };

        $scope.resetHandler = function(){
            $scope.saveItem = null;
        };*/

        /*var using = DefaultResoure.using;
        using.delete({where: {carid : '111'}}).success(function(data){
            console.log("[Ctrl]: " + data);
        });

        var family = DefaultResoure.family;
        family.save([{abc: 111}]).success(function(ulist){
            console.log(ulist);
        });
        family.delete([{where: {abc : 111}}]).success(function(ulist){
            console.log(ulist);
        });

        var wherestr = {
            fkid    : '5F94727343fhjdu4',
            hasmany : 'car',
            where   : {zip: 750001, age: 45, logic: 'and'},
            between : {field: 'zip', val: ['750000', '750010']},
            include : ['cars', 'members'],
            order   : {field: 'clock', val: 'ASC'},
            limit   : 1,
            like    : {field:'sex', val:'男'},
            lt      : {field:'age', val:'26'},
            gt      : {field:'age', val:'26'}
        };
        */
    }
]);

