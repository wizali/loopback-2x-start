'use strict';

module.exports = function () {
    return function requestHandler(req, res, next) {
        console.log(req.path);
        next();
    }
};