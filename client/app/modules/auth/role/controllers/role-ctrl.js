'use strict';
angular.module('app.auth')
    .controller('AuthRoleCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'AccessServ', 'FuncTreeServ', 'TreeService', 'AuthRoleServ',
        function ($scope, $rootScope, authServ, $location, AccessServ, FuncTreeServ, TreeService, AuthRoleServ) {

            var apiServerUrl = 'http://localhost:8000/api';

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
                Page = authServ.page,
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

            $scope.addOrUpdateRole = function (type, r) {
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
                AuthRoleServ.saveRole(r);
            };

            $scope.delRole = function (r, index) {
                AuthRoleServ.delRole(r, index);
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
            //添加信勾选的，删除勾选掉的
            $scope.editUserSubmit = function () {
                var seledtedUserIds = [];
                var role_user_add = [];
                var role_user_del = [];
                var userSelected = $("#table_user").find('input[type=checkbox]:checked');

                angular.forEach(userSelected, function (u) {
                    seledtedUserIds.push($(u).val());
                });

                //$scope.userRelated是已经关联入库的，seledtedUserIds是当前被勾选的所有用户，比较两个数组，找出新增用户和删除的用户
                for (var i = 0, l = $scope.userRelated.length; i < l; i++) {
                    getDiffeienct();
                }
                function getDiffeienct() {
                    angular.forEach($scope.userRelated, function (uu, ind) {
                        angular.forEach(seledtedUserIds, function (uid, index) {
                            if (uu.userId === uid) {
                                seledtedUserIds.splice(index, 1);
                                $scope.userRelated.splice(ind, 1);
                                return false;
                            }
                        });
                    });
                }

                //如果有新增用户，则调用save方法保存
                if (seledtedUserIds.length !== 0) {
                    var roleId = $scope.roleEditing.id;
                    angular.forEach(seledtedUserIds, function (uid) {
                        role_user_add.push({
                            userId: uid,
                            roleId: roleId
                        })
                    });

                    Role_User.save(role_user_add)
                        .success(function (data) {
                            $.tips('操作成功！');
                            clearSelected();
                            $scope.cancel('oper_user');
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        });
                }

                //如果有删除用户，则调用del方法删除
                if ($scope.userRelated.length !== 0) {
                    angular.forEach($scope.userRelated, function (u) {
                        role_user_del.push(u.id);
                    });
                    Role_User.delete(role_user_del)
                        .success(function (data) {
                            $.tips('操作成功！');
                            clearSelected();
                            $scope.cancel('oper_user');
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        })
                }

                if (seledtedUserIds.length === 0 && $scope.userRelated.length === 0) {
                    $.tips('操作成功！');
                    $scope.cancel('oper_user');
                    return false;
                }

            };

            //清空关联用户的多选框
            function clearSelected() {
                angular.forEach($("#table_user").find('input[type=checkbox]'), function (c) {
                    $(c)[0].checked = false;
                });
            }

            //隐藏相应的弹出框
            $scope.cancel = function (p) {
                $scope[p] = false;
            };

            //======================================权限相关操作====================================================
            //角色授权
            $scope.principalRelated_page = [];
            $scope.principalRelated_btn = [];
            //根据角色ID查找关联路由权限和按钮权限，并依次勾选相应的权限
            $scope.editPrincipal = function (r) {
                $scope.oper_principal = true;
                $scope.oper_role = false;
                $scope.oper_user = false;
                $scope.roleEditing = r;
                //清空以勾选的权限
                AuthRoleServ.clearPrincipalChecked();

                Page_Role.query({where: {'roleId': r.id}})
                    .success(function (data) {
                        $scope.principalRelated_page = data;
                        //勾选已经有的权限
                        AuthRoleServ.setChecked(data, 'pageId');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    });

                Button_Role.query({where: {'roleId': r.id}})
                    .success(function (data) {
                        $scope.principalRelated_btn = data;
                        //勾选已经有的权限
                        AuthRoleServ.setChecked(data, 'buttonId');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    });
            };

            /**
             * 利用role属性判断是按钮还是页面
             * 分别存储
             */
            $scope.editPrincipalSubmit = function () {
                var diff = getPrincipalDiffeience();

                if (diff.page_save.length !== 0) {
                    Page_Role.save(diff.page_save)
                        .success(function (data) {
                            $.tips('保存页面路由权限成功！');
                            $scope.cancel('oper_principal');
                        })
                }
                if (diff.page_del.length !== 0) {
                    Page_Role.delete(diff.page_del)
                        .success(function (data) {
                            $scope.cancel('oper_principal');
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        });
                }
                if (diff.btn_save.length !== 0) {
                    Button_Role.save(diff.btn_save)
                        .success(function (data) {
                            $.tips('保存按钮权限成功！');
                            $scope.cancel('oper_principal');
                        });
                }
                if (diff.btn_del.length !== 0) {
                    Button_Role.delete(diff.btn_del)
                        .success(function (data) {
                            $scope.cancel('oper_principal');
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        });
                }
            };

            //根据已经关联入库的权限，从当前选择的权限中区分出新增的和删除的
            function getPrincipalDiffeience() {
                var selectedNodes = AuthRoleServ.getChecked(),
                    pageSelected = selectedNodes.pages,
                    btnSelected = selectedNodes.btns,
                    pageRelated = $scope.principalRelated_page,
                    btnRelated = $scope.principalRelated_btn;

                for (var i = 0, l = pageRelated.length; i < l; i++) {
                    diffPage();
                }
                for (var j = 0, m = btnRelated.length; j < m; j++) {
                    diffBtn();
                }

                function diffPage() {
                    angular.forEach(pageRelated, function (pr, ind) {
                        angular.forEach(pageSelected, function (ps, index) {
                            if (pr.pageId === ps) {
                                pageRelated.splice(ind, 1);
                                pageSelected.splice(index, 1);
                                return false;
                            }
                        })
                    })
                }

                function diffBtn() {
                    angular.forEach(btnRelated, function (br, ind) {
                        angular.forEach(btnSelected, function (bs, index) {
                            if (br.buttonId === bs) {
                                btnRelated.splice(ind, 1);
                                btnSelected.splice(index, 1);
                                return false;
                            }
                        })
                    })
                }

                //将要保存的权限整理成对象数组，将要删除的权限整理成id数组
                var page_save = [], page_del = [], btn_save = [], btn_del = [], roleId = $scope.roleEditing.id;
                angular.forEach(pageSelected, function (p) {
                    page_save.push({
                        pageId: p,
                        roleId: roleId
                    })
                });
                angular.forEach(btnSelected, function (b) {
                    btn_save.push({
                        buttonId: b,
                        roleId: roleId
                    })
                });
                angular.forEach(pageRelated, function (p) {
                    page_del.push(p.id);
                });
                angular.forEach(btnRelated, function (p) {
                    btn_del.push(p.id);
                });

                return {
                    page_save: page_save,
                    page_del: page_del,
                    btn_save: btn_save,
                    btn_del: btn_del
                }
            }

            //============================================初始化菜单树=================================================
            /**
             * 构建权限菜单树
             * 1、从库中取出所有路由配置，和页面按钮配置；
             * 2、整理数据成树形结构
             * 3、渲染成带checkbox的树
             * 4、每个节点的data()方法可取出节点详细信息；
             */
            AuthRoleServ.setScope($scope);

            Page.query({include: ["buttons"]})
                .success(function (data) {
                    $scope.treeData = TreeService.arrayToTreeData(data, 'id', 'parentId', '0');
                    var config = {
                        treeData: $scope.treeData,
                        id: 'func_tree_ul'
                    };
                    AuthRoleServ.buildNormalTreeHTML(config, $("#function_tree"));
                    AuthRoleServ.bindButtons('func_tree_ul');
                    var $el = $("#func_tree_ul");
                    AuthRoleServ.setPrincipalTree($el);
                    AuthRoleServ.addCheckbox($el);
                    AuthRoleServ.bindCheckEvent();
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });

        }]);

