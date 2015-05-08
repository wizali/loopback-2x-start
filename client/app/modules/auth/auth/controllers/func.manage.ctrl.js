'use strict';
angular.module('app.auth')
    .controller('AuthFuncCtrl', ['$scope', '$rootScope', 'authServ', '$location', 'TreeService', 'FuncTreeServ',
        function ($scope, $rootScope, authServ, $location, TreeService, FuncTreeServ) {
            var apiServerUrl = 'http://localhost:8000/api';
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

            $scope.addRootPage = function () {
                $scope.page = {
                    name: "itms监控系统",
                    index: "1",
                    url: "",
                    description: "itms监控系统",
                    parentId: "0"
                };
                $scope.OperType = 'c_module';
                $scope.showPopBox('add_page')
            };


            FuncTreeServ.setScope($scope);
            //============================================初始化菜单树=================================================
            //query page, and build a tree by page data
            $scope.treeData = [];
            Page.query({include: ["buttons"]})
                .success(function (data) {
                    if (data.length === 0) {
                        $scope.addRootPage()
                    }

                    $scope.treeData = TreeService.arrayToTreeData(data, 'id', 'parentId', '0');
                    var config = {
                        treeData: $scope.treeData,
                        id: 'func_tree_ul'
                    };
                    TreeService.buildNormalTreeHTML(config, $("#func_tree"));
                    FuncTreeServ.renderContextMenu('func_tree_ul');
                    FuncTreeServ.bindButtons('func_tree_ul');
                })
                .error(function (err) {
                    $.tips(err, 'error');
                });


            //指向当前正在编辑的节点，可以使用$scope.treeNodeEditing.data('data')获取节点的所有信息
            $scope.treeNodeEditing = null;
            $scope.OperType = '';
            $scope.page = {};
            $scope.button = {};
            //=========================================菜单树的数据库操作================================================
            //路由权限
            $scope.addModule = function () {
                $scope.showPopBox('add_page');
            };
            $scope.addPage = function () {
                $scope.showPopBox('add_page');
            };
            $scope.savePage = function () {
                //目录节点不需要url属性
                if ($scope.OperType === 'c_module') {
                    $scope.page.url = '';
                }
                //非编辑时，要给新节点添加父节点ID
                if ($scope.OperType !== 'c_edit') {
                    try {
                        $scope.page.parentId = $scope.treeNodeEditing.data('data').id;
                    } catch (e) {
                    }
                }

                FuncTreeServ.savePage($scope.page)
            };

            //按钮权限
            $scope.addButton = function () {
                $scope.showPopBox('add_button');
            };
            $scope.saveButton = function () {
                var button = $scope.button;
                button.pageId = $scope.treeNodeEditing.data('data').id;
                FuncTreeServ.saveButton(button);
            };

            $scope.edit = function () {
                var treeNodeEditing = $scope.treeNodeEditing,
                    role = treeNodeEditing.attr('role');

                $scope.$apply(function () {
                    if (role === 'page') {
                        $scope.page = treeNodeEditing.data('data');
                        $scope.showPopBox('add_page');
                    } else {
                        $scope.button = treeNodeEditing.data('data');
                        $scope.showPopBox('add_button');
                    }
                });
            };

            /**
             * 删除的规则：
             * 按钮可以直接删除
             * 页面可以直接删除，但必须连带删除页面中的所有按钮
             * 如果模块下有页面，则不能直接删除，如果模块下没有页面，可以直接删除
             * @returns {boolean}
             */
            $scope.del = function () {
                if ($scope.treeNodeEditing.find('li[role=page]').length > 0) {
                    $.tips('该模块下有子页面，不能删除！', 'error');
                    return false;
                }

                var $node = $scope.treeNodeEditing,
                    role = $node.attr('role');

                if (window.confirm('确定删除吗？')) {
                    var $data = $node.data('data');

                    if (role === 'button') {
                        FuncTreeServ.deleteButton($data);
                    } else {
                        FuncTreeServ.deletePage($data);
                    }
                }
            };


            //=========================================菜单树的UI操作=======================================================
            //弹出框隐藏和显示
            $scope.hidePopBox = function (id) {
                $("#" + id).hide();
            };
            $scope.showPopBox = function (id) {
                $("#" + id).show();
            };

        }]);

angular.module('app.auth')
    .factory('FuncTreeServ', ['authServ', function (authServ) {
        var $scope,
            Page = authServ.page,
            Button = authServ.button;

        return {
            setScope: function (scope) {
                $scope = scope;
            },
            renderContextMenu: function (treeId) {
                //添加右键菜单到树上
                var contextMenu = '<ul class="context-menu">' +
                    '<li id="c_module">添加模块</li>' +
                    '<li id="c_page">添加页面</li>' +
                    '<li id="c_button">添加按钮</li>' +
                    '<li id="c_edit">编辑</li>' +
                    '<li id="c_del">删除</li>' +
                    '</ul>';
                $(document.body).append($(contextMenu));

                //对树上的节点住的右键菜单事件
                $("#" + treeId).delegate('li', 'contextmenu', function () {
                    var $this = $(this),
                        role = $this.attr('role'),
                        mouseX = event.clientX + 30,
                        mouseY = event.clientY,
                        $menu = $(".context-menu");

                    $menu.find('#c_module').show();
                    $menu.find('#c_page').show();
                    $menu.find('#c_button').show();

                    if (role === 'button') {
                        $menu.find('#c_module').hide();
                        $menu.find('#c_page').hide();
                        $menu.find('#c_button').hide();
                    } else if (role === 'page') {
                        $menu.find('#c_module').hide();
                        $menu.find('#c_page').hide();
                    } else if (role === 'module') {
                        $menu.find('#c_button').hide();
                    }


                    $menu.css({
                        top: mouseY,
                        left: mouseX
                    }).show();
                    $scope.treeNodeEditing = $this;
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
                    });

                    var operType = $(this).attr('id');
                    switch (operType) {
                        case "c_module" :
                            $scope.OperType = 'c_module';
                            $scope.addModule();
                            break;
                        case "c_page":
                            $scope.OperType = 'c_page';
                            $scope.addPage();
                            break;
                        case "c_button":
                            $scope.addButton();
                            break;
                        case "c_edit":
                            $scope.OperType = 'c_edit';
                            $scope.edit();
                            break;
                        case "c_del":
                            $scope.del();
                            break;
                        default:
                            break;
                    }
                    $(".context-menu").hide();
                });
            },
            bindButtons: function (treeId) {
                angular.forEach($("#" + treeId).find('li'), function (li) {
                    var $li = $(li),
                        $data = $li.data('data'),
                        buttons = $data.buttons;

                    //给这个节点加一个role=page的属性，以便区分路由权限和按钮权限
                    $li.attr('role', 'page');

                    //遍历节点上的按钮，并依次作为孩子添加到节点上
                    if (buttons.length > 0) {
                        var $buttons = $('<ul class="pho-tree-menu"></ul>');
                        angular.forEach(buttons, function (b) {
                            var $button = $('<li role="button"><label><a href="javascript:void(0);">' + b.name + '</a></label></li>');
                            $button.data('data', b);
                            $buttons.append($button)
                        });
                    }
                    if ($data.url === '') {
                        $li.attr('role', 'module');
                    }
                    $li.append($buttons)
                })
            },
            savePage: function (page) {
                Page.save([page])
                    .success(function (data) {
                        var node = data[0],
                            $treeNodeEditing = $scope.treeNodeEditing;

                        try {
                            //如果是编辑操作，直接更新节点，否则插入
                            if ($scope.OperType === 'c_edit') {
                                $treeNodeEditing.children('a').html(node.name);
                                $treeNodeEditing.data('data', node);
                            } else {
                                var role = $scope.OperType === 'c_module' ? 'module' : 'page';

                                //如果时新增操作，则添加信的树节点到树中
                                var $node = $('<li role="' + role + '"><label><a href="javascript:void(0);">' + node.name + '</a></label></li>');

                                $node.data('data', node);
                                //如果有孩子节点，就添加到孩子节点上，否则新增孩子节点并添加
                                if ($treeNodeEditing.children('ul').length === 0) {
                                    $treeNodeEditing.append($('<ul class="pho-tree-menu"></ul>'));
                                }
                                $treeNodeEditing.children('ul').append($node);
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        $.tips('操作成功！');
                        $scope.hidePopBox('add_page');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    })
            },
            //删除路由权限，必须同时删除按钮中的所有按钮
            deletePage: function ($data) {
                var pageId = $data.id;
                Page.delete([pageId])
                    .success(function (data) {
                        $scope.treeNodeEditing.remove();
                        $.tips(data);
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    });
            },
            saveButton: function (button) {
                Button.save([button])
                    .success(function (data) {
                        var node = data[0],
                            $treeNodeEditing = $scope.treeNodeEditing,
                            $btn = $('<li role="button"><label><a href="javascript:void(0);">' + node.name + '</a></label></li>');

                        if ($treeNodeEditing.children('ul').length === 0) {
                            $treeNodeEditing.append($('<ul class="pho-tree-menu"></ul>'));
                        }

                        $treeNodeEditing.children('ul').append($btn);
                        $btn.data('data', node);
                        $.tips('操作成功！');
                        $scope.hidePopBox('add_button');
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    })
            },
            deleteButton: function ($data) {
                var buttonId = $data.id;
                Button.delete([buttonId])
                    .success(function (data) {
                        $scope.treeNodeEditing.remove();
                        $.tips(data);
                    })
                    .error(function (err) {
                        $.tips(err, 'error');
                    })
            }
        }
    }]);