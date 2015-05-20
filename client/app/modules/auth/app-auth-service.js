'use strict';

angular.module('app.auth')
    .factory('authServ', ['$http', 'PhoebeResource', function ($http, PhoebeResource) {
        var apiServerUrl = 'http://localhost:8000/api';

        return {
            user: new PhoebeResource('/user')
                .setInterface({
                    login: {
                        method: 'post'
                    }
                })
                .setInterface({
                    logout: {
                        method: 'post'
                    }
                }),
            role: new PhoebeResource('/role'),
            role_user: new PhoebeResource('/role_user'),
            role_button: new PhoebeResource('/role_button'),
            page: new PhoebeResource('/page')
                .setInterface({
                    getRoutes : {
                        method: 'post'
                    }
                }),
            page_role: new PhoebeResource('/page_role'),
            button_role: new PhoebeResource('/button_role'),
            button: new PhoebeResource('/button')
        }
    }])

/**
 *
 * 当页面跳转时，检查当前用户是否登录，如果用户没有登录，则跳转到登录页面
 *
 * 用户登录后，将用户名、用户ID、access_token作为current_user变量的属性存放在localStorage和$rootScope
 * 当页面刷新时，从localStorage中取出current_user，如果current_user存在，则证明用户已经登录过
 * $rootScope中的current_user用于在页面中显示当前用户名
 * 用户对服务器端的每一次访问，都将access_token携带在URL的后面，以便后台检查请求是否合法
 *
 * 用户登录以后，从后台取出当前用户所有的页面权限和按钮权限，保存在CURRENT_USER_PRINCIPLE中。然后根据这些权限做2以下事情：
 *      1、渲染左侧菜单树；
 *      2、当页面跳转时，检查用户对目标页面拥有的按钮权限，将无权访问的按钮从页面中拿掉
 *
 */
    .service('AccessServ', ['$http', '$rootScope', '$location',
        function ($http, $rootScope, $location) {
            var CURRENT_USER;
            var CURRENT_USER_PRINCIPLE;
            var localStorage = window.localStorage;
                //用户登录有效时长，默认为7天
            var TTL = 1000 * 60 * 24 * 7,
                //用户未登录时默认跳转的页面
                NO_LOGIN_PAGE = '/login',
                //白名单，不用登录就可以访问
                WHITE_LIST = ['/regist','/login'];
            var that = this;

            //当路由发生变化时，如果用户没有登录，则跳转到登录页面
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                var isFree = isUrlFree(toState.url);
                if (!that.getUser()) {
                    if (!that.getUser() && !isFree) {
                        $location.path(NO_LOGIN_PAGE);
                    }
                }
            });

            //当路由变化并加载完毕后，检查用户对该页面的按钮权限，并将没有权限的那牛移除
            $rootScope.$on('$locationChangeSuccess', function(event, next, nextParams) {
                var path = $location.$$path;
//                var buttons = that.getButtons(path);

                var $buttons = $('button[data-access=add]');

                angular.forEach($buttons,function (btn){
                    $(btn).remove()
                })

            });

            //检查目标路由是否不需要用户登录
            function isUrlFree(url) {
                for (var i = 0, l = WHITE_LIST.length; i < l; i++) {
                    if (url === WHITE_LIST[i]) {
                        return true;
                    }
                }
                return false;
            }

            //设置用户权限的相关信息
            this.config = function (config) {
                if (config.TTL) {
                    TTL = config.TTL;
                }
                if (config.NO_LOGIN_PAGE) {
                    NO_LOGIN_PAGE = config.NO_LOGIN_PAGE;
                }
                if (config.WHITE_LIST) {
                    WHITE_LIST = config.WHITE_LIST;
                }
            };

            //用户临时添加不需要登录的路由
            this.addFreeUrl = function (url) {
                WHITE_LIST.push(url)
            };

            //从localStorage中取出当前用户信息
            function getUserFormLocal() {
                return {
                    access_token: localStorage.itms_user_access_token,
                    userid: localStorage.itms_user_id,
                    username: localStorage.itms_user_name
                }
            }

            //将当前用户信息存放在localStorage中
            function setUserToLocal(user) {
                localStorage.itms_user_access_token = user.access_token || '';
                localStorage.itms_user_id = user.userid || '';
                localStorage.itms_user_name = user.username || '';
            }

            //设置用户登录有效期
            this.setTtl = function (t) {
                TTL = t;
            };
            this.getTtl = function () {
                return TTL;
            };

            //设置当前用户
            this.setUser = function (user) {

                CURRENT_USER = $rootScope.CURRENT_USER = user;
                setUserToLocal(user);
            };

            //取出当前用户信息
            this.getUser = function () {
                if (!CURRENT_USER) {
                    if (localStorage.getItem('itms_user_name')) {
                        CURRENT_USER = $rootScope.CURRENT_USER = getUserFormLocal();
                    }
                }
                return CURRENT_USER;
            };

            this.logout = function () {
                CURRENT_USER = $rootScope.CURRENT_USER = {};
                localStorage.itms_user_access_token = '';
                localStorage.itms_user_id = '';
                localStorage.itms_user_name = '';
            };

            //获取当前用户的权限
            this.getPrinciple = function () {
                return CURRENT_USER_PRINCIPLE;
            };

            //设置当前用户的权限
            this.setPrinciple = function (principles) {
                CURRENT_USER_PRINCIPLE = principles;
            };

            //获取当前用户对某个页面的按钮权限
            this.getButtons = function (page) {

            };

            //将目标页面中不属于用户按钮权限的按钮移除
            this.removeButtonFormPage = function () {

            };

        }]);
