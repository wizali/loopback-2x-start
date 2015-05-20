/**
 * Created by wizaliu on 20150227.
 */
angular.module('app.tutorial')
    .controller('TutorialCatalogCtrl', ['$scope', '$location','$rootScope',
        function ($scope, $location,$rootScope) {
            //build page
            (function () {
                function formatData(catalog, html, target) {
                    if (!catalog.length) {
                        return html;
                    }

                    angular.forEach(catalog, function (c) {

                        html += '<li class="col-xs-4"><a class="text-muted" ' + target + ' href="' + c.url + '">' + c.name + '</a></li>';
                        if (c.children) {
                            html += formatData(catalog, '');
                        }
                    });

                    return html;
                }

                var catalog = $rootScope.catalog,
                    _html = '',
                    target = '';

                angular.forEach(catalog, function (c) {
                    _html += '<h5 class="bg-primary popover-content">' + c.name + '</h5>';
                    target = c.name == '资源检索' ? 'target="_blank"' : '';
                    if (c.children) {
                        _html += '<ul class="container list-unstyled panel-group">' + formatData(c.children, '', target) + '</ul>';
                    }
                });

                $("#content").append($(_html));
            })();




        }
    ]);