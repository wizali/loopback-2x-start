'use strict';

var q = require('q');
var utils = require('../common/pho.utils');

module.exports = function (server) {

    var page = server.models.Page,
        Page_Role = server.models.Page_Role,
        Role_User = server.models.Role_User,
        Button_Role = server.models.Button_Role;

    //remote mothod for get routes by current user
    page.getRoutes = function (userId, cb) {
        //get roleList
        Role_User.find({where: {'userId': userId}}, function (err, role_user) {
            if (err) {
                cb(err);
            }
            var roleList = [];
            for (var i = 0, l = role_user.length; i < l; i++) {
                roleList.push(role_user[i].roleId);
            }
            getRoutesAndButtons(roleList);
        });


        //get routes and buttons that related with role in roleList
        function getRoutesAndButtons(roleList) {
            var querya = function (queryStr) {
                var deferred = q.defer();
                Page_Role.find(queryStr, deferred.makeNodeResolver());
                return deferred.promise;
            };

            var queryb = function (queryStr) {
                var deferred = q.defer();
                Button_Role.find(queryStr, deferred.makeNodeResolver());
                return deferred.promise;
            };
            var queryStra = {include: ['page'], where: {'roleId': {inq: roleList}}},
                queryStrb = {include: ['button'], where: {'roleId': {inq: roleList}}};

            q.allSettled([querya(queryStra), queryb(queryStrb)])
                .spread(function (page_role, button_role) {

                    getUniqueRoutesAndButtons(page_role.value, button_role.value);
                }).done();
        };


        /**
         * @param page_role         all page-role relations,include page
         * @param button_role       all button-role relations, include button
         *
         * take off repeat;
         * format pages and buttons togather
         */
        function getUniqueRoutesAndButtons(page_role, button_role) {
            var page_roles = utils.takeOffRepeat(page_role, 'pageId'),
                button_roles = utils.takeOffRepeat(button_role, 'buttonId'),
                routes = [],
                buttons = [];

            for (var i = 0, l = page_roles.length; i < l; i++) {
                page_roles[i] = page_roles[i].toObject();
                if (page_roles[i]['page']){
                    routes.push(page_roles[i]['page']);
                }
            }

            for (var i = 0, l = button_roles.length; i < l; i++) {
                button_roles[i] = button_roles[i].toObject();
                if (button_roles[i]['button']){
                    buttons.push(button_roles[i]['button']);
                }
            }

            formatRoutesAndButtons(routes, buttons);

        }

        function formatRoutesAndButtons(routes, buttons) {

            for (var i = 0, l = buttons.length; i < l; i++) {
                for (var j = 0, m = routes.length; j < m; j++) {
                    try {
                        if (buttons[i].pageId === routes[j].id) {
                            routes.buttons ? routes.buttons.push(buttons[i]) : routes.buttons = [buttons[i]];
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }

            cb(null, routes);
        }
    };

    page.remoteMethod('getRoutes', {
        description: 'remote mothod for get routes by current user',
        accepts: [
            {
                arg: 'userId',
                type: 'string',
                required: true
            }
        ],
        returns: {
            arg: 'data',
            type: 'Object',
            root: true
        },
        http: {
            verb: 'get',
            path: '/getRoutes'
        }
    });
};