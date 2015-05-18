/**
 * Created by felix on 10/20/14.
 * All rights reserved, unauthorized use is strictly prohibited!!!
 */
(function(window, angular, undefined) {
    'use strict';
    /**
     * General format request method.
     * - According to the feature of the loopback, processing to send the request.
     * @param wherestr
     * @returns {string}
     */
    function formatWhereString(wherestr) {
            var str = '';

            // contact foreignKey id.
            if (wherestr.hasOwnProperty('fkid') && angular.isString(wherestr.fkid)) {
                str += '/' + wherestr.fkid;
            }
            // contact One-to-many associative table.
            if (wherestr.hasOwnProperty('hasmany') && angular.isString(wherestr.hasmany)) {
                //str += '/'+ inflectionPluralize(wherestr.hasmany);
                str += '/' + wherestr.hasmany;
            }
            // The where string concatenation.
            if (angular.isDefined(wherestr.where)) {
                var logic = 'and';
                if (angular.isDefined(wherestr.where.logic)) {
                    if (wherestr.where.logic == 'and') logic = 'and';
                    if (wherestr.where.logic == 'or') logic = 'or';
                }
                var count = 0;
                angular.forEach(wherestr.where, function(val, key) {
                    if (key != 'logic') {
                        str += (str.indexOf('?') === -1) ? '?' : '&';
                        if (Object.keys(wherestr.where).length === 1) {
                            //如果是查询总数的wherestr，则每一个where条件要写成"[where][xxx]=xxx"的形式
                            //如果不是查询总数的wherestr，则每个where条件要写成"filter[where][xxx]=xxx"的形式
                            if (wherestr.count){
                                str += 'where[' + key + ']=' + val;
                            } else {
                                str += 'filter[where][' + key + ']=' + val;
                            }
                        } else {
                            if (wherestr.count){
                                str += 'where[' + logic + '][' + count + '][' + key + ']=' + val;
                            } else {
                                str += 'filter[where][' + logic + '][' + count + '][' + key + ']=' + val;
                            }
                            
                        }
                        count++;
                    }
                });
            }
            // The where or eg: {or:[{fieldname: fieldval},{fieldname2:fieldval2}]}
            if (angular.isDefined(wherestr.or) && angular.isArray(wherestr.or)) {
                angular.forEach(wherestr.or, function(item, index) {
                    angular.forEach(item, function(val, key) {
                        str += (str.indexOf('?') === -1) ? '?' : '&';
                        str += 'filter[where][or][' + index + '][' + key + ']=' + val;
                    });
                });
            }
            // the where and
            if (angular.isDefined(wherestr.and) && angular.isArray(wherestr.and)) {
                angular.forEach(wherestr.and, function(item, index) {
                    angular.forEach(item, function(val, key) {
                        str += (str.indexOf('?') === -1) ? '?' : '&';
                        str += 'filter[where][and][' + index + '][' + key + ']=' + val;
                    });
                });
            }
            // the where not
            if (angular.isDefined(wherestr.neq) && angular.isArray(wherestr.neq)) {
                angular.forEach(wherestr.neq, function(item, index) {
                    angular.forEach(item, function(val, key) {
                        str += (str.indexOf('?') === -1) ? '?' : '&';
                        str += 'filter[where][and][' + index + '][' + key + '][neq]=' + val;
                    });
                });
            }
            // The include string concatenation.
            if (angular.isArray(wherestr.include)) {
                angular.forEach(wherestr.include, function(item) {
                    str += (str.indexOf('?') === -1) ? '?' : '&';
                    str += 'filter[include]=' + item;
                });
            }
            // The between string concatenation.
            if (angular.isDefined(wherestr.between) && (Object.keys(wherestr.between).length > 1 && angular.isArray(wherestr.between.val))) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[where][' + wherestr.between.field + '][between][0]=' + wherestr.between.val[0];
                str += '&filter[where][' + wherestr.between.field + '][between][1]=' + wherestr.between.val[1];
            }
            // The order string concatenation.
            if (angular.isDefined(wherestr.order)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                if (angular.isDefined(wherestr.order.field)) {
                    str += 'filter[order]=' + wherestr.order.field;
                }
                if (angular.isDefined(wherestr.order.val)) {
                    str += ' ' + wherestr.order.val;
                } else {
                    str += ' DESC';
                }
            }
            // The limit string concatenation.
            if (angular.isNumber(wherestr.limit)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[limit]=' + wherestr.limit;
            }
            // The skip string condition
            if (angular.isNumber(wherestr.skip)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[skip]=' + wherestr.skip;
            }
            // The like string concatenation.
            if (angular.isDefined(wherestr.like) && angular.isDefined(wherestr.like.field) && angular.isDefined(wherestr.like.val)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[where][' + wherestr.like.field + '][like]=' + wherestr.like.val;
            }
            // The lt string concatenation.
            if (angular.isDefined(wherestr.lt) && angular.isDefined(wherestr.lt.field) && angular.isDefined(wherestr.lt.val)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[where][' + wherestr.lt.field + '][lt]=' + wherestr.lt.val;
            }
            // The gt string concatenation.
            if (angular.isDefined(wherestr.gt) && angular.isDefined(wherestr.gt.field) && angular.isDefined(wherestr.gt.val)) {
                str += (str.indexOf('?') === -1) ? '?' : '&';
                str += 'filter[where][' + wherestr.gt.field + '][gt]=' + wherestr.gt.val;
            }
            // return wherestr.
            return str;
        }
        /**
         * Converting pluralize for the name of the table.
         * - Parameters: This modelname is database table name.
         * @param modelName ： 模型名称，通常为单数
         */
    function formatModelName(modelName) {
            var reg = new RegExp("[^/]+");
            var apiname = modelName.match(reg)[0];
            return modelName.replace(apiname, inflectionPluralize(apiname));
        }
        // 单词进行单数转换复数
    function inflectionPluralize(word) {
            return inflection.pluralize(word);
        }
        /**
         * The general method of sending concurrent request.
         * - When all the requests are response, returns a promise object.
         * @param $q
         * @param vals
         * @returns {Promise}
         */
    function concurrentHanler($q, vals) {
            // Concurrent requests.
            var promise = $q.all(vals);
            // To define a callback for the success.
            promise.success = function(callback) {
                promise.then(function(reslist) {
                    var datalist = [];
                    angular.forEach(reslist, function(res) {
                        if (res.data === '') datalist.push(res.status);
                        else datalist.push(res.data);
                    });
                    callback(datalist);
                });
                return promise;
            };
            // To define a callback for the error.
            promise.error = function(callback) {
                promise.then(null, function(reslist) {
                    var errs = [];
                    angular.forEach(reslist, function(res) {
                        errs.push(res.status);
                    });
                    callback(errs);
                });
                return promise;
            };
            return promise;
        }
        /**
         * The general method of sending chain request.
         * - Returns the request of the promise object.
         * @param promise
         * @returns {*}
         */
    function chainRequest(promise) {
            promise.then(function(success) {
                successHandler(success);
            }, function(error) {
                errorHandler(error);
            });
            return promise;
        }
        /**
         * The success of the default response handler.
         * - when after The success of the response to calls.
         * @param res
         * @returns {*}
         */
    function successHandler(res) {
            return res;
        }
        /**
         * The failure of the default response handler.
         * - when after The failure of the response to calls.
         * @param er
         * @returns {string}
         */
    function errorHandler(er) {
            var msg;
            switch (er.status) {
                case 404:
                    msg = '请求的远端服务不存在!';
                    break;
                case 500:
                    msg = '请求的远程服务出错！';
                    break;
            }
            console.log('[http request error]: ' + msg);
        }
        /**
         * Sign up for a sub module of the phoebe on the angular.
         * - Provide common services for sent HTTP request.
         */
    angular.module('phoebe.httpService', []).config(configuration).factory('PhoebeHttpService', httpService);
    /**
     * Intercept to Send the request.
     */
    configuration.$inject = ['$httpProvider'];

    function configuration($httpProvider) {
            /*$httpProvider.defaults.transformRequest.push(function(data, headersGetter){
                    console.log(data);
                    return data;
                });*/
        }
        /**
         * Registered the HTTP request service on the phoebe.
         * @type {string[]}
         */
    httpService.$inject = ['$http', '$q', '$phoebe'];

    function httpService($http, $q, $phoebe) {
            if (!$phoebe.hasOwnProperty('serverUrl')) return "Phoebe load failure!";
            /**
             * 查询方法，支持单表、多表、中间表查询
             * apistr为必传参数，类型为String. eg：'/family', '/family/count', '/family/customInterface'
             * wherestr为可选参数, 该参数类型为Object.
             * eg:
             * var wherestr = {
             *  fkid   : '5F94727343fhjdu4',
             *  hasmany: 'car',
             *  where  : {logic:'and', zip: 750001}          // where条件，支持并列和或者关系，个定义多个条件
             *  between: {field: 'zip', val: ['750000', '750010']},
             *  include: ['cars', 'members'],
             *  order  : {field: 'clock', val:'ASC'},
             *  limit  : 1,
             *  like   : {field:'sex', val:'男'},
             *  lt     : {field:'age', val:'26'},
             *  gt     : {field:'age', val:'26'}
             * }
             * @param api
             * @param wherestr
             * @returns {*}
             */
            function find(apistr, wherestr) {
                    if (!angular.isString(apistr) || apistr === '') return;
                    // Concat the apiurl.
                    var apiURL = $phoebe.serverUrl + formatModelName(apistr);

                    if (angular.isObject(wherestr) && !angular.isArray(wherestr)){
                        // count condition
                        if (wherestr.hasOwnProperty('count')){
                            apiURL += '/count';
                        }
                        apiURL += formatWhereString(wherestr);
                    }

                    return chainRequest($http.get(apiURL));
                }
                /**
                 * 添加记录方法，支持单条和批量添加，支持自定义接口
                 * apistr为必传参数， 类型为String. eg：'/family', '/family/count', '/family/customInterface'
                 * addlist为必传参数, 类型为Array，可传入单个或多条记录. eg: PhoebeService.create('/family', [item1, item2, item3])
                 * @param apistr
                 * @param addlist
                 * @returns {*}
                 */
            function create(apistr, addlist) {
                    if (!angular.isString(apistr) || apistr === '') return;
                    if (!angular.isArray(addlist)) return;
                    // Concat the apiurl.
                    var apiurl = $phoebe.serverUrl + formatModelName(apistr);
                    return chainRequest($http.post(apiurl, addlist));
                }
                /**
                 * 更新记录方法，支持单条和批量更新，支持自定义接口
                 * apistr为必传参数， 类型为String. eg：'/family', '/family/customInterface'
                 * updatelist为必传参数, 类型为Array，可传入单个或多条记录. eg: PhoebeService.update('/family', [item1, item2, item3])
                 * @param apistr
                 * @param updatelist
                 * @returns {{success: success, error: error}}
                 */
            function update(apistr, updatelist, pkfield) {
                    // start
                    if (!angular.isString(apistr) || apistr === '') return;
                    if (!angular.isArray(updatelist)) return;
                    // Concat the apiurl.
                    var apiurl = $phoebe.serverUrl + formatModelName(apistr);
                    // define a container for each request return value.
                    var vals = [];
                    // Send some of the request.
                    angular.forEach(updatelist, function(updateItem) {
                        vals.push($http.put(apiurl, updateItem));
                    });
                    return concurrentHanler($q, vals);
                }
                /**
                 * 删除记录方法，支持单条和批量更新，支持自定义接口
                 * apistr为必传参数， 类型为String. eg：'/family', '/family/customInterface'
                 * destroyIdlist为必传参数, 类型为Array，可传入单个或多条记录的ID. eg: PhoebeService.destroy('/family', ["1111", "2222", "3333"])
                 * @param apistr
                 * @param destroyIdlist
                 * @returns {Promise}
                 */
            function destroy(apistr, destroyIdlist) {
                if (!angular.isString(apistr) || apistr === '') return;
                // Concat the apiurl.
                var apiurl = $phoebe.serverUrl + formatModelName(apistr);
                // Define a container for each request return value.
                function getDestroyListPromise(removelist) {
                        // define a container for each request return value.
                        var result = [];
                        // Send some of the request.
                        angular.forEach(removelist, function(removeitem) {
                            var poie;
                            if (angular.isString(removeitem)) poie = $http.delete(apiurl + '/' + removeitem);
                            else if (angular.isObject(removeitem)) poie = $http.delete(apiurl + '/' + removeitem.id);
                            result.push(poie);
                        });
                        return result;
                    }
                    // Judge, by id or by wherestr.
                if (angular.isArray(destroyIdlist)) {
                    return concurrentHanler($q, getDestroyListPromise(destroyIdlist));
                } else if (angular.isObject(destroyIdlist)) {
                    // After the request completed of the success handler.
                    var successHandler;
                    // After the request completed of the failure handler
                    var errorHandler;
                    // Execute.
                    var promise = find(apistr, destroyIdlist);
                    // Save the callback methods;
                    promise.success = function(callback) {
                        successHandler = callback;
                        return promise;
                    };
                    promise.error = function(callback) {
                        errorHandler = callback;
                        return promise;
                    };
                    // The request processing.
                    promise.then(function(successPromise) {
                        // Find some data to remove.
                        var removeList = successPromise.data;
                        // Concurrent execution delete operation.
                        promise = $q.all(getDestroyListPromise(removeList));
                        // To callback
                        promise.then(function(reslist) {
                            // To wash data.
                            var statuslist = [];
                            angular.forEach(reslist, function(res) {
                                statuslist.push(res.status);
                            });
                            // return;
                            successHandler(statuslist);
                        }, function(reslist) {
                            // To wash data.
                            var statuslist = [];
                            angular.forEach(reslist, function(res) {
                                statuslist.push(res.status);
                            });
                            // return;
                            errorHandler(statuslist);
                        });
                    });
                    return promise;
                }
            }

            function customInterface(apistr, method, isPath, wherestr, reqdata) {
                    if (!angular.isString(apistr) || apistr === '') return;
                    // Concat the apiurl.
                    var apiurl = $phoebe.serverUrl + formatModelName(apistr);
                    // Add query conditions.
                    if (angular.isObject(wherestr) && !angular.isArray(wherestr)) {
                        apiurl += formatWhereString(wherestr);
                    }
                    // send request.
                    var request;
                    if (isPath) {
                        apiurl = apiurl + "/" + reqdata;
                        switch (method.toLowerCase()) {
                            case 'get':
                                request = $http.get(apiurl);
                                break;
                            case 'put':
                                request = $http.put(apiurl);
                                break;
                            case 'post':
                                request = $http.post(apiurl);
                                break;
                            case 'del':
                                request = $http.delete(apiurl);
                                break;
                            case 'delete':
                                request = $http.delete(apiurl);
                                break;
                        }
                    } else {
                        switch (method.toLowerCase()) {
                            case 'get':
                                request = $http.get(apiurl);
                                break;
                            case 'put':
                                request = $http.put(apiurl, reqdata);
                                break;
                            case 'post':
                                request = $http.post(apiurl, reqdata);
                                break;
                            case 'del':
                                request = $http.delete(apiurl, reqdata);
                                break;
                            case 'delete':
                                request = $http.delete(apiurl, reqdata);
                                break;
                        }
                    }
                    // return
                    return chainRequest(request);
                }
                /**
                 * Define some open interface.
                 * 定义一些开放接口
                 * @constructor
                 */
                // The constructor.
            function HttpServiceFactory() {}
                // define find api.
            HttpServiceFactory.find = function(api, where) {
                return find(api, where);
            };
            // define create api.
            HttpServiceFactory.create = function(api, addlist) {
                return create(api, addlist);
            };
            // define update api.
            HttpServiceFactory.update = function(api, list, pkfield) {
                return update(api, list, pkfield);
            };
            // define destroy api.
            HttpServiceFactory.destroy = function(api, destroyIdlist) {
                return destroy(api, destroyIdlist);
            };
            //
            HttpServiceFactory.customInterface = function(api, method, isPath, where, reqdata) {
                return customInterface(api, method, isPath, where, reqdata);
            };
            // return.
            return HttpServiceFactory;
        }
        /**
         * Sign up for a sub module of the phoebe on the angular.
         * - Converts the server-side entity object to the front of physical resources.
         */
    angular.module('phoebe.resource', []).factory('PhoebeResource', modelResource);
    /**
     * Registered the model resource service on the phoebe.
     * @type {string[]}
     */
    var resourceList = {};

    function hasOwnResource(url) {
        return resourceList.hasOwnProperty(url);
    }
    modelResource.$inject = ['PhoebeHttpService'];

    function modelResource(PhoebeHttpService) {
        function clearSaveData(list, params) {
                var clearedList = [];
                // Start this clear.
                angular.forEach(list, function(item) {
                    angular.forEach(params, function(param) {
                        if (item.hasOwnProperty(param)) delete item[param];
                    });
                    clearedList.push(item);
                });
                // finish this clear.
                return clearedList;
            }
            /**
             * Define some open interface.
             * 定义一些开放接口
             * @param url
             * @constructor
             */
            // The constructor.
        function ResourceFactory(url, PKField) {
                if (hasOwnResource(url)) {
                    return resourceList[url];
                } else {
                    this.url = url;
                    this.include = null;
                    this.wherestr = null;
                    this.pkfield = (PKField) ? PKField : 'id';
                    resourceList[this.url] = this;
                }
            }
            // Grafting prototype.
        ResourceFactory.prototype.query = function(wherestr) {
            // Save the data need to be cleaned.
            if (angular.isObject(wherestr)) {
                this.include = wherestr.include;
                this.wherestr = wherestr;
            }

            return PhoebeHttpService.find(this.url, wherestr);
        };
        //
        ResourceFactory.prototype.save = function(items) {
            items = angular.copy(items);
            // The cleared list.
            if (this.include) items = clearSaveData(items, this.include);
            return PhoebeHttpService.update(this.url, items, this.pkfield);
        };
        //
        ResourceFactory.prototype.delete = function(ids) {
            ids = angular.copy(ids);
            return PhoebeHttpService.destroy(this.url, ids);
        };
        ResourceFactory.prototype.setInterface = function(config) {
            var parent = this;
            angular.forEach(config, function(cfg, interfaceName) {
                parent[interfaceName] = function(wherestr, reqdata) {
                    //
                    var reqApiUrl = this.url + '/' + interfaceName;
                    var methodval = (cfg.hasOwnProperty('method')) ? cfg.method : 'get';
                    var isPathParam = (cfg.hasOwnProperty('path')) ? cfg.path : false;
                    //
                    return PhoebeHttpService.customInterface(reqApiUrl, methodval, isPathParam, wherestr, reqdata);
                };
            });
            // 缓存
            resourceList[this.url] = this;
            return this;
        };
        return ResourceFactory;
    }
})(window, window.angular);