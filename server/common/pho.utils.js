'use strict';

/**
 * take off repret members in an array, also can take off repeat members which has the same value of "prop"
 * @param arr
 * @param prop
 */
exports.takeOffRepeat = function (arr, prop) {
    var returns = [],
        f = 0;

    function getProp(o, prop) {
        if (prop && prop !== '') {
            return o[prop];
        } else {
            return o;
        }
    }

    for (var i = 0, l = arr.length; i < l; i++) {
        for (var j = 0, m = returns.length; j < m; j++) {
            if (getProp(arr[i], prop) === getProp(returns[j], prop)) {
                f = 1;
            }
        }

        if (!f) {
            returns.push(arr[i]);
        }
        f = 0;
    }

    return returns;
};