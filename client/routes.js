/**
 * Created by felix on 10/15/14.
 */
var router = require('express').Router();
var path = require('path');

/*   , _ =    require('underscore')
    , path = require('path');

var routes = [
    // Views
    {
        path: '/views*//*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '*//*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            res.render('index');
        }]
    }
];


function(app) {

    _.each(routes, function(route) {
        //route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);
        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}*/

router.get('/views', function (req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
});

/*router.route('/views*//*')
    .post(function(req, res) {
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) res.send(err);
            res.json(bears);
        });
    });*/

//router.get("/login", function(req, res, next){
//    res.render('login');
//});

router.get("/*", function(req, res){
    res.render('index');
});



module.exports = router;

