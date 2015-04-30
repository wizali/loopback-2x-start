'use strict';

angular.module('app.auth')
    .config(function ($stateProvider) {
        console.log('config auth routes!');

        $stateProvider
            .state('app.auth',{
                url:'/auth',
                templateUrl:'/app/modules/auth/auth.html',
                controller:'AuthCtrl',
                authenticate : true
            })
            .state('app.auth.user', {
                url: "/user",
                templateUrl: "/app/modules/auth/auth/views/user.manage.html",
                controller: "AuthUserCtrl"
            })
            .state('app.auth.role', {
                url: "/role",
                templateUrl: "/app/modules/auth/auth/views/role.manage.html",
                controller: "AuthRoleCtrl"
            })
            .state('app.auth.func', {
                url: "/func",
                templateUrl: "/app/modules/auth/auth/views/func.manage.html",
                controller: "AuthFuncCtrl"
            })
            //auth demo route
            .state('app.auth.class', {
                url: "/class",
                templateUrl: "/app/modules/auth/class/views/class.html",
                controller: "AuthClassCtrl"
            })
            .state('app.auth.evaluate', {
                url: '/evaluate',
                templateUrl: "/app/modules/auth/evaluate/views/evaluate.html",
                controller: 'evaluateCtrl'
            })
            .state('app.auth.subject', {
                url: "/subject",
                templateUrl: "/app/modules/auth/subject/views/subject.html",
                controller: "subjectCtrl",
                authenticate : true
            })
            .state('app.auth.student', {
                url: "/student",
                templateUrl: "/app/modules/auth/student/views/student.html",
                controller: "studentCtrl",
                authenticate : true
            })
            .state('app.auth.teacher', {
                url: "/teacher",
                templateUrl: "/app/modules/auth/teacher/views/teacher.html",
                controller: "teacherCtrl",
                authenticate : true
            })


    });