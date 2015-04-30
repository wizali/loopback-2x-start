/**
 * Created by felix on 10/17/14.
 * All rights reserved, unauthorized use is strictly prohibited!!!
 */

(function (window, angular, undefined) {

    'use strict';

    /**
     * Some dependent module of the phoebe.
     * - Please note that the loading sequence.
     * - You sould define it like this: {mainModuleName}.{subModuleName}
     * @type {string[]}
     */
    var dependencies = [
        'phoebe.utils',
        'phoebe.httpService',
        'phoebe.resource',
        'phoebe.dict',
        'phoebe.controller',
    ];

    /**
     * Some of the global static constants of the phoebe.
     * - These of the constants value are can't be changed.
     * - These values are often used in configuration phase.
     * - You sould define it like this: {parameterName} : {parameterValue}
     * @type {{}}
     */
    var cons = {};

    /**
     * Some global variables of the phoebe.
     * - These of the variables are can be changed.
     * - These values are often used in operation phase.
     * - You sould define it like this: {parameterName} : {parameterValue}
     * @type {{}}
     */
    var context = {};


    /**
     * Sign up for a core module of the phoebe on the angular.
     */
    angular.module('phoebe', dependencies).constant('PhoebeCons', cons).value('PhoebeContext', context).
        config(initConfigurationPhase).
        provider('$phoebe', $phoebe).
        run(initOperationPhase).
        directive('levelOne',['$compile',function($compile){
            return {
                restrict:'E',
                scope:true,
                transclude: 'tEle',
                compile:function(tEle,tAttrs,trans){
                    console.log('compile→'+'levelOne'+tEle.html());
                    return {
                        pre:function(scope,iEle,iAttrs){
                            console.log('pre→'+'levelOne'+iEle.html());
                        },
                        post:function(scope,iEle,iAttrs){
                            iEle.append('<level:two></level:two>');
                            $compile(iEle);
                            console.log('post→'+'levelOne'+iEle.html());
                        }
                    };
                }
            };
        }]).directive('levelTwo',function(){
        return {
            restrict:'E',
            scope: true,
            transclude: 'tEle',
            compile:function(tEle,tAttrs,trans){
                tEle.append('<level:three></level:three>');
                console.log('compile→'+'levelTwo'+tEle.html());
                return {
                    pre:function(scope,iEle,iAttrs){
                        console.log('pre→'+'levelTwo'+iEle.html());
                    },
                    post:function(scope,iEle,iAttrs){
                        console.log('post→'+'levelTwo'+iEle.html());
                    }
                };
            }
        };
    }).directive('levelThree',function(){
        return {
            restrict:'E',
            template    : 'hello,111111',
            scope:true,
            transclude: 'tEle',
            compile:function(tEle,tAttrs,trans){
                console.log('compile→'+'levelThree'+tEle.html());
                return {
                    pre:function(scope,iEle,iAttrs){
                        console.log('pre→'+'levelThree'+iEle.html());
                    },
                    post:function(scope,iEle,iAttrs){
                        console.log('post→'+'levelThree'+iEle.html());
                    }
                };
            }
        };
    });

    /**
     * Perform the configuration phase of the work.
     */
    
    function initConfigurationPhase () {

    }
    initConfigurationPhase.$inject = [];

    /**
     * Perform the configuration phase of the work.
     */
    initOperationPhase.$inject = [];
    function initOperationPhase () {

    }

    /**
     * Create Phoebe's service.
     */
    $phoebe.$inject = [];
    function $phoebe(){
        /**
         * Cache configuration information.
         * @type {{}}
         */
        var initList = {};
        this.$get = function(){
            return initList;
        };

        /**
         * When phoebe start, inject the necessary configuration information.
         * The injection process can only be done in the config method.
         * @param module
         * @param config
         * @returns {$phoebe}
         */
        this.preinit = function(module, config){
            // Save the config info.
            if(angular.isDefined(module) && angular.isDefined(config)){
                initList[module] = config;
            }
            return this;
        };
    }

})(window, window.angular);