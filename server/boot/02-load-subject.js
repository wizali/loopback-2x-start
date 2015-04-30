module.exports = function(app) {
	var Subject = app.models.Subject,
		ACL = app.models.ACL;

	var subjects = [{
		"key": "1",
		"value": "语文"
	}, {
		"key": "2",
		"value": "数学"
	}, {
		"key": "3",
		"value": "英语"
	}, {
		"key": "4",
		"value": "物理"
	}];

	subjects.forEach(function(s) {
		Subject.findOrCreate({
			where: {
				"key": s.key
			}
		}, s, function(err, createdSubject, created) {
			if (err) {
				console.error('error create subject');
			}

			console.log('subject ' + s.value + " created!");
		})
	})

	// ACL.create({
	// 		principalType: ACL.USER,
	// 		principalId: 'u001',
	// 		model: 'User',
	// 		property: ACL.ALL,
	// 		accessType: ACL.ALL,
	// 		permission: ACL.ALLOW
	// 	},
	// 	function(err, acl) {
	// 		ACL.create({
	// 				principalType: ACL.USER,
	// 				principalId: 'u001',
	// 				model: 'User',
	// 				property: ACL.ALL,
	// 				accessType: ACL.READ,
	// 				permission: ACL.DENY
	// 			},
	// 			function(err, acl) {
	// 				console.log('acl 2 created')
	// 			})
	// 	})
}