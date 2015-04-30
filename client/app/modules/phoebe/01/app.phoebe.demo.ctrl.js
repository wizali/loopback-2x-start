'use strict';

angular.module('app.phoebe')
    .controller('PhoebeDemoCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.$on('$viewContentLoaded',
            function (event) {
                //when page change,find page's title from $scope.catalog, and set it to page
                var path = $location.$$path;
                $scope.pageName = path.split('/').pop();

                //initialize highlight
                $('pre code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            });

        //format $scope.catalog to catalog tree
        (function () {
            function appendChild(catalog, html, target) {
                if (!catalog.length) {
                    return html;
                }

                angular.forEach(catalog, function (c) {
                    html += '<li><a ' + target + ' href="' + c.url + '">' + c.name + '</a>';
                    if (c.children) {
                        var subtarget = c.name == '资源检索' ? 'target="_blank"' : '';
                        var subHtml = appendChild(c.children, '', subtarget);

                        html += '<ul class="sidenav-menu">' + subHtml + '</ul>';
                    }
                    html += '</li>';
                });

                return html;
            }

            var catalog = $rootScope.catalog,
                _html = '<ul class="sidenav" style="padding:10px 0 20px 20px;position: fixed">',
                subHtml = appendChild(catalog, _html);

            _html = subHtml + '</ul>';

            $("#catalog").html($(_html)).find("li>a").click(function (e) {
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
        })();
    }]);