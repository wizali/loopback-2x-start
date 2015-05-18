'use strict';

module.exports = function(Button) {

	/**
	 * 1、删除按钮前，删除所有按钮-角色的关系
	 */
	Button.observe('before delete', function(ctx, next) {
		var app = Button.app,
			Button_Role = app.models.button_role,
			btnId = ctx.where.id;

		Button_Role.destroyAll({
			buttonId: btnId
		}, function(err, data) {
			if (err) {
				console.log(err);
				return false;
			}
			next();
		});
	});

};