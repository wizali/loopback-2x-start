'use strict';
angular.module('app.auth')
    .controller('AuthFuncCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'UserService', function ($scope, $rootScope, authServ, $location, UserService) {

        var apiServerUrl = 'http://localhost:8000/api';

        $scope.treeData = [];
        $scope.statusList = [
            {
                "key": 1,
                "value": "启用"
            },
            {
                "key": 2,
                "value": "停用"
            }
        ];

        var Page = authServ.page,
            Button = authServ.button;
        //============================================初始化菜单树=================================================
        //query page, and build a tree by page data
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
                $node = $('<li role="' + role + '"><label>' + d.name + '</label></li>');
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
                        $button = $('<li><label>' + b.name + '</label></li>');
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


        //指向当前正在编辑的节点，可以使用$scope.treeNodeEditing.data('data')获取节点的所有信息
        $scope.treeNodeEditing;
        $scope.OperType = '';
        //=========================================菜单树的数据库操作================================================
        $scope.savePage1 = function () {
            var role = '';
            if ($scope.OperType === 'c_module') {
                $scope.page.url = '';
                role = 'module';
            } else {
                role = 'page';
            }
            $scope.page.parentId = $scope.treeNodeEditing.data('data').id;

            Page.save([$scope.page])
                .success(function (data) {
                    //如果是编辑操作，直接更新节点，否则插入
                    if ($scope.OperType === 'c_edit') {
                        $scope.treeNodeEditing.children('label').html(data[0].name);
                        $scope.treeNodeEditing.data('data', data[0]);
                    } else {
                        var $node = $('<li role="module"><label>' + data[0].name + '</label></li>');
                        $node.data('data', data[0]);
                        //如果有孩子节点，就添加到孩子节点上，否则新增孩子节点并添加
                        if ($scope.treeNodeEditing.children().length === 1) {
                            $scope.treeNodeEditing.append($('<ul></ul>'));
                        }
                        $scope.treeNodeEditing.children('ul').append($node);
                    }

                    $.tips('操作成功！');
                    $scope.hidePopBox('add_page');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })
        };

        $scope.saveButton = function () {

        };

        function edit() {
            var treeNodeEditing = $scope.treeNodeEditing;
            var role = treeNodeEditing.attr('role');

            if (role === 'module' || role === 'page') {
                $scope.$apply(function () {
                    $scope.page = treeNodeEditing.data('data');
                });
                showPopBox('add_page');
            } else {
                $scope.button = treeNodeEditing.data('data');
                showPopBox('add_button');
            }
        };

        /**
         * 删除的规则：
         * 按钮可以直接删除
         * 页面可以直接删除，但必须连带删除页面中的所有按钮
         * 如果模块下有页面，则不能直接删除，如果模块下没有页面，可以直接删除
         * @returns {boolean}
         */
        function del1() {
            var $node = $scope.treeNodeEditing;
            var role = $node.attr('role');

            if (role === 'module' && $scope.treeNodeEditing.find('li').length > 0) {
                $.tips('该模块下有子页面，不能删除！', 'error');
                return false;
            }

            if (window.confirm('确定删除吗？')) {
                var $data = $node.data('data'),
                    nodeId = $data.id;

                if (role === 'module') {
                    Page.delete([nodeId])
                        .success(function (data) {
                            $scope.treeNodeEditing.remove();
                            $.tips(data);
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        })
                } else if (role === 'page') {
                    var buttonIds = [],
                        buttons = $data.buttons;
                    for (var i = 0, l = buttons.length; i < l; i++) {
                        buttonIds.push(buttons[i].id);
                    }

                    Button.delete(buttonIds)
                        .success(function (data) {
                            $.tips(data);
                            Page.delete([nodeId])
                                .success(function (data) {
                                    $scope.treeNodeEditing.remove();
                                    $.tips(data);
                                })
                                .error(function (err) {
                                    $.tips(err, 'error');
                                })
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        })
                } else {
                    Button.delete([nodeId])
                        .success(function (data) {
                            $scope.treeNodeEditing.remove();
                            $.tips(data);
                        })
                        .error(function (err) {
                            $.tips(err, 'error');
                        })
                }
            }
        };

        //=========================================菜单树的UI操作=======================================================
        $("#function_tree").delegate('li', 'contextmenu', function () {
            var $this = $(this);
            var role = $this.attr('role');
            var mouseX = event.clientX + 30;
            var mouseY = event.clientY;

            $(".context-menu").find('#c_module').show();
            $(".context-menu").find('#c_page').show();
            $(".context-menu").find('#c_button').show();

            if (role === 'module') {
                $(".context-menu").find('#c_button').hide();
            } else if (role === 'page') {
                $(".context-menu").find('#c_module').hide();
                $(".context-menu").find('#c_page').hide();
            } else {
                $(".context-menu").find('#c_module').hide();
                $(".context-menu").find('#c_page').hide();
                $(".context-menu").find('#c_button').hide();
            }

            $(".context-menu").css({
                top: mouseY,
                left: mouseX
            }).show();
            $scope.treeNodeEditing = $this;
            console.log($this.data('data'));
            return false;
        });

        //浏览器滚动或点击右键菜单以外的地方，隐藏右键菜单
        $(window).on('scroll', function () {
            $(".context-menu").hide();
        }).on('click', function () {
            $(".context-menu").hide();
        });

        //右键菜单选择后的回调方法
        $(".context-menu li").on('click', function () {
            $scope.$apply(function () {
                $scope.page = {};
                $scope.button = {};
            })

            var operType = $(this).attr('id');
            switch (operType) {
                case "c_module" :
                    $scope.OperType = 'c_module';
                    showPopBox('add_page');
                    break;
                case "c_page":
                    $scope.OperType = 'c_page';
                    showPopBox('add_page');
                    break;
                case "c_button":
                    showPopBox('add_button');
                    break;
                case "c_edit":
                    $scope.OperType = 'c_edit';
                    edit();
                    break;
                case "c_del":
                    del();
                    break;
                default:
                    break;
            }
            $(".context-menu").hide();
        });

        //弹出框隐藏和显示
        $scope.hidePopBox = function (id) {
            $("#" + id).hide();
        };
        function showPopBox(id) {
            $("#" + id).show();
        };


        //==========================================测试数据===================================================


        /*Page.save([
         {
         "name": "字典表管理",
         "url": "",
         "index": "1",
         "description": "字典表管理",
         "parentId": "0"
         }
         ])
         .success(function (data) {
         var id = data[0].id;
         Page.save([
         {
         "name": "性别管理",
         "url": "/app/auth/gender",
         "index": "1",
         "description": "性别管理",
         "parentId": id
         },
         {
         "name": "班级管理",
         "url": "/app/auth/class",
         "index": "2",
         "description": "班级管理",
         "parentId": id
         }
         ])
         .success(function (data) {
         Page.save([
         {
         "name": "学生管理",
         "url": "/app/auth/student",
         "index": "2",
         "description": "学生管理",
         "parentId": "0"
         },
         {
         "name": "老师管理",
         "url": "/app/auth/teacher",
         "index": "3",
         "description": "老师管理",
         "parentId": "0"
         },
         {
         "name": "评价管理",
         "url": "/app/auth/evaluate",
         "index": "4",
         "description": "评价管理",
         "parentId": "0"
         }
         ])
         .success(function (data) {

         })
         })
         console.log(data)
         })
         .error(function (err) {
         $.tips(err, 'error');
         });
         */


        var data_button =
            [{
                "name": "添加",
                "sign": "add",
                "pageId": "554085f6b2c79a1d2ed79c6e"
            }, {
                "name": "编辑",
                "sign": "edit",
                "pageId": "554085f6b2c79a1d2ed79c6e"
            }, {
                "name": "删除",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c6e"
            }, {
                "name": "添加",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c6f"
            }, {
                "name": "编辑",
                "sign": "edit",
                "pageId": "554085f6b2c79a1d2ed79c6f"
            }, {
                "name": "删除",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c6f"
            }, {
                "name": "添加学生",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c70"
            }, {
                "name": "编辑学生",
                "sign": "edit",
                "pageId": "554085f6b2c79a1d2ed79c70"
            }, {
                "name": "删除学生",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c70"
            }, {
                "name": "分配学生到班级",
                "sign": "design",
                "pageId": "554085f6b2c79a1d2ed79c70"
            }, {
                "name": "添加老师",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c71"
            }, {
                "name": "编辑老师",
                "sign": "edit",
                "pageId": "554085f6b2c79a1d2ed79c71"
            }, {
                "name": "删除老师",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c71"
            }, {
                "name": "分配老师到班级",
                "sign": "design",
                "pageId": "554085f6b2c79a1d2ed79c71"
            }, {
                "name": "添加评论",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c72"
            }, {
                "name": "编辑评论",
                "sign": "edit",
                "pageId": "554085f6b2c79a1d2ed79c72"
            }, {
                "name": "删除评论",
                "sign": "del",
                "pageId": "554085f6b2c79a1d2ed79c72"
            }];

/*        Button.save(data_button)
            .success(function (data) {
                console.log(data);
            })
            .error(function (err) {
                $.tips(err, 'error');
            });*/
    }]);
