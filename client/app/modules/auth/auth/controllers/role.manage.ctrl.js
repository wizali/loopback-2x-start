'use strict';
angular.module('app.auth')
    .controller('AuthRoleCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'UserService', function ($scope, $rootScope, authServ, $location, UserService) {

        var apiServerUrl = 'http://localhost:8000/api';
        var funcTreeData = $rootScope.funcTreeData;

        $scope.operType = '';
        $scope.oper_role = false;
        $scope.oper_user = false;
        $scope.oper_principal = false;
        $scope.roleList = [];
        $scope.userList = [];
        $scope.roleEditing = {};
        $scope.userRelated = [];

        var Role = authServ.role,
            User = authServ.user,
            Role_User = authServ.role_user,
            Page_Role = authServ.page_role,
            Button_Role = authServ.button_role;

        User.query()
            .success(function (data) {
                $scope.userList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });
        Role.query()
            .success(function (data) {
                $scope.roleList = data;
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        $scope.addOrUpdateROle = function (type, r) {
            $scope.operType = type;
            if (!r) {
                $scope.role = {};
            } else {
                $scope.role = r;
            }
            $scope.oper_role = true;
            $scope.oper_principal = false;
            $scope.oper_user = false;
        };

        $scope.saveRole = function (r) {
            Role.save([r])
                .success(function (data) {
                    if ($scope.operType === 'add') {
                        $scope.roleList.push(data[0]);
                    }
                    $.tips('操作成功！');
                    $scope.oper_role = false;
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        $scope.delRole = function (r, index) {
            if (window.confirm('确定删除吗？')) {
                Role.delete([r.id])
                    .success(function (data) {
                        $scope.roleList.splice(index, 1);
                        $.tips('操作成功！');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    })
            }
        };

        //向角色添加用户
        $scope.editUser = function (r) {
            $scope.oper_principal = false;
            $scope.oper_role = false;
            $scope.roleEditing = r;
            clearSelected();

            Role_User.query({where: {'roleId': r.id}})
                .success(function (data) {
                    $scope.userRelated = data;
                    angular.forEach($("#table_user").find('input[type=checkbox]'), function (c) {
                        var $c = $(c);
                        angular.forEach(data, function (d) {
                            if (d.userId === $c.val()) {
                                $c[0].checked = true;
                            }
                        })
                    });
                    $scope.oper_user = true;
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };
        $scope.editUserSubmit = function () {
            var userIds = [];
            var role_user = [];
            var userSelected = $("#table_user").find('input[type=checkbox]:checked');
            angular.forEach(userSelected, function (u) {
                userIds.push($(u).val());
            });

            angular.forEach($scope.userRelated, function (uu) {
                angular.forEach(userIds, function (uid, index) {
                    if (uu.id === uid) {
                        userIds.splice(index, 1);
                    }
                })
            });

            if (userIds.length === 0) {
                $.tips('操作成功！');
                $scope.cancel('oper_user');
                return false;
            }

            var roleId = $scope.roleEditing.id;
            angular.forEach(userIds, function (uid) {
                role_user.push({
                    userId: uid,
                    roleId: roleId
                })
            });

            Role_User.save(role_user)
                .success(function (data) {
                    $.tips('操作成功！');
                    clearSelected();
                    $scope.cancel('oper_user');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });
        };

        function clearSelected() {
            angular.forEach($("#table_user").find('input[type=checkbox]'), function (c) {
                $(c)[0].checked = false;
            });
        }

        //角色授权
        $scope.editPrincipal = function (r) {
            $scope.oper_principal = true;
            $scope.oper_role = false;
            $scope.oper_user = false;
            $scope.roleEditing = r;

            Page_Role.find({where:{'roleId': r.id}})
                .success(function (data){

                })
                .error(function (err) {
                    $.tips(err, 'error');
                });
        };

        $scope.editPrincipalSubmit = function (){
            
        }

        $scope.cancel = function (p) {
            $scope[p] = false;
        }

    }]);