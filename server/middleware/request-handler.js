'use strict';

module.exports = function () {
    return function requestHandler(req, res, next) {
    	var app = req.app;
        console.log(req.path);
        console.log('params:',req.params);
        console.log('query:',req.query);
        console.log('username:',req.query.username);
        console.log('ip:',req.ip);

        next();
    }
};