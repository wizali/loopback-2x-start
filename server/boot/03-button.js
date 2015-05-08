'use strict';

module.exports = function (server) {
    /**
     * 1、删除按钮前，删除所有按钮-角色的关系
     */
    var User = server.models.user,
        Role = server.models.role,
        Page = server.models.page,
        Button = server.models.button,
        Page_Role = server.models.page_role,
        Role_User = server.models.role_user,
        Button_Role = server.models.button_role;


    Button.observe('before delete', function (ctx, next) {
        var btnId = ctx.where.id;

        Button_Role.destroyAll({buttonId: btnId}, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            }
            next();
        });
    });

};