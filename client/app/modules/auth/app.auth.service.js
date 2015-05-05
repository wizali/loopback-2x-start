'use strict';

angular.module('app.auth')
    .factory('authServ', ['$http', 'PhoebeResource', function ($http, PhoebeResource) {
        var apiServerUrl = 'http://localhost:8000/api';

        return {
            user: new PhoebeResource('/user')
                .setInterface({login: {method: 'post'}})
                .setInterface({logout: {method: 'post'}}),
            role: new PhoebeResource('/role'),
            role_user: new PhoebeResource('/role_user'),
            role_button: new PhoebeResource('/role_button'),
            page: new PhoebeResource('/page'),
            page_role: new PhoebeResource('/page_role'),
            button_role: new PhoebeResource('/button_role'),
            button: new PhoebeResource('/button'),

            gender: new PhoebeResource('/gender'),
            classes: new PhoebeResource('/class'),
            evaluate: new PhoebeResource('/evaluate'),
            subject: new PhoebeResource('/subject'),
            getRoutes : function (userId){
                return $http.get(apiServerUrl + '/pages/getRoutes?userId='+userId);
            }
        }
    }])
    // an user service used to save user info when an user is logined in, user info can be read in the hole project
    .factory('UserService', ['$http', '$rootScope', function ($http, $rootScope) {
        var current_user;

        //save user info into localStorage, saperate info in "email", "created", "id", "userId"
        function saveUserToLocalStorage(user) {
            localStorage.itms_user_email = user.email || '';
            localStorage.itms_user_created = user.created || '';
            localStorage.itms_user_id = user.id || '';
            localStorage.itms_user_userId = user.userId || '';
            console.log('saved user into localStorage', localStorage);
        }

        //when user logout, remove all user info form localStorage
        function removeUserFormLocalStorage() {
            localStorage.removeItem('itms_user_email');
            localStorage.removeItem('itms_user_created');
            localStorage.removeItem('itms_user_id');
            localStorage.removeItem('itms_user_userId');
            console.log('removed user form localStorage', localStorage);
        }

        //get all user info form localStorage, and format then into an Object
        function getUserFromLocalStorage() {
            var user = {
                email: localStorage.itms_user_email,
                created: localStorage.itms_user_created,
                id: localStorage.itms_user_id,
                userId: localStorage.itms_user_userId
            };

            console.log('get user info form localStorage', user);
            return user;
        };

        return {
            getCurrentUser: function () {
                if (!current_user) {
                    if (window.localStorage.getItem('itms_user_email')) {
                        current_user = $rootScope.currentUser = getUserFromLocalStorage();
                    }
                }
                return current_user;
            },
            setCurrentUser: function (user) {
                current_user = $rootScope.currentUser = user;
                saveUserToLocalStorage(user)
            },
            userLogin: function (user) {
                //when login success, set user inof into UserService, and save it at localStorage
                current_user = $rootScope.currentUser = user;
                saveUserToLocalStorage(user);
            },
            userLogout: function (user) {
                $rootScope.currentUser = current_user = null;
                removeUserFormLocalStorage();
            }
        };
    }]);