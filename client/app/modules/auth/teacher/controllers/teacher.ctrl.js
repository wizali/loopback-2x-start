'use strict';

angular.module('app.auth.teacher')
    .controller('teacherCtrl', ['$scope', '$rootScope', 'authServ', function ($scope, $rootScope, authServ) {

        $rootScope.teacher = {
            add_teacher: true,
            edit_teacher: ''
        };

        $scope.theachaerList = [];

        var User = authServ.user,
            Role_User = authServ.role_user;

        Role_User.query({include:['user','role']})
            .success(function (data){
                angular.forEach(data,function (d){
                    if (d.role.name === '老师'){
                        $scope.theachaerList.push(d.user);
                    }
                });
            })
            .error(function (err){
                $.tips(err,'error');
            });


        $scope.addTeacher = function () {

        }
    }]);