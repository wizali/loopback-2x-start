'use strict';

module.exports = function (server) {

    var Student = server.models.Student,
        Teacher = server.models.Teacher;

    Student.beforeCreate = Teacher.beforeCreate = function (next, user) {
        if (user.name == undefined) {
            user.name = user.email;
        }
        user.status = 'created';
        user.created = Date.now();
        console.log('you are tring to create a student:', user.name);
        next();
    };

};