angular.module('app.auth')
    .factory('AuthRoleServ', ['TreeService', 'FuncTreeServ', 'authServ', function (TreeService, FuncTreeServ, authServ) {
        var $scope;
        var Role = authServ.role;
        var $principalTree;

        return {
            setScope: function (s) {
                $scope = s;
            },
            setPrincipalTree: function ($el) {
                $principalTree = $el;
            },
            saveRole: function (role) {
                Role.save([role])
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
            },
            delRole: function (r, index) {
                if (window.confirm('确定删除吗？')) {
                    Role.delete([r.id])
                        .success(function (data) {
                            $scope.roleList.splice(index, 1);
                            //删除角色的同时，要删除角色下所有的用户关系、页面路由关系、按钮关系

                            $.tips('操作成功！');
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        })
                }
            },
            buildNormalTreeHTML: TreeService.buildNormalTreeHTML,
            bindButtons: FuncTreeServ.bindButtons,
            addCheckbox: TreeService.addCheckbox,
            clearPrincipalChecked: function () {
                angular.forEach($principalTree.find('input[type=checkbox]'), function (c) {
                    $(c)[0].checked = false;
                });
            },
            setChecked: function (checkedList, prop) {
                var $nodes = $principalTree.find('li'),
                    data, $node;
                angular.forEach(checkedList, function (c) {
                    angular.forEach($nodes, function (n) {
                        $node = $(n);
                        data = $node.data('data');
                        if (data.id === c[prop]) {
                            $node.find('input[type=checkbox]')[0].checked = true;
                        }
                    });
                });
            },
            getChecked: function () {
                var o = {
                    pages: [],
                    btns: []
                };

                angular.forEach($principalTree.find('input[type=checkbox]:checked'), function (ck) {
                    var $li = $(ck).closest('li'),
                        role = $li.attr('role'),
                        $data = $li.data('data');

                    if (role === 'button') {
                        o.btns.push($data.id);
                    } else {
                        o.pages.push($data.id);
                    }
                });

                return o;
            },
            bindCheckEvent: function () {
                $principalTree.find('input[type=checkbox]').on('change', function (e) {
                    var $ck = $(this),
                        checked = $ck[0].checked,
                        $li = $ck.closest('li'),
                        role = $li.attr('role');

                    //如果页面反选，则页面下所有按钮反选
                    if (role === 'page') {
                        if (!checked) {
                            angular.forEach($li.find('input[type=checkbox]'), function (ck) {
                                ck.checked = checked;
                            });
                        }

                        //如果页面被选中并且其父极模块没有被选中，则勾选父极模块
                        if (checked && $li.closest('li[role=module]').length === 1) {
                            $li.closest('li[role=module]').children('label').children('input[type=checkbox]')[0].checked = true;
                        }
                        //模块反选以后，该模块下的所有页面和页面下的按钮也反选
                    } else if (role === 'module' && !checked) {
                        angular.forEach($li.find('input[type=checkbox]'), function (ck) {
                            ck.checked = false;
                        })
                    }
                });
            }
        }
    }]);