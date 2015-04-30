'use strict';

angular.module('app.auth')
    .factory('authServ', ['$http', 'PhoebeResource', function ($http, PhoebeResource) {
        return {
            classes: new PhoebeResource('/class'),
            evaluate: new PhoebeResource('/evaluate'),
            subject: new PhoebeResource('/subject'),
            student: new PhoebeResource('/student')
                .setInterface({login: {method: 'post'}})
                .setInterface({logout: {method: 'post'}})
                .setInterface({liststudnet: {method: 'get'}}),
            teacher: new PhoebeResource('/teacher')
                .setInterface({login: {method: 'post'}})
                .setInterface({logout: {method: 'post'}}),
            user: new PhoebeResource('/user'),
            role: new PhoebeResource('/role'),
            role_user: new PhoebeResource('/role_user'),
            role_button: new PhoebeResource('/role_button'),
            page: new PhoebeResource('/page'),
            page_role: new PhoebeResource('/page_role'),
            button_role: new PhoebeResource('/button_role'),
            button: new PhoebeResource('/button'),
            gender: new PhoebeResource('/gender')
        }
    }])
    .factory('UserService', ['$http', '$rootScope', function ($http, $rootScope) {
        var current_user;
        var that = this;

        //save user info into localStorage, saperate info in "email", "created", "id", "userId", "userRole"
        function saveUserToLocalStorage(user) {
            localStorage.itms_user_email = user.email || '';
            localStorage.itms_user_created = user.created || '';
            localStorage.itms_user_id = user.id || '';
            localStorage.itms_user_userId = user.userId || '';
            localStorage.itms_user_userRole = user.userRole || '';
        }

        //when user logout, remove all user info form localStorage
        function removeUserFormLocalStorage() {
            localStorage.removeItem('itms_user_email');
            localStorage.removeItem('itms_user_created');
            localStorage.removeItem('itms_user_id');
            localStorage.removeItem('itms_user_userId');
            localStorage.removeItem('itms_user_userRole');
        }

        //get all user info form localStorage, and format then into an Object
        function getUserFromLocalStorage() {
            var user = {
                email: localStorage.itms_user_email,
                created: localStorage.itms_user_created,
                id: localStorage.itms_user_id,
                userId: localStorage.itms_user_userId,
                userRole: localStorage.itms_user_userRole
            };

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