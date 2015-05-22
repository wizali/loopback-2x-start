'use strict';

// var app = require('../server');

module.exports = function () {
    return function requestHandler(req, res, next) {


        console.log('`````````````````````````````');
        console.log('path:  ', req.path);
        console.log('query:  ', req.query);
        console.log('`````````````````````````````');

        var whiteList = ['/api/users/login'];
        var path = req.path;

        function isFree(url) {
            var f = 0;
            for (var i = 0, l = whiteList.length; i < l; i++) {
                if (whiteList[i] === url) {
                    f = 1;
                }
            }
            return f;
        }

        if (!isFree(path)) {
            var AccessToken = req.app.models.AccessToken;
            var token = req.query.token;
            if (!token) {
                return res.send({
                    message: 'authenticate failed!',
                    status: 401
                });
            }

            AccessToken.exists(token, function (err, data) {
                if (err || !data) {
                    return res.send({
                        message: 'authenticate failed!',
                        status: 401
                    });
                }
                return next();
            });
        } else {
            return next();
        }
    }
};	