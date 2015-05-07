'use strict';

module.exports = function (server) {
    /**
     * 1、删除按钮前，删除所有按钮-角色的关系
     */
    var User = server.models.user,
        Role = server.models.role,
        Page = server.models.Page,
        Button = server.model.Button,
        Page_Role = server.models.Page_Role,
        Role_User = server.models.Role_User,
        Button_Role = server.models.Button_Role;

    Button.ovserve('before delete', function (ctx, next) {
        var btnId = ctx.instance.btnId;

        Button_Role.delete({where: {buttonId: btnId}}, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            }
            next();
        });

    });
};