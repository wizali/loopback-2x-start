/**
 * plug_extend_treeCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.plug_extend')
    .controller('treeCtrl', ['$scope', '$http', 'DateFormat', '$location',
        function ($scope, $http, DateFormat, $location) {
            console.log($scope.catalog)
        }


    ]);

angular.module('app.phoebe.plug_extend')
    .factory('TreeService', function () {
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
            buildNormalTreeHTML: function (config) {
                var treeId = config.id,
                    treeData = config.treeData,
                    target = config.target ? 'target="' + config.target + '"' : '';

                var _html = '<ul class="sidenav" id="' + treeId + '">',
                    subHtml = appendChild(treeData, _html, target);

                var $html = $(subHtml + '</ul>');
                $html.find("li>a").click(function (e) {
                    //如果当前节点没有打开，则打开
                    var $this = $(this);
                    if (!$this.parent().hasClass('sidenav-active')) {
                        //如果有已经打开的菜单，并且该菜单不是当前节点的父级，则关闭之
                        if (!$this.closest('.sidenav-active').length) {
                            $('.sidenav-active').removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                        }
                        //将当前节点激活，并且将其兄弟节点去除激活状态
                        $this.parent().addClass('sidenav-active');
                        $this.parent().siblings().each(function (index, li) {
                            $(li).removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                            $(li).find('li.sidenav-active').removeClass('sidenav-active');
                        });
                    } else {
                        //如果当前菜单已经打开，则关闭
                        $this.parent().removeClass('sidenav-active');
                        //如果当前菜单下面还有已经打开的子菜单，也关闭
                        if (!!$this.next().length) {
                            $this.next().find('li').each(function (index, li) {
                                $(li).removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                            })
                        }
                    }
                    //如果当前节点有下一级菜单，则进行打开或关闭操作
                    if (!!$this.next().length) {
                        $this.next().slideToggle(200)
                    }
                });

                return $html;

                function appendChild(catalog, html, target) {
                    if (!catalog.length) {
                        return html;
                    }

                    angular.forEach(catalog, function (c) {
                        var url = c.url || 'javascript:void(0);';
                        html += '<li><label><a ' + target + ' href="' + url + '">' + c.name + '</a></label>';
                        if (c.items) {
                            var subHtml = appendChild(c.items, '', target);

                            html += '<ul class="sidenav-menu">' + subHtml + '</ul>';
                        }
                        html += '</li>';
                    });

                    return html;
                }

            },
            buildLinkTree: function (config){
                
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

            },
            clearCheckbox: function (el) {
                angular.forEach($(el).find('input[type=checkbox]'), function (ck) {
                    ck.checked = false;
                });
            },
            getCheckedList: function (el) {
                var arr = [];

                return arr;
            }
        }
    });

/**
 * pho-tree directive
 * 2015-05-05
 * author : wizali
 * usage : <pho-tree-n data-data="catalog" data-id="pho_tree"></pho-tree-n>
 * parameters :
 *          data-id : id of tree
 *          data-style : id of tree
 *          data-data : tree node data source
 *          data-nodeid : id property of each tree node. (Example: data-nodeid="id")
 *          data-parentid : id property of each node's parent property. (Example: data-parentid="parentId")
 *          data-root : parentId of the root node. (Example: data-root="0000", then the root node's parentId shoude be "0000")
 */
angular.module('app.phoebe.plug_extend')
    .directive('phoTreeN', [function () {
        return {
            restrict: 'E',
            replace: true,
            template: function (iElem, iAttr) {
                if (!iAttr.data) {
                    return 'you have no data to build a tree!';
                }
                var style = iAttr.style ? ' style="' + iAttr.style + '"' : '';
                var id = iAttr.id ? ' id="="' + iAttr.id + '"' : '';
                return '<ul class="sidenav" ' + style + id + '></ul>';
            },
            link: function (scope, iElem, iAttr) {
                var dataNmae = iAttr.data;
                scope.$watch(dataNmae, function (newVal, oldVal, $scope) {
                    if (newVal) {
                        var idProperty = iAttr.nodeid,
                            parentProperty = iAttr.parentid,
                            root = iAttr.rootid;
                        var treeData = arrayToTreeData(newVal, idProperty, parentProperty, root);
                        renderTreeNode(treeData);
                        bindEvent();
                    }
                });

                /**
                 * render treeNode to tree
                 * @param treeData
                 */
                function renderTreeNode(treeData) {
                    var _html = appendChild(treeData, '');
                    iElem.html($(_html));
                }

                /**
                 * init user interaction
                 */
                function bindEvent() {
                    iElem.find("li>a").click(function (e) {
                        //如果当前节点没有打开，则打开
                        var $this = $(this);
                        if (!$this.parent().hasClass('sidenav-active')) {
                            //如果有已经打开的菜单，并且该菜单不是当前节点的父级，则关闭之
                            if (!$this.closest('.sidenav-active').length) {
                                $('.sidenav-active').removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                            }
                            //将当前节点激活，并且将其兄弟节点去除激活状态
                            $this.parent().addClass('sidenav-active');
                            $this.parent().siblings().each(function (index, li) {
                                $(li).removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                                $(li).find('li.sidenav-active').removeClass('sidenav-active');
                            });
                        } else {
                            //如果当前菜单已经打开，则关闭
                            $this.parent().removeClass('sidenav-active');
                            //如果当前菜单下面还有已经打开的子菜单，也关闭
                            if (!!$this.next().length) {
                                $this.next().find('li').each(function (index, li) {
                                    $(li).removeClass('sidenav-active').find('.sidenav-menu').slideUp(200);
                                })
                            }
                        }
                        //如果当前节点有下一级菜单，则进行打开或关闭操作
                        if (!!$this.next().length) {
                            $this.next().slideToggle(200)
                        }
                    });
                }

                //append child node to parent
                function appendChild(catalog, html, target) {
                    if (!catalog.length) {
                        return html;
                    }

                    angular.forEach(catalog, function (c) {
                        var url = c.url || 'javascript:void(0);';
                        html += '<li><a ' + target + ' href="' + url + '">' + c.name + '</a>';
                        if (c.children) {
                            var subtarget = c.name == '资源检索' ? 'target="_blank"' : '';
                            var subHtml = appendChild(c.children, '', subtarget);

                            html += '<ul class="sidenav-menu">' + subHtml + '</ul>';
                        }
                        html += '</li>';
                    });

                    return html;
                }

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
            }
        }
    }]);