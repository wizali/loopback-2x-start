/**
 * Created by felix on 10/17/14.
 * All rights reserved, unauthorized use is strictly prohibited!!!
 */

(function(window, angular, undefined) {

    'use strict';

    /**
     * Sign up for a sub module of the phoebe on the angular.
     * - The client universal tool.
     */
    angular.module('phoebe.utils', []).
        provider('DateFormat'    , DateFormatProvider).
        provider('MeasureFormat' , MeasureFormatProvider).
        filter('dateFormat'      , dateFormatFilter).
        filter('measureFormat'   , measureFormatFilter).
        factory('Map',             mapService);

    /**
     * 日期转换，于date过滤器的唯一区别，就是该日期，支持10位自1970年的秒数转换
     */
    dateFormatFilter.$inject = ['DateFormat'];
    function dateFormatFilter(DateFormat) {
        return function (val, format) {
            if (!format || '') format = 'yyyy-MM-dd';
            var reg = new RegExp("^[0-9]*$");
            if (reg.test(val) && val.toString().length === 10) {
                val = val * 1000;
            }
            return DateFormat.getDate(val, format);
        };
    }

    /**
     * 大小计算，目前支持两种单位，byte于hz的大小转换，其中，只处理数字，对于由字母组成的值则原样输出
     */
    measureFormatFilter.$inject = ['MeasureFormat'];
    function measureFormatFilter(MeasureFormat) {
        return function (val, decimals, startUnit, unit) {
            val = Number(val);
            unit = (unit) ? unit : 'byte';
            decimals = (decimals) ? decimals : 1;
            var result;
            var reg = new RegExp("^[0-9]*$");
            if (reg.test(val)) {
                switch (unit) {
                    case 'byte' :
                        result = MeasureFormat.toByteConv(val, startUnit, decimals);
                        break;
                    case 'hz'   :
                        result = MeasureFormat.toFrequencyConv(val, startUnit, decimals);
                        break;
                }
            } else {
                result = val;
            }
            return result;
        };
    }

    /**
     * 日期格式化工具
     * @constructor
     */
    function DateFormatProvider () {
        /**
         * Get a instance by this method.
         * @returns {*}
         */
        this.$get = function () {
            return this;
        };
        /**
         * Format to seconds.
         * @param ms - 传入毫秒数或秒数
         * @returns {*}
         */
        this.toSeconds = function (ms) {
            if (!ms) return 0;
            if (ms.toString().length == 13) {
                ms = Math.floor(ms / 1000);
            } else if (ms.toString().length == 10) {
                ms = ms * 1000;
            }
            return ms;
        };
        /**
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * 例子：
         * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
         * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
         * @param date  , 传入的日期对象或日期字符串或毫秒数
         * @param str   , 日期的格式
         * @returns String
         */
        this.getDate = function (date, str) {
            //
            if (date) {
                date = new Date(date);
            } else {
                date = new Date();
            }
            //
            if (!str)  str = "yyyy-MM-dd hh:mm:ss.S [T]";

            var o = {
                "M+": date.getMonth() + 1,                 //月份
                "d+": date.getDate(),                    //日
                "h+": date.getHours(),                   //小时
                "m+": date.getMinutes(),                 //分
                "s+": date.getSeconds(),                 //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds(),            //毫秒
                "T": date.getTime()                     //自1970年以来的毫秒数
            };
            if (/(y+)/.test(str))
                str = str.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(str))
                    str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return str;
        };
        /**
         * Get the today of the time-interval.
         * @returns {{}}
         */
        this.getTodayTimeInterval = function () {
            var result = {};
            // get 0 o'clock
            var sdate = new Date();
            sdate.setHours(0, 0, 0, 0);
            result.startTime = sdate.getTime();
            //console.log(sdate.getFullYear(),sdate.getMonth()+1,sdate.getDate(),sdate.getHours(),sdate.getMinutes(),sdate.getSeconds(),sdate.getMilliseconds());
            // get 24 o'clock
            var cdate = new Date();
            cdate.setHours(24, 0, 0, 0);
            result.endTime = cdate.getTime();
            //console.log(cdate.getFullYear(),cdate.getMonth()+1,cdate.getDate(),cdate.getHours(),cdate.getMinutes(),cdate.getSeconds(),cdate.getMilliseconds());
            return result;
        };
        /**
         * Get first and last days of the this month.
         * @returns {{}}
         */
        this.getMonthTimeInterval = function () {
            var result = {};
            // get the first day of this month.
            var sdate = new Date();
            sdate.setDate(1);
            sdate.setHours(0, 0, 0, 0);
            result.startTime = sdate.getTime();
            //console.logend(sdate.getFullYear(),sdate.getMonth()+1,sdate.getDate(),sdate.getHours(),sdate.getMinutes(),sdate.getSeconds(),sdate.getMilliseconds());
            // get the last day of this month.
            var cdate = new Date();
            cdate.setMonth(cdate.getMonth() + 1, 0);
            cdate.setHours(24, 0, 0, 0);
            result.endTime = cdate.getTime();
            //console.log(cdate.getFullYear(),cdate.getMonth()+1,cdate.getDate(),cdate.getHours(),cdate.getMinutes(),cdate.getSeconds(),cdate.getMilliseconds());
            return result;
        };
        /**
         * Get first and last days of the this year.
         * @returns {{}}
         */
        this.getYearTimeInterval = function () {
            var result = {};
            // get the first day of this year.
            var sdate = new Date();
            sdate.setMonth(0, 1);
            sdate.setHours(0, 0, 0, 0);
            result.startTime = sdate.getTime();
            //console.log(sdate.getFullYear(),sdate.getMonth()+1,sdate.getDate(),sdate.getHours(),sdate.getMinutes(),sdate.getSeconds(),sdate.getMilliseconds());
            // get the last day of this year.
            var cdate = new Date();
            cdate.setMonth(12, 0);
            cdate.setHours(24, 0, 0, 0);
            result.endTime = cdate.getTime();
            //console.log(cdate.getFullYear(),cdate.getMonth()+1,cdate.getDate(),cdate.getHours(),cdate.getMinutes(),cdate.getSeconds(),cdate.getMilliseconds());
            return result;
        };
        // Get weekdate.
        /**
         * Get first and last days of the this week.
         * @returns {{}}
         */
        this.getWeekTimeInterval = function () {
            var issunday = (new Date().getDay() === 0) ? true : false;
            var result = {};
            // get the first day of this week.
            var sdate = new Date();
            if (issunday) {
                sdate.setDate(sdate.getDate() - 6);
                sdate.setHours(0, 0, 0, 0);
            } else {
                sdate.setDate(sdate.getDate() - sdate.getDay() + 1);
                sdate.setHours(0, 0, 0, 0);
            }
            //console.log(sdate.getFullYear(),sdate.getMonth()+1,sdate.getDate(),sdate.getHours(),sdate.getMinutes(),sdate.getSeconds(),sdate.getMilliseconds());
            result.startTime = sdate.getTime();
            // get the last day of this week.
            var cdate = new Date();
            if (issunday) {
                cdate.setHours(24, 0, 0, 0);
            } else {
                cdate.setDate(sdate.getDate() + (7 - sdate.getDay()));
                cdate.setHours(24, 0, 0, 0);
            }
            //console.log(cdate.getFullYear(),cdate.getMonth()+1,cdate.getDate(),cdate.getHours(),cdate.getMinutes(),cdate.getSeconds(),cdate.getMilliseconds());
            result.endTime = cdate.getTime();
            return result;
        };
    }

    /**
     * 尺寸数据格式化工具
     * @constructor
     */
    function MeasureFormatProvider() {

        /**
         * Get a instance by this method.
         * @returns {*}
         */
        this.$get = function () {
            return this;
        };
        /**
         * Formatted as percentage.
         * @param num ,待格式化的数字
         * @returns {number}
         */
        this.toUtilization = function (num) {
            if (!num) return 0;
            return (num / 100).toFixed(1);
        };
        /**
         * 单位计算，支持定义消暑保留长度，定义起始和目标单位，按1024自动进位
         * @param size ,大小计数
         * @param unit ,计数单位， 默认为字节B
         * @param decimals ,小数点后保留的位数，默认保留一位
         * @param targetUnit, 转换的目标单位， 默认自动进位
         * @param units , 单位集合
         */
        this.sizeConversion = function (size, unit, decimals, targetUnit, units) {
            if (!size) return 0;
            // Set default value.
            unit = (unit) ? unit : units[0];
            decimals = (decimals) ? decimals : 1;
            targetUnit = (targetUnit) ? targetUnit : 'auto';
            var theUnit = units.indexOf(unit);
            // Whether auto carry.
            if (targetUnit != 'auto')
                targetUnit = units.indexOf(targetUnit);
            // To conversion
            while (size >= 1024) {
                size /= 1024;
                theUnit++;
                if (theUnit == targetUnit)
                    break;
            }
            return size.toFixed(decimals) + units[theUnit];
        };
        /**
         * 容量计算
         * @param size
         * @param unit
         * @param decimals
         * @param targetUnit
         * @returns {string}
         */
        this.toByteConv = function (size, unit, decimals, targetUnit) {
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
            return this.sizeConversion(size, unit, decimals, targetUnit, units);
        };
        /**
         * 主频计算
         * @param size
         * @param unit
         * @param decimals
         * @param targetUnit
         * @returns {string}
         */
        this.toFrequencyConv = function (size, unit, decimals, targetUnit) {
            var units = ['Hz', 'KHz', 'MHz', 'GHz', 'THz', 'PHz', 'EHz'];
            return this.sizeConversion(size, unit, decimals, targetUnit, units);
        };

    }

    /**
     * MAP对象，实现MAP功能
     *
     * 接口：
     * size()     获取MAP元素个数
     * isEmpty()    判断MAP是否为空
     * clear()     删除MAP所有元素
     * put(key, value)   向MAP中增加元素（key, value)
     * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
     * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
     * each(callback)  遍历Map,执行处理函数
     * entrys()        获取键值数组
     * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
     * hasOwnKey(key)  判断MAP中是否含有指定KEY的元素
     * hasOwnValue(value) 判断MAP中是否含有指定VALUE的元素
     * values()    获取MAP中所有VALUE的数组（ARRAY）
     * keys()     获取MAP中所有KEY的数组（ARRAY）
     * toString()
     *
     * 例子：
     * var map = new Map();
     *
     * map.put("key", "value");
     * var val = map.get("key")
     * ……
     *
     */
    function mapService(){

        function mapFactory(object){

            /** 存放键的数组(遍历用到) */
            this.keys = [];
            /** 存放数据 */
            this.values = {};

            // format object to map.

            /**
             * 放入一个键值对
             * @param {String} key
             * @param {Object} value
             */
            this.put = function(key, value) {

                if(!this.hasOwnKey(key)){
                    this.keys.push(key);
                }
                this.values[key] = value;
            };

            /**
             * 获取某键对应的值
             * @param {String} key
             * @return {Object} value
             */
            this.get = function(key) {
                return this.values[key];
            };

            /**
             * 删除一个键值对
             * @param {String} key
             */
            this.remove = function(key) {
                var index = this.keys.indexOf(key);
                if(index > -1)
                    this.keys.splice(index, 1);
                delete this.values[key];
            };

            /**
             * 遍历Map,执行处理函数
             *
             * @param {Function} 回调函数 function(key,value,index){..}
             */
            this.each = function(callback){
                if(typeof callback != 'function'){
                    return;
                }
                var len = this.keys.length;
                for(var i=0;i<len;i++){
                    var k = this.keys[i];
                    callback(k,this.values[k],i);
                }
            };

            /**
             * 获取键值数组(类似Java的entrySet())
             * @return 键值对象{key,value}的数组
             */
            this.entrys = function() {
                var len = this.keys.length;
                var entrys = new Array(len);
                for (var i = 0; i < len; i++) {
                    var k = this.keys[i];
                    entrys[i] = {
                        key : k,
                        value : this.values[k]
                    };
                }
                return entrys;
            };

            /**
             * 根据索引号查找对应的键值对对象
             * @param index
             * @returns {*}
             */
            this.element = function(index){
                var len =this.keys.length;
                if(index >= len)
                    return null;
                return {
                    key : this.keys[index],
                    value : this.values[this.keys[index]]
                };
            };

            /**
             * 如果数组为数字型数组，则进行从小到大的排序
             * @returns {Array}
             */
            this.sortASC = function(){
                this.keys.sort(function(a,b){return a>b?1:-1;});
                return this.entrys();
            };

            this.sortDESC = function(){
                return this.keys.sort(function(a,b){return a<b?1:-1;});
            };

            /**
             * 判断是否存在
             * @param key
             * @returns {*|boolean}
             */
            this.hasOwnKey = function(key){
                return this.values.hasOwnProperty(key);
            };

            /**
             * 清空Map
             */
            this.clear = function(){
                this.keys = [];
                this.values = {};
            };


            /**
             * 判断Map是否为空
             */
            this.isEmpty = function() {
                return this.keys.length === 0;
            };

            /**
             * 获取键值对数量
             */
            this.size = function(){
                return this.keys.length;
            };

            /**
             * 重写toString
             */
            /*this.toString = function(){
             var s = "{";
             for(var i=0;i<this.keys.length;i++,s+=','){
             var k = this.keys[i];
             s += k+"="+this.values[k];
             }
             s+="}";
             return s;
             };*/


            return this;

        }

        return mapFactory;

    }

})(window, window.angular);


/*
var utilsInjector = angular.injector(['phoebe.utils']);
var modelFormat = utilsInjector.get('ModelFormat');
utilsInjector.invoke(['PhoebeContext', function(PhoebeContext){
    console.log(PhoebeContext);
}]);*/

