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
                        //删除角色的同时，要删除角色下所有的用户关系、页面路由关系、按钮关系
                        
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

        oper_principal
        $scope.cancel = function (p) {
            $scope[p] = false;
        };

        //======================================权限相关操作====================================================
        //角色授权
        $scope.principalList_page = [];
        $scope.principalList_btn = [];
        $scope.editPrincipal = function (r) {
            $scope.oper_principal = true;
            $scope.oper_role = false;
            $scope.oper_user = false;
            $scope.roleEditing = r;
            //清空以勾选的权限
            clearPrincipal();

            Page_Role.query({where: {'roleId': r.id}})
                .success(function (data) {
                    $scope.principalList_page = data;
                    console.log('principalList_page loaded');
                    //勾选已经有的权限
                    setPrincipal(data, 'pageId');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });

            Button_Role.query({where: {'roleId': r.id}})
                .success(function (data) {
                    $scope.principalList_btn = data;
                    console.log('principalLIst_btn loaded');
                    //勾选已经有的权限
                    setPrincipal(data, 'buttonId');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });
        };

        //勾选已经被授予的权限
        function setPrincipal(principals, idName) {
            angular.forEach($('#function_tree').find('li'), function (l) {
                var $l = $(l);
                var nodeInfo = $l.data('data');
                angular.forEach(principals, function (p) {
                    if (nodeInfo.id === p[idName]) {
                        $l.find('input[type=checkbox]')[0].checked = true;
                    }
                })
            });
        }

        //清空权限树被勾选的节点
        function clearPrincipal() {
            angular.forEach($('#function_tree').find('input[type=checkbox]'), function (c) {
                $(c)[0].checked = false;
            });
        }

        //将所有被勾选的权限和已经入库的权限进行比较，取出要去掉的权限和新增加的权限，从而进行保存和删除操作
        function getNewPrincipals(selectedNodes) {
            var principalList_page = $scope.principalList_page;
            var principalList_btn = $scope.principalList_btn;
            var roleId = $scope.roleEditing.id;

            var $li, role, $data, save_page = [], save_btn = [], del_page = [], del_btn = [];

            for (var i = 0; i < selectedNodes.length; i++) {
                takeOutDifference();
            }

            angular.forEach(selectedNodes, function (s) {
                $li = $(s).closest('li');
                role = $li.attr('role');
                if (!role) {
                    save_btn.push({
                        buttonId: $li.data('data').id,
                        roleId: roleId
                    })
                } else {
                    save_page.push({
                        pageId: $li.data('data').id,
                        roleId: roleId
                    })
                }
            });

            angular.forEach(principalList_page, function (p) {
                del_page.push(p.id);
            });

            angular.forEach(principalList_btn, function (b) {
                del_btn.push(b.id);
            });

            return {
                save_page: save_page,
                save_btn: save_btn,
                del_page: del_page,
                del_btn: del_btn
            };

            function takeOutDifference() {
                angular.forEach(selectedNodes, function (sn, index_sn) {
                    $li = $(sn).closest('li');
                    role = $li.attr('role');
                    $data = $li.data('data');

                    if (!role) {
                        angular.forEach(principalList_btn, function (pb, index_pb) {
                            if ($data.id === pb.pageId) {
                                selectedNodes.splice(index_sn, 1);
                                principalList_btn.splice(index_pb, 1);
                            }
                        });
                    } else {
                        angular.forEach(principalList_page, function (pp, index_pp) {
                            if ($data.id === pp.pageId) {
                                selectedNodes.splice(index_sn, 1);
                                principalList_btn.splice(index_pp, 1);
                            }
                        });
                    }
                });
            }
        }

        /**
         * 利用role属性判断是按钮还是页面
         * 分别存储
         */
        $scope.editPrincipalSubmit = function () {
            var selectedNodes = $('#function_tree').find('input[type=checkbox]:checked');
            var o = getNewPrincipals(selectedNodes);

            console.log(o)
            Page_Role.delete(o.del_page)
                .success(function (data) {
                    Page_Role.save(o.save_page)
                        .success(function (data) {
                            $.tips('保存页面路由权限成功！');
                        })
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });
            Button_Role.delete(o.del_btn)
                .success(function (data) {
                    Button_Role.save(o.save_btn)
                        .success(function (data) {
                            $.tips('保存按钮权限成功！');
                            $scope.cancel('oper_principal');
                        })
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });

        };

        //============================================初始化菜单树=================================================
        /**
         * 构建权限菜单树
         * 1、从库中取出所有路由配置，和页面按钮配置；
         * 2、整理数据成树形结构
         * 3、渲染成带checkbox的树
         * 4、每个节点的data()方法可取出节点详细信息；
         */
        Page.query({include: ["buttons"]})
            .success(function (data) {
                $scope.treeData = arrayToTreeData(data, 'id', 'parentId', '0');
                console.log($scope.treeData);
                buildTree($scope.treeData, $('#function_tree'));
            })
            .error(function (err) {
                $.tips(err, 'error');
            });

        //format data to tree
        function arrayToTreeData(data, idField, foreignKey, rootLevel) {
            var hash = {};
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item[idField];
                var parentId = item[foreignKey];
                hash[id] = hash[id] || [];
                hash[parentId] = hash[parentId] || [];
                item.items = hash[id];
                hash[parentId].push(item);
            }
            return hash[rootLevel];
        }

        //build tree function
        function buildTree(data, $parent) {
            var $node;
            var role;
            var $button;
            var $sub;

            data = ourderByProperty(data, 'index');
            angular.forEach(data, function (d) {
                //build $node, set info as 'data' property
                role = d.url === '' ? 'module' : 'page';
                $node = $('<li role="' + role + '"><label><input type="checkbox">' + d.name + '</label></li>');
                $node.data('data', d);

                //append $node to $parent
                $parent.append($node);

                //if d has items, append items
                if (d.items.length > 0) {
                    $sub = $('<ul></ul>');
                    $node.append($sub);
                    buildTree(d.items, $sub)
                }

                //if d has buttons, append buttons
                if (d.buttons.length > 0) {
                    $sub = $('<ul></ul>');
                    $node.append($sub);
                    angular.forEach(d.buttons, function (b) {
                        $button = $('<li><label class="fun-btn"><input type="checkbox">' + b.name + '</label></li>');
                        $button.data('data', b);
                        $sub.append($button);
                    })
                }
            });
            //order data array by given property
            function ourderByProperty(data, property) {
                if (!property) {
                    return data;
                }

                var arr = data.splice(0, 1);

                for (var i = 0, l = data.length; i < l; i++) {
                    for (var j = 0, m = arr.length; j < m; j++) {
                        if (data[i][property] < arr[j][property] && j !== m) {
                            continue;
                        } else {
                            arr.splice(j, 0, data[i]);
                            break;
                        }
                    }
                }

                return arr.reverse();
            }
        }

    }]);