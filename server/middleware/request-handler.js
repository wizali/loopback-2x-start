'use strict';

// var app = require('../server');

module.exports = function () {
    return function requestHandler(req, res, next) {
    	var app = req.app;
        console.log('`````````````````````````````');
        // console.log('baseUrl:  ',req.baseUrl);
        // console.log('body:  ',req.body);
        // console.log('cookies:  ',req.cookies);

        console.log('path:  ',req.path);
        // console.log('params:  ',req.params);
        console.log('query:  ',req.query);
        // console.log('username:  ',req.query.username);
        // console.log('originalUrl:  ',req.originalUrl);
        console.log('`````````````````````````````');

        //check req.query.access_token, if exist, next(), or return fakse;
        var at = req.app.models.AccessToken;
        var testId = 'HKGXgalRrryGtrPFSb9QKgg68TJjWC6tKHHLtgFR6BkouZ5RJ60UnjB0gwqQJVh7';

        at.exists(testId,function (err,data){
            if (err){
                next();
            }
            console.log(data);
            next();
        });


        // next();
    }
};	