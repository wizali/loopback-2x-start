/**
 * Created by felix on 10/30/14.
 * All rights reserved, unauthorized use is strictly prohibited!!!
 */

(function(window, angular, undefined){

    /**
     * Define ome of the variables.
     * dictCache : The cache pool.
     * dictResource : Define the dict service.
     * includeName : When the query, the use of the relationship.
     * dictForeignKey: The use of foreign keys.
     * keyField: The use of key's field.
     * valueField: The use of value's field.
     * @type {{}}
     */

    var dictCache = {},
        dictResource,
        dictForeignKey = 'dict',
        optionsField = 'dictoptions',
        keyField = 'key',
        valueField = 'value';

    /**
     * Began to load the data dictionary.
     * @param dictlist
     * @returns {*}
     */
    function loadDataDictionary(dictlist){
        var existingList = [];
        // Whether or not to continue
        if(!angular.isArray(dictlist))
            return {err: "To load the data dictionary are failure!"};
        // Tectonic conditions.
        var querylist = [];
        angular.forEach(dictlist, function(item){
            // existing
            if(hasOwnDictionary(item)){
                existingList.push(dictCache[item]);
            }else{
                // save query.
                querylist.push(item);
            }
        });
        // Whether or not to continue
        if(!dictResource)
            return errorHandler("The resource of the dictionary is \"undefined\".");
        // do query.
        var promise;
        if(querylist.length){
            promise = dictResource.queryKey(null, querylist);
            promise.then(function(list){
                // To cache.
                angular.forEach(list.data, function(item){
                    dictCache[item[dictForeignKey]] = item;
                });
                // To join existing.
                if(existingList.length){
                    angular.forEach(existingList, function(item){
                        list.data[item[dictForeignKey]] = item;
                    });
                }
                return list;
            });
        }else{
            promise = {
                success: function(fun){
                    fun(existingList);
                    return promise;
                },
                error: function(fun){
                    fun(existingList);
                    return promise;
                }
            };
        }

        return promise;
    }

    /**
     * Get a dictionary entry value.
     * @param dict
     * @param value
     * @param showfield
     * @returns {*}
     */
    function getDictionaryValue(dict, val, showfield){
        var result;
        // To display the field.
        if(!angular.isDefined(showfield)) showfield = valueField;
        // The options list.
        if(hasOwnDictionary(dict)){
            var opts = dictCache[dict][optionsField];
            // found value.
            for (var i = 0; i < opts.length; i++) {
                if (opts[i][keyField] == val) {
                    result = opts[i][showfield];
                    break;
                }
            }
        }
        return result;
    }

    /**
     * The value of the dictionary entry exists.
     * @param dictName
     * @returns {*}
     */
    function hasOwnDictionary(dictName){
        if(!dictName || dictName === '')
            return errorHandler("The name of the dictionary is \"undefined\".");
        else
            return dictCache.hasOwnProperty(dictName);
    }

    /**
     * The error handler.
     * @param msg
     * @returns {{error: *}}
     */
    function errorHandler(msg){
        return {error: msg};
    }

    /**
     * Sign up for a sub module of the phoebe on the angular.
     * - Provide common dict.
     */

    angular.module('phoebe.dict', []).
        factory('PhoebeDict', PhoebeDictFactory).
        filter('dictFormat' , dictFormatFilter);

    /**
     * Registered the dict option operation's service on the phoebe.
     * @type {string[]}
     */
    PhoebeDictFactory.$inject = ['$phoebe', 'PhoebeResource'];
    function PhoebeDictFactory ($phoebe, PhoebeResource) {
        // Whether or not to continue
        if(!$phoebe.hasOwnProperty('dict'))
            return errorHandler("Phoebe load failure!");
        // When phoebe start, Get the configuration information.
        var dictConfig     = $phoebe.dict;

        if(dictConfig.hasOwnProperty('modelName')){
            dictResource       = new PhoebeResource('/' + dictConfig.modelName);
            dictResource.setInterface({
                queryKey: {
                    method: 'post'
                }
            });
        }

        if(dictConfig.hasOwnProperty('foreignKey'))
            dictForeignKey = (dictConfig.foreignKey) ? dictConfig.foreignKey : dictForeignKey;

        if(dictConfig.hasOwnProperty('optionsField'))
            optionsField = (dictConfig.optionsField) ? dictConfig.optionsField : optionsField;


        if(dictConfig.hasOwnProperty('keyField'))
            keyField = (dictConfig.keyField) ? dictConfig.keyField : keyField;

        if(dictConfig.hasOwnProperty('valueField'))
            valueField = (dictConfig.valueField) ? dictConfig.valueField : valueField;

        /**
         * The dictionary preloading method.
         * - The new load will be cached.
         * - If there are loaded, don't send the new request.
         * @param dictlist
         * @returns {*}
         */
        this.preload = function (dictlist){
            if(angular.isString(dictlist))
                dictlist = [dictlist];
            return loadDataDictionary(dictlist);
        };

        /**
         * Get the specified dictionary.
         * @param dict
         * @returns {*}
         */
        this.getDict = function (dict){
            if(hasOwnDictionary(dict))
                return dictCache[dict];
            else
                return this.preload(dict);
        };

        /**
         * Get a dictionary value.
         * - Support to get the value of the specified field.
         * - Default to get the 'value' field's value.
         * @param dict
         * @param value
         * @param showfield
         * @returns {string}
         */
        this.getDictValue = function (dict, value, showfield){
            var result;
            // existing
            if(hasOwnDictionary(dict))
                result = getDictionaryValue(dict, value, showfield);
            else
                result = errorHandler('Not found the value of \"' + value + '\" on the \"' + dict + '\"!');
            //
            return result;
        };
        /**
         *
         */
        this.getForeignKey = function(){
          return dictForeignKey;
        };
        // return.
        return this;
    }

    /**
     * The dictionary item filter.
     * @type {string[]}
     */
    dictFormatFilter.$inject = [];
    function dictFormatFilter () {
        return function (val, dict, showfield) {
            if(!val || !dict)
                return val;
            var result = getDictionaryValue(dict, val, showfield);
            return (result) ? result : val;
        };
    }

})(window, window.angular);