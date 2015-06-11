'use strict';

module.exports = function(app) {
	var User = app.models.user;

	//create a default admin user
	var admin = {
		username: 'admin',
		email: 'admin@admin.com',
		password: '123456'
	};

	User.upsert(admin, function(err, data) {
		console.log('default admin user created');
	})
}