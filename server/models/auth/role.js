'use strict';

var q = require('q');

module.exports = function(Role) {
	
	/**
	 * 删除角色以前：
	 * 1、删除角色关联的所有用户；
	 * 2、删除角色关联的所有页面权限；
	 * 3、删除角色关联的所有按钮权限
	 */
	Role.observe('before delete', function(ctx, next) {

		var app = Role.app,
			Role_User = app.models.role_user,
			Page_Role = app.models.page_role,
			Button_Role = app.models.button_role,
			roleId = ctx.where.id,
			whereObj = {
				roleId: roleId
			};

		var delUserRelation = function() {
			var deferred = q.defer();
			Role_User.destroyAll(whereObj, deferred.makeNodeResolver());
			return deferred.promise;
		};

		var delPageRelation = function() {
			var deferred = q.defer();
			Page_Role.destroyAll(whereObj, deferred.makeNodeResolver());
			return deferred.promise;
		};
		var delBtnRelation = function() {
			var deferred = q.defer();
			Button_Role.destroyAll(whereObj, deferred.makeNodeResolver());
			return deferred.promise;
		};


		q.allSettled([delUserRelation(), delPageRelation(), delBtnRelation()])
			.spread(function(a, b, c) {
				next();
			}).done();
	});

};