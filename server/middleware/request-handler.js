'use strict';

module.exports = function () {
    return function requestHandler(req, res, next) {
    	var app = req.app;
        console.log('baseUrl:  ',req.baseUrl);
        console.log('body:  ',req.body);
        console.log('cookies:  ',req.cookies);
        console.log('path:  ',req.path);
        console.log('params:  ',req.params);
        console.log('query:  ',req.query);
        console.log('username:  ',req.query.username);
        console.log('originalUrl:  ',req.originalUrl);

        next();
    }
};	