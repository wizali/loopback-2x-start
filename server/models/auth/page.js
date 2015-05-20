'use strict';

var q = require('q');
var utils = require('../../common/pho.utils.js');

module.exports = function(Page) {

    /**
     * 1、提供加载用户权限的方法；
     * 2、删除页面权限前：
     *      （1）、删除所有页面路由和角色的关联关系；
     *      （2）、删除所有页面下所有按钮；
     *      （3）、删除页面下所有按钮和角色的挂链关系；
     *
     */

    //加载用户权限的方法
    Page.getRoutes = function(user, cb) {
        var userId = user.userId,
            app = Page.app,
            User = app.models.user,
            Role = app.models.role,
            Button = app.models.button,
            Page_Role = app.models.page_role,
            Role_User = app.models.role_user,
            Button_Role = app.models.button_role;

        //get roleList
        Role_User.find({
            where: {
                'userId': userId
            }
        }, function(err, role_user) {
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
            var querya = function(queryStr) {
                var deferred = q.defer();
                Page_Role.find(queryStr, deferred.makeNodeResolver());
                return deferred.promise;
            };

            var queryb = function(queryStr) {
                var deferred = q.defer();
                Button_Role.find(queryStr, deferred.makeNodeResolver());
                return deferred.promise;
            };
            var queryStra = {
                    include: ['page'],
                    where: {
                        'roleId': {
                            inq: roleList
                        }
                    }
                },
                queryStrb = {
                    include: ['button'],
                    where: {
                        'roleId': {
                            inq: roleList
                        }
                    }
                };

            q.allSettled([querya(queryStra), queryb(queryStrb)])
                .spread(function(page_role, button_role) {

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
                if (page_roles[i]['page']) {
                    routes.push(page_roles[i]['page']);
                }
            }

            for (var i = 0, l = button_roles.length; i < l; i++) {
                button_roles[i] = button_roles[i].toObject();
                if (button_roles[i]['button']) {
                    buttons.push(button_roles[i]['button']);
                }
            }

            formatRoutesAndButtons(routes, buttons);

        }

        function formatRoutesAndButtons(routes, buttons) {

            for (var i = 0, l = buttons.length; i < l; i++) {
                for (var j = 0, m = routes.length; j < m; j++) {
                    try {
                        if (buttons[i].pageId.toString() === routes[j].id.toString()) {
                            routes[j].buttons ? routes[j].buttons.push(buttons[i]) : routes[j].buttons = [buttons[i]];
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }


            cb(null, routes);
        }
    };

    Page.remoteMethod('getRoutes', {
        description: 'remote mothod for get routes by current user',
        accepts: [{
            arg: 'user',
            type: 'object',
            http: {source: 'body'},
            required: true
        }],
        returns: {
            arg: 'data',
            type: 'Object',
            root: true
        },
        http: {
            verb: 'post',
            path: '/getRoutes'
        }
    });

    /**
     * 删除页面权限的监听
     * 1、把页面下的所有按钮找出来；
     * 2、删除按钮-角色关系；
     * 3、删除按钮、页面-角色关系；
     */
    Page.observe('before delete', function(ctx, next) {
        var app = Page.app,
            Button = app.models.button,
            Page_Role = app.models.page_role,
            Button_Role = app.models.button_role;
            
        var pageId = ctx.where.id;

        Button.find({
            where: {
                pageId: pageId
            }
        }, function(err, btns) {
            if (err) {
                console.log(err);
                return false;
            }
            var btnIds = [];
            for (var i = 0, l = btns.length; i < l; i++) {
                btnIds.push(btns[i].id);
            }
            Button_Role.destroyAll({
                buttonId: {
                    inq: btnIds
                }
            }, function(err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                delPageAndButtons();
            })
        });

        //删除按钮、页面-角色
        function delPageAndButtons() {
            var delButtons = function() {
                var deferred = q.defer();
                Button.destroyAll({
                    pageId: pageId
                }, deferred.makeNodeResolver());
                return deferred.promise;
            };

            var delPageRelation = function() {
                var deferred = q.defer();
                Page_Role.destroyAll({
                    pageId: pageId
                }, deferred.makeNodeResolver());
                return deferred.promise;
            };

            q.allSettled([delButtons(), delPageRelation()])
                .spread(function(a, b) {
                    next();
                }).done();
        }

    })
};