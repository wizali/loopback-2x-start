/**
 * Created by felix on 10/23/14.
 * All rights reserved, unauthorized use is strictly prohibited!!!
 */
(function(window, angular, undefined) {
    'use strict';
    /**
     * Define some of the event type of the controller.
     * @type {{DICT_LOADED: string, OPTION_LOADED: string}}
     */
    var Event = {
        DICT_LOADED: 'dictLoadingCompleted',
        OPTION_LOADED: 'optionLoadingCompleted',
        MODEL_LOADED: 'modelLoadingCompleted',
        MODEL_OPERATION: 'modelOperation'
    };
    var optype = {
        ADDING: 'adding',
        MODIFYING: 'modifying',
        SAVING: 'saving',
        SAVED: 'saved',
        REMOVING: 'removing',
        DELETED: 'deleted',
        BATCH_REMOVING: 'batchRemoving',
        BATCH_DELETED: 'batchDeleted',
        RESET: 'reset'
    };
    /**
     * Lots of the dictionaries are loading.
     * When all of some dictionary are loading completed, to broadcast event.
     * @param dicts
     * @param PhoebeDict
     * @param dataProvider
     * @param broadcastEvent
     */
    function loadingDictionary(dicts, PhoebeDict, dataProvider, broadcastEvent) {
        // Whether or not to continue.
        if (!dicts) return;
            // Start preloading to the dictionary.
            PhoebeDict.preload(dicts).success(function(data) {
                // Cache dictionary items in $scope.
                angular.forEach(data, function(item) {
                    var paramName = item[PhoebeDict.getForeignKey()];
                    dataProvider[paramName] = item;
                });
                // To broadcast the loading completed event.
                broadcastEvent(Event.DICT_LOADED, true);
            }).error(function(data) {
                dataProvider.error = data;
                // To broadcast the loading completed event.
                broadcastEvent(Event.DICT_LOADED, false);
            });
    }
    /**
     * Lots of the options are loading.
     * When all of some options are loading completed, to broadcast event.
     * @param options
     * @param PhoebeResource
     * @param q
     * @param dataProvider
     * @param resoure
     * @param broadcastEvent
     */
    var reg = new RegExp("[^/]+");

    function loadingOptionData(options, PhoebeResource, q, dataProvider, resoure, broadcastEvent) {
            // Whether or not to continue.
            if (angular.isArray(options)) {
                // Save lots of options data
                var vals = [];
                angular.forEach(options, function(opt) {
                    // The option handler.
                    if (opt.hasOwnProperty('model')) {
                        // To obtain the model name as a quote name.
                        var modelName = opt.model.match(reg)[0];
                        // Cache resoure service of the model.
                        resoure[modelName] = new PhoebeResource(opt.model, (opt.hasOwnProperty('PK')) ? opt.PK : undefined);
                        // 分支判断，如果拥有trigger属性
                        if (opt.hasOwnProperty('trigger')) {
                            // 创建可触发的options对象
                            if (opt.hasOwnProperty('name')) dataProvider[opt.name] = [];
                            // 在resoure中，增加可调用的触发器，以实现级联操作
                            resoure[opt.name + 'Trigger'] = function(id) {
                                if (opt.hasOwnProperty('wherestr')) {
                                    if (!opt.wherestr.hasOwnProperty('where')) {
                                        opt.wherestr.where = {};
                                    }
                                    opt.wherestr.where[opt.trigger] = id;
                                } else {
                                    var wherestr = {};
                                    wherestr.where = {};
                                    wherestr.where[opt.trigger] = id;
                                    opt.wherestr = wherestr;
                                }
                                // 发起请求
                                var promise = resoure[modelName].query(opt.wherestr);
                                promise.success(function(datalist) {
                                    dataProvider[opt.name] = datalist;
                                    dataProvider[opt.name].PK = resoure[modelName].pkfield;
                                });
                                return promise;
                            };
                        } else {
                            // 创建普通的options对象
                            // To joint where string.
                            var wherestr = {};
                            if (opt.hasOwnProperty('wherestr')) {
                                wherestr = opt.wherestr;
                            }
                            // To send request.
                            var promise = resoure[modelName].query(wherestr);
                            promise.success(function(datalist) {
                                if (opt.hasOwnProperty('name')) {
                                    dataProvider[opt.name] = datalist;
                                    dataProvider[opt.name].PK = resoure[modelName].pkfield;
                                }
                            });
                            // Save object of the promise.
                            vals.push(promise);
                        }
                    }
                });
                // All of the request of handler.
                var promise = q.all(vals);
                promise.then(function(datalist) {
                    broadcastEvent(Event.OPTION_LOADED, true);
                }, function(msg) {
                    broadcastEvent(Event.OPTION_LOADED, false);
                });
            } else {}
        }
        /**
         * 自动创建实体模型对象的可调用方法
         * @param resoure
         * @param modelName
         * @param dataSourceName
         * @param selectedItems
         * @param model
         * @param dataProvider
         * @param broadcast
         */
    function createCrudMethod(resoure, modelName, dataSourceName, selectedItems, model, dataProvider, broadcast, primaryKeyField) {
            // 定义各实体模型对象，在执行操作后的响应返回对象
            var response = {
                success: false, // 操作是否成功
                model: modelName, // 执行该操作的实体模型对象
                optype: null, // 已执行的操作的操作类型
                trigger: null, // 由哪个操作出发
                data: null // 无论操作成功还是失败，返回的结果数据
            };
            // 定义需要创建的CRUD方法
            var methodNames = {
                Add: addHandler, // 添加记录触发器
                Modify: modifyHandler, // 修改记录触发器
                Saving: savingHandler, // 执行保存记录操作
                Save: saveHandler, // 执行保存记录操作
                Reset: resetHandler, // 复位被编辑的记录对象
                Remove: removeHandler, // 移除记录触发器
                Delete: deleteHandler, // 执行删除记录操作
                MarkSelected: markSelectedHandler, // 对记录打选中标记
                BatchRemove: batchRemoveHandler, // 批量移除记录触发器
                BatchDelete: batchDeleteHandler, // 批量删除记录操作
                QueryData: queryDataHandler
            };
            // 在resoure里，为modelname实体对象模型注册可调用的方法
            angular.forEach(methodNames, function(val, key) {
                var callName = modelName + key;
                resoure[callName] = val;
            });
            // 为所有实体模型对象注册通用的下拉选单选中操作
            resoure.setSelected = selectedHandler;
            /**
             * Define a handler of select the operating.
             * @param fkval - 选中对象的外键id值
             * @param optionName  -  该选项从属于那个options，该options在preload阶段被初始化
             * @param includeName  - 该选项对应的关联实体对象
             */
            function selectedHandler(fkval, optionName, includeName) {
                    // 三个参数必须全部被引入
                    if (!angular.isDefined(fkval) || !angular.isDefined(optionName) || !angular.isDefined(includeName)) return;
                    // 如果在数据源列表中，找到了所属的options，则继续执行
                    if (dataProvider.hasOwnProperty(optionName)) {
                        // 从数据源列表中，找到被选中的数据，并缓存至数据源对应的数据源项的属性上，并建立于wherestr之间的关系，关系缓存在linkname中
                        for (var i = 0; i < dataProvider[optionName].length; i++) {
                            var pkfield = (dataProvider[optionName].PK) ? dataProvider[optionName].PK : 'id';
                            if (fkval == dataProvider[optionName][i][pkfield]) {
                                dataProvider[optionName].selectedItem = dataProvider[optionName][i];
                                dataProvider[optionName].linkname = includeName;
                                break;
                            }
                        }
                    }
                }
                /**
                 * Define a trigger of add the operating.
                 * 负责派发该ADDING事件
                 * 注意：如果该事件被标识为已处理，则直接触发保存操作
                 */
            function addHandler() {
                    resetHandler();
                    response.trigger = optype.ADDING;
                    response.optype = optype.ADDING;
                    broadcast(Event.MODEL_OPERATION, response);
                    /*var beforeEvent  = broadcast(Event.MODEL_OPERATION, response);
                    if(beforeEvent.defaultPrevented) {
                        saveHandler();
                    }*/
                }
                /**
                 * Define a trigger of modify the operating.
                 * 负责派发该MODIFYING事件
                 * 注意：如果该事件被标识为已处理，则直接触发保存操作
                 */
            var itemIndex; // 当前操作的选中
            function modifyHandler(index) {
                    itemIndex = index;
                    model[modelName] = angular.copy(model[dataSourceName][index]);
                    //
                    response.trigger = optype.MODIFYING;
                    response.optype = optype.MODIFYING;
                    response.index = index;
                    broadcast(Event.MODEL_OPERATION, response);
                    /*var beforeEvent  = broadcast(Event.MODEL_OPERATION, response);
                    if(beforeEvent.defaultPrevented) {
                        saveHandler();
                    }*/
                }
                /**
                 * The save mothed of the entity object.
                 * 默认提交model[modelName]对象进行保存
                 * 保存成功后，根据include的关系，找到对应的关联对象
                 * 对保存成功返回的数据，进行追加关联对象操作，最后派发保存成功事件
                 */
            function savingHandler() {
                response.optype = optype.SAVING;
                var beforeEvent = broadcast(Event.MODEL_OPERATION, response);
                if (beforeEvent.defaultPrevented) {
                    saveHandler();
                }
            }

            function saveHandler() {
                    // 保存数据
                    resoure[modelName].save([model[modelName]]).success(function(datalist) {
                        // 根据该实体模型的resoure对象中的wherestr中的include属性值，找到需要关联的目标对象，将其注册到保存成功对象中
                        if (resoure[modelName].hasOwnProperty('include')) {
                            angular.forEach(resoure[modelName].include, function(includeName) {
                                // 如果下拉选单未修改，则使用提交时的数据
                                datalist[0][includeName] = model[modelName][includeName];
                                // 如果下拉选单被修改，则查找选中的数据
                                for (var item in dataProvider) {
                                    if (dataProvider[item].hasOwnProperty('linkname')) {
                                        if (includeName == dataProvider[item].linkname) {
                                            // 如果值被改变，则赋值，否则原样输出
                                            if (dataProvider[item].selectedItem) {
                                                datalist[0][includeName] = dataProvider[item].selectedItem;
                                                // 复位
                                                dataProvider[item].selectedItem = null;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        var isModify = (response.trigger == optype.MODIFYING);
                        // 判断新增或是修改
                        if (isModify)
                        // 更新数据源列表
                            model[dataSourceName][itemIndex] = datalist[0];
                        else
                        // 更新数据源列表
                            model[dataSourceName].unshift(datalist[0]);
                        // 返回值赋值操作
                        response.success = true;
                        response.data = datalist[0];
                        // 复位表单
                        resetHandler();
                        response.optype = optype.SAVED;
                        broadcast(Event.MODEL_OPERATION, response);
                    }).error(function(msg) {
                        response.optype = optype.SAVED;
                        broadcast(Event.MODEL_OPERATION, response);
                    });
                }
                /**
                 * Define a trigger of remove the operating.
                 * 负责派发REMOVING事件
                 * 注意：如果该事件被标识为已处理，则直接触发删除操作
                 */
            function removeHandler(index) {
                    response.optype = optype.REMOVING;
                    response.index = index;
                    var beforeEvent = broadcast(Event.MODEL_OPERATION, response);
                    if (beforeEvent.defaultPrevented) {
                        deleteHandler(index);
                    }
                }
                // 删除操作处理器
            function deleteHandler(index) {
                    // 执行操作
                    resoure[modelName].delete([model[dataSourceName][index][primaryKeyField]]).success(function(datalist) {
                        response.success = true;
                        response.data = model[dataSourceName][index];
                        model[dataSourceName].splice(index, 1);
                    }).error(function(msg) {
                        response.success = false;
                        response.data = msg;
                    }).then(function() {
                        // 广播该模型的save操作
                        response.optype = optype.DELETED;
                        broadcast(Event.MODEL_OPERATION, response);
                    });
                }
                /**
                 * Define a trigger of batch remove the operating.
                 * 负责派发BATCH_REMOVING事件
                 * 注意：如果该事件被标识为已处理，则直接触发批量删除操作
                 */
                // 标记已选中的实体对象，并存放到对应实体对象模型中的selectedItems属性中
            function markSelectedHandler(selectedItem) {
                    var exists = model[selectedItems].indexOf(selectedItem);
                    if (exists < 0) {
                        model[selectedItems].push(selectedItem);
                    } else {
                        model[selectedItems].splice(exists, 1);
                    }
                }
                // 批量删除触发器
            function batchRemoveHandler() {
                    response.optype = optype.BATCH_REMOVING;
                    var beforeEvent = broadcast(Event.MODEL_OPERATION, response);
                    if (beforeEvent.defaultPrevented) {
                        batchDeleteHandler();
                    }
                }
                // 批量删除操作
            function batchDeleteHandler() {
                    // 是否继续
                    if (model[selectedItems].length === 0) return;
                    // 标记操作类型
                    response.optype = optype.DELETED;
                    // 整理待删除的数据list
                    var idx = [];
                    angular.forEach(model[selectedItems], function(selectedItem) {
                        if (selectedItem.hasOwnProperty(primaryKeyField)) idx.push(selectedItem[primaryKeyField]);
                    });
                    // 执行操作
                    resoure[modelName].delete(idx).success(function(datalist) {
                        // 更新列表
                        angular.forEach(model[selectedItems], function(item) {
                            var index = model[dataSourceName].indexOf(item);
                            model[dataSourceName].splice(index, 1);
                        });
                        // 复位选中列表
                        model[selectedItems] = [];
                        // 返回值赋值操作
                        response.success = true;
                        response.data = datalist;
                    }).error(function(msg) {
                        // 返回值赋值操作
                        response.success = false;
                        response.data = msg;
                    }).then(function() {
                        model[selectedItems] = [];
                        // 广播该模型的save操作
                        broadcast(Event.MODEL_OPERATION, response);
                    });
                }

                /**
                 * 2015-02-27 by wizaliu
                 * 在模型上添加query方法，传入一个json对象，配置分页的条件（page、rows），并且可以重新配置wherestr条件
                 */
            function queryDataHandler(c) {
                    var paginObj = c.pagination || undefined,
                        queryObj = c.wherestr || resoure[modelName].wherestr || {};
                    try{
                        //try to delete count property,if it has
                        delete(queryObj.count);  
                    }catch(e){}
                    
                    if (paginObj){
                        var page = paginObj.page;
                        var rows = paginObj.rows;
                        var limit = rows;
                        var skip = (page-1)*rows;
                        
                        queryObj.limit = limit;
                        queryObj.skip = skip;
                    } else {
                        delete(queryObj.limit);
                        delete(queryObj.skip);
                    }

                    resoure[modelName].query(queryObj).success(function(data) {
                        model[dataSourceName] = data;
                        response.success = true;
                        broadcast(Event.MODEL_LOADED, response);
                    }).error(function(msg) {
                        broadcast(Event.MODEL_LOADED, response);
                    });

                    //if pagination is defined,then query count
                    if (paginObj){
                        queryObj.count = true;

                        resoure[modelName].query(queryObj).success(function(data) {
                            resoure[modelName+'Count'] = data.count;
                            broadcast(Event.MODEL_LOADED, response);
                        }).error(function(msg) {
                            broadcast(Event.MODEL_LOADED, response);
                        });
                    }
                }

                /**
                 * 对已编辑的实体对象或已放弃编辑的实体对象进行复位操作
                 */
            function resetHandler() {
                model[modelName] = null;
                response.optype = optype.RESET;
                broadcast(Event.MODEL_OPERATION, response);
            }
        }
        /**
         * Sign up for a sub module of the phoebe on the angular.
         * - Provide common controller.
         */
    angular.module('phoebe.controller', []).service('PhoebeController', phoebeControllerService);
    /**
     * Registered the HTTP request service on the phoebe.
     * @type {string[]}
     */
    phoebeControllerService.$inject = ['PhoebeDict', 'PhoebeResource', '$q'];

    function phoebeControllerService(PhoebeDict, PhoebeResource, $q) {
        /**
         * Broadcast an event on the $scope.
         * @param type : The Event type provided by the 'Event' variables.
         * @param data : Portability data by event.
         */
        function broadcastEvent(type, data) {
                if (angular.isDefined(scope)) return scope.$broadcast(type, data);
            }
            /**
             * Define a method of the preloading.
             * The parameter of the 'key', now allow the two values, They are 'dict' and 'options'.
             * - The 'dict' parameter means to preload many dictionaries data.
             * - The 'options' parameter means to preload many options data.
             * The parameter of the 'config', This is a configuration information.
             * - Different 'key' has different configuration format.
             * @param key
             * @param config
             */
        function preload(key, config) {
                // 如果未同时传入键名和配置参数，将终止执行本次预加载过程
                if (!angular.isDefined(key) || !angular.isDefined(config)) return;
                // 分支判断，目前仅仅支持数据字典与下拉选单的预加载过程
                switch (key) {
                    case 'dict':
                        loadingDictionary(config, PhoebeDict, dataProvider, broadcastEvent);
                        break;
                    case 'options':
                        loadingOptionData(config, PhoebeResource, $q, dataProvider, resoure, broadcastEvent);
                        break;
                }
            }
            /**
             * Define a method to create the model object.
             * @param modelName
             * @param config
             */
        function createModel(modelName, config) {
                // 如果两个参数都不存在，则不执行创建过程
                if (!angular.isDefined(modelName) || !angular.isDefined(config)) return;
                // 如果配置参数中，没有model属性，则不执行创建过程
                if (config.hasOwnProperty('model')) {
                    var primaryKeyField = (config.hasOwnProperty('PK')) ? config.PK : 'id';
                    // 为将要创建的实体模型对象，定义引用名
                    var dataSourceName = modelName + 'DataSource'; // 为缓存的实体模型对象的列表数据，定义引用名
                    var selectedItems = modelName + 'SelectedItems'; // 为缓存被选中的实体模型对象数据，定义引用名
                    // 为将要创建的实体模型对象及其数据，创建缓存容器
                    model[modelName] = {}; // 初始化可编辑的实体对象
                    model[dataSourceName] = []; // 初始化第一次查询的实体对象列表，作为该实体模型对象的数据源
                    model[selectedItems] = []; // 初始化被选中的实体对象列表
                    // 为modelName，创建可调用服务端资源服务对象
                    var modelResource = new PhoebeResource(config.model, primaryKeyField);
                    // 是否有创建实体模型自定义接口的需要?
                    if (config.hasOwnProperty('interface')) {
                        // 判断是配置了一个还是多个自定义接口
                        var isMultiple = angular.isArray(config.interface);
                        // 在实体对象模型资源对象中注册自定义接口
                        if (isMultiple) {
                            angular.forEach(config.interface, function(face) {
                                modelResource.setInterface(face);
                            });
                        } else {
                            modelResource.setInterface(config.interface);
                        }
                    }
                    // 为创建号的实体对象的资源对象的第一次请求，拼接请求条件
                    var wherestr = (config.hasOwnProperty('wherestr')) ? config.wherestr : undefined;
                    // 定义请求返回的响应数据
                    var response = {
                        model: modelName,
                        success: false
                    };

                    //if pagination is defined, then add pagination condition

                    if (config.hasOwnProperty('pagination')){
                        var page = config.pagination.page;
                        var rows = config.pagination.rows;
                        var limit = rows;
                        var skip = (page-1)*rows;
                        if (limit && skip !== undefined){
                            wherestr.limit = limit;
                            wherestr.skip = skip;
                        }
                    }

                    // 执行查询
                    modelResource.query(wherestr).success(function(datalist) {
                        // 赋值操作
                        model[dataSourceName] = datalist;
                        // 缓存该模型的资源服务对象
                        resoure[modelName] = modelResource;
                        // 自动创建view层可调用的操作方法
                        createCrudMethod(resoure, modelName, dataSourceName, selectedItems, model, dataProvider, broadcastEvent, primaryKeyField);
                        // 返回结果赋值
                        response.success = true;
                        // 派发模型创建结束事件
                        broadcastEvent(Event.MODEL_LOADED, response);
                    }).error(function(msg) {
                        broadcastEvent(Event.MODEL_LOADED, response);
                    });

                    //if pagination is defined, then query count
                    if (config.hasOwnProperty('pagination')){
                        wherestr.count = true;
                        modelResource.query(wherestr).success(function(result) {
                            resoure[modelName+'Count'] = result.count;
                            response.success = true;
                            // 派发模型创建结束事件
                            broadcastEvent(Event.MODEL_LOADED, response);
                        }).error(function(msg) {
                            broadcastEvent(Event.MODEL_LOADED, response);
                        });
                    }

                }
            }
            /**
             * Define some open interface.
             * @param a
             * @returns {*}
             */
        var scope,
            dataProvider,
            model,
            resoure;
        // The constructor.
        function openInterface(scopeSource) {
                // 确认是否是scope对象
                if (angular.isObject(scopeSource) && scopeSource.hasOwnProperty('$id')) {
                    // 在scope对象中，创建三个容器，以用于缓存controller中所需的数据源与可调用方法
                    scope = scopeSource;
                    dataProvider = scope.$dataProvider = {}; // 数据源对象，用于存放缓存的字典项与下拉选单数据
                    model = scope.$model = {}; // 缓存得到的服务端资源对象，该类对象统称为实体模型对象
                    resoure = scope.$resoure = scope.$resource = {}; // 实体模型对象提供的可调用服务端接口

                }
            }
            // 将Controller中所派发的事件类型，以静态常量的方式开放
        angular.forEach(Event, function(value, key) {
            openInterface.prototype[key] = value;
        });
        // 将Controller中,创建的实体模型对象，所使用的操作类型以静态产量的方式开放
        openInterface.prototype.optype = optype;
        // 开放预加载接口.
        openInterface.prototype.preload = function(key, config) {
            preload(key, config);
            return this;
        };
        // 开放创建实体模型接口
        openInterface.prototype.createModel = function(model, config) {
            createModel(model, config);
            return this;
        };
        // return.
        return openInterface;
    }
})(window, window.angular, undefined);