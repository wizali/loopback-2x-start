/**
 * directives
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial')
    .directive('exIndex', [function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: function (iElem, iAttr) {
                var indexArr = ['<li><a href="#introduction">概述</a></li>',
                        '<li><a href="#index">文档目录</a></li>',
                        '<li><a href="#demo">实例</a></li>',
                        '<li><a href="#usage">使用方法</a></li>',
                        '<li><a href="#properties">参数说明</a></li>',
                        '<li><a href="#api">API 接口</a></li>',
                        '<li><a href="#relevant">相关信息</a></li>',
                        '<li><a href="#relevant">扩展</a></li>'],
                    showIndex = iAttr['show'].split(' '),
                    _html = '<ul class="container list-unstyled">';

                angular.forEach(showIndex, function (index) {
                    _html += indexArr[index];
                });

                return _html + '</ul>';

            }
        }
    }
    ]);