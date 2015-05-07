'use strict';

var q = requre('q');

module.exports = function (server) {
    /**
     * 删除角色以前：
     * 1、删除角色关联的所有用户；
     * 2、删除角色关联的所有页面权限；
     * 3、删除角色关联的所有按钮权限
     */
    var Role = server.models.role,
        Role_User = server.models.role_user,
        Page_Role = server.models.page_role,
        Button_Role = server.models.button_role;

    Role.observe('before delete', function (ctx, next) {
        var roleId = ctx.instance.roleId,
            whereObj = {where: {roleId: roleId}};

        var delUserRelation = function () {
            var deferred = q.defer();
            Role_User.delete(whereObj, deferred.makeNodeResolver());
            return deferred.promise;
        };

        var delPageRelation = function () {
            var deferred = q.defer();
            Page_Role.delete(whereObj, deferred.makeNodeResolver());
            return deferred.promise;
        };
        var delBtnRelation = function () {
            var deferred = q.defer();
            Button_Role.delete(whereObj, deferred.makeNodeResolver());
            return deferred.promise;
        };


        q.allSettled([delUserRelation(), delPageRelation(), delBtnRelation()])
            .spread(function (a, b, c) {
                next();
            }).done();
    });
};