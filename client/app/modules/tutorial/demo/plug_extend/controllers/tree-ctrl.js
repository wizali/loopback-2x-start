/**
 * plug_extend_treeCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial.plug_extend')
    .controller('TutorialTreeCtrl', ['$scope', '$http', 'DateFormat', '$location', 'TreeService', 'authServ',
        function ($scope, $http, DateFormat, $location, TreeService, authServ) {

            var Page = authServ.page;
            Page.query()
                .success(function (data) {
                    var config = {
                        treeData: TreeService.arrayToTreeData(data, 'id', 'parentId', '0'),
                        id: "tree_test"
                    };

                    TreeService.buildNormalTreeHTML(config, $("#demo_tree1"));
                })
                .error(function (err) {
                    $.tips(err, 'error');
                })

        }
    ]);

/**
 * 提供简单的树形结构数据的处理
 * 1、生成树：可构建普通树和链接树两种
 * 2、为树节点添加多选框，同时提供取值、赋值、清空方法
 */
angular.module('app.tutorial.plug_extend')
    .factory('TreeService', function () {

        //after tree builded, bind event of tree node click...
        function initInteractive(el) {
            $(el).delegate('li>label', 'click', function () {
//            $(el).find("li>label").click(function (e) {
                //如果当前节点没有打开，则打开
                var $this = $(this);
                if (!$this.parent().hasClass('pho-tree-active')) {
                    //如果有已经打开的菜单，并且该菜单不是当前节点的父级，则关闭之
                    if (!$this.closest('.pho-tree-active').length) {
                        $('.pho-tree-active').removeClass('pho-tree-active').find('.pho-tree-menu').slideUp(200);
                    }
                    //将当前节点激活，并且将其兄弟节点去除激活状态
                    $this.parent().addClass('pho-tree-active');
                    $this.parent().siblings().each(function (index, li) {
                        $(li).removeClass('pho-tree-active').find('.pho-tree-menu').slideUp(200);
                        $(li).find('li.pho-tree-active').removeClass('pho-tree-active');
                    });
                } else {
                    //如果当前菜单已经打开，则关闭
                    $this.parent().removeClass('pho-tree-active');
                    //如果当前菜单下面还有已经打开的子菜单，也关闭
                    if (!!$this.next().length) {
                        $this.next().find('li').each(function (index, li) {
                            $(li).removeClass('pho-tree-active').find('.pho-tree-menu').slideUp(200);
                        })
                    }
                }
                //如果当前节点有下一级菜单，则进行打开或关闭操作
                if (!!$this.next().length) {
                    $this.next().slideToggle(200)
                }
            });

            $(el).delegate('input[type=checkbox]', 'click', function (e) {
                e.stopPropagation();
                var $this = $(this);
                if ($this[0].checked) {
                    $this[0].checked = true;
                } else {
                    $this[0].checked = false;
                }
            })
        }

        //build tree by treeData
        /**
         * there are two kinds of tree, normal tree and link tree, for link tree, each tree node data should has 'url' property
         * you can also order tree node by one property, if
         * @param config    configuration of the tree
         */

        function buildTree(config) {
            var treeData = config.treeData,
                order = config.order || false,
                type = config.type || 'normal',
                id = config.id,
                $el = $('<ul class="pho-tree" id="' + id + '"></ul>'),
                target_all = config.target ? 'target="' + config.target + '"' : '';

            appendChildren(treeData, $el);
            initInteractive($el);
            return $el;

            function appendChildren(data, $parent) {
                var $node;
                var $sub;

                if (order) {
                    data = ourderByProperty(data, order);
                }
                angular.forEach(data, function (d) {
                    //build $node, set info as 'data' property
                    if (type === 'normal') {
                        $node = $('<li><label><a href="javascript:void(0);">' + d.name + '</a></label></li>');
                    } else {
                        var url = d.url ? d.url : 'javascript:void(0);',
                            target = d.target ? 'target="' + d.target + '"' : target_all;
                        $node = $('<li><label><a href="' + url + '" ' + target + '>' + d.name + '</a></label></li>');
                    }
                    $node.data('data', d);

                    //append $node to $parent
                    $parent.append($node);

                    //if d has items, append items
                    if (d.items.length > 0) {
                        $sub = $('<ul class="pho-tree-menu"></ul>');
                        $node.append($sub);
                        appendChildren(d.items, $sub)
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
        }

        return {
            arrayToTreeData: function (data, idField, foreignKey, rootLevel) {
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
            },
            /**
             * 构建简单树的方法
             * 第一个参数是树的配置，包括：treeData-树节点数据、id-树的id、order-如果树节点是按某个字段排序，则填字段名，可选
             * 第二个参数为树要添加在页面中的位置，即其父级元素的Jquery对象
             * 如果传一个参数，则返回一个树的Jquery对象
             * 如果传两个参数，则默认将树放在其父极元素内，并返回树的Jquery对象
             */
            buildNormalTreeHTML: function () {
                var config = arguments[0];
                if (!config.id) {
                    console.log('正在构建树，缺少id！');
                    return false;
                }
                if (!config.treeData) {
                    console.log('正在构建树，缺少树节点数据！');
                    return false;
                }
                config.type = 'normal';
                if (arguments.length === 2) {
                    var $el = arguments[1],
                        $tree = buildTree(config);
                    $el.append($tree);
                    return $tree;
                } else {
                    return buildTree(config);
                }

            },
            /**
             * 构建链接树的方法
             * 链接树的每一个节点必须有一个url属性
             * 第一个参数是树的配置，包括：treeData-树节点数据、id-树的id、order-如果树节点是按某个字段排序，则填字段名，可选、target-a标签的"target"属性值
             * 每个节点也可以配置target属性，并且节点中的target属性的优先级高于整体配置的target值
             * 第二个参数为树要添加在页面中的位置，即其父级元素的Jquery对象
             * 如果传一个参数，则返回一个树的Jquery对象
             * 如果传两个参数，则默认将树放在其父极元素内，并返回树的Jquery对象
             */
            buildLinkTree: function () {
                var config = arguments[0];
                if (!config.id) {
                    console.log('正在构建树，缺少id！');
                    return false;
                }
                if (!config.treeData) {
                    console.log('正在构建树，缺少树节点数据！');
                    return false;
                }
                config.type = 'tree';
                if (arguments.length === 2) {
                    var $el = arguments[1],
                        $tree = buildTree(config);
                    $el.append($tree);
                    return $tree;
                } else {
                    return buildTree(config);
                }
            },
            addCheckbox: function (el) {
                angular.forEach($(el).find('li'), function (li) {
                    $('<input type="checkbox" />').insertBefore($(li).find('a:first'));
                });
            },
            removeCheckbox: function (el) {
                angular.forEach($(el).find('li'), function (li) {
                    $(li).find('input[type=checkbox]').remove();
                });
            },
            initCheckbox: function (el, checkedList) {
                angular.forEach(checkedList, function (id) {
                    angular.forEach($(el).find('li'), function (li) {
                        var $li = $(li);
                        var $data = $li.data('data');
                        if (id === $data.id) {
                            $li.find('input[type=checkbox]')[0].checked = true;
                        }
                    })
                })
            },
            clearCheckbox: function (el) {
                angular.forEach($(el).find('input[type=checkbox]'), function (ck) {
                    ck.checked = false;
                });
            },
            getCheckedList: function (el) {
                var arr = [];

                angular.forEach($(el).find('input[type=checkbox]:checked'), function (ck) {
                    var $data = $(ck).closest('li').data('data');
                    arr.push($data.id);
                });

                return arr;
            }
        }
    })
;
