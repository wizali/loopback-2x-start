'use strict';

var q = require('q');
var utils = require('../common/pho.utils.js');

module.exports = function (server) {

    /**
     * 1、提供加载用户权限的方法；
     * 2、删除页面权限前：
     *      （1）、删除所有页面路由和角色的关联关系；
     *      （2）、删除所有页面下所有按钮；
     *      （3）、删除页面下所有按钮和角色的挂链关系；
     *
     */
    var User = server.models.user,
        Role = server.models.role,
        Page = server.models.Page,
        Button = server.model.Button,
        Page_Role = server.models.Page_Role,
        Role_User = server.models.Role_User,
        Button_Role = server.models.Button_Role;

    //加载用户权限的方法
    Page.getRoutes = function (userId, cb) {
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

    Page.remoteMethod('getRoutes', {
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

    /**
     * 删除页面权限的监听
     * 1、把页面下的所有按钮找出来；
     * 2、删除按钮-角色关系；
     * 3、删除按钮、页面-角色关系；
     */
    Page.observe('before delete', function (ctx, next) {
        var pageId = ctx.instance.pageId,
            whereObj = {where: {roleId: roleId}};

        Button.find({where: {pageId: pageId}}, function (err, btns) {
            if (err) {
                console.log(err);
                return false;
            }
            var btnIds = [];
            for (var i = 0, l = btns.length; i < l; i++) {
                btnIds.push(btns[i].id);
            }
            Button_Role.delete({where: {buttonId: {inq: btnIds}}}, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                delPageAndButtons();
            })
        });

        //删除按钮、页面-角色
        function delPageAndButtons() {
            var delButtons = function () {
                var deferred = q.defer();
                Button.delete({where: {pageId: pageId}}, deferred.makeNodeResolver());
                return deferred.promise;
            };

            var delPageRelation = function () {
                var deferred = q.defer();
                Page_Role.delete({where: {pageId: pageId}}, deferred.makeNodeResolver());
                return deferred.promise;
            };

            q.allSettled([delButtons(), delPageRelation()])
                .spread(function (a, b) {
                    next();
                }).done();
        }

    })
};