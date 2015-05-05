'use strict';

module.exports = function(app) {

	var Gender = app.models.Gender;

	var genderDict = [{
		"key": "1",
		"value": "男"
	}, {
		"key": "2",
		"value": "女"
	}];

	genderDict.forEach(function(gender) {
		Gender.findOrCreate({
			where: {
				"key": gender.key
			}
		}, gender, function(err, genderCreate, created) {
			if (err) {
				console.error('error create gender');
			}
			console.log('gender ' + gender.value + ' is created!');
		})
	});
};