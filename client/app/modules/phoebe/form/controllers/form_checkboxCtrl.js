/**
 * form_checkboxCtrl
 * Created by wizaliu on 20150227.
 */
angular.module('app.phoebe.form')
    .controller('checkboxCtrl', ['$scope', '$http', 'DateFormat', '$location',
    function($scope, $http, DateFormat, $location) {
        $scope.checked = function (e){
            alert(e)
        }
    }
]);

/*
 *2015-04-10 (replace with "pho-checkbox")
 *author : wizaliu
 *description : 多选框指令，提供全选，全不选功能；提供点击后绑定事件功能
 */
application.directive('phoCb', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            change: "&"
        },
        template: function (iElement, iAttrs) {
            var name = iAttrs.group,
                msg = iElement.html(),
                value = iAttrs.value ? 'value="' + iAttrs.value + '"' : "",
                caption = iAttrs.caption === '' ? 'caption' : '';
            return '<div class="checkbox pd0 mg0"><label><input name="' + name + '" ' + value + ' type="checkbox" class="ace" ' + caption + '>' + '<span class="lbl">' + msg + '</span></label></div>';
        },
        link: function (scope, iElement, iAttrs) {
            var name = iAttrs.group,
                groupName = iAttrs.group;
            if (iAttrs.caption === '') {
                iElement.bind('change', function () {
                    var checked = $(this).find('input')[0].checked,
                        checkboxes = $("input[name=" + name + "]");
                    angular.forEach(checkboxes, function (o) {
                        o.checked = checked;
                    });
                });
            }
            /*
             *给scope的UI属性上添加一个获取多选框选中项的方法，命名规则为"get"+首字母大写的groupName值+"Selected"
             *例如，groupName为"love"，则添加的方法名为："getLoveSelected"，调用方法为：scope.UI.getLoveSelected()
             */
            scope.$parent.UI = scope.$parent.UI || {};
            groupName = groupName.substr(0, 1).toUpperCase() + groupName.substr(1);
            scope.$parent.UI["get" + groupName + "Selected"] = function () {
                var arr = [],
                    checkboxes = $("input[name=" + name + "]");
                angular.forEach(checkboxes, function (o, index) {
                    if (o.checked && $(o).attr('caption') !== "") {
                        arr.push(index - 1);
                    }
                });
                return arr;
            };
            /**
             * 获取选中项值的方法，获取的值是每一个被选中的checkbox的value，而不是索引
             * @param val
             */
            scope.$parent.UI["get" + groupName + "SelectedValue"] = function () {
                var arr = [],
                    checkboxes = $("input[name=" + name + "]");
                angular.forEach(checkboxes, function (o, index) {
                    var $o = $(o);
                    if (o.checked && $o.attr('caption') !== "") {
                        if (!$o.val()) {
                            arr.push($o.closest('div').attr('data-value'));
                        } else {
                            arr.push($o.val());
                        }
                    }
                });
                return arr;
            };
            /**
             * 在scope.UI上添加一个set方法，用于赋值。参数为包含被选中框的value组成的数组
             * 方法名为："set"+首字母大写的group值+"Value"
             */
            scope.$parent.UI['set' + groupName + 'Value'] = function (val) {
                scope.$parent.UI['clear' + groupName]();
                angular.forEach(val, function (v) {
                    angular.forEach($("input[value=" + v + "]"), function (o) {
                        o.checked = true;
                    });
                });
            };
            /**
             * 在scope.UI上添加一个赋值方法，参数为checkbox组中被选中框的index值组成的数组
             * 方法名为："set"+首字母大写的group值+"ValueByIndex"
             */
            scope.$parent.UI['set' + groupName + 'ValueByIndex'] = function (val) {
                scope.$parent.UI['clear' + groupName]();
                angular.forEach(val, function (v) {
                    $('input[name=' + name + ']').eq(v)[0].checked = true;
                });
            };
            /**
             * 在scope.UI上添加一个清空方法，用于清空一选项
             * 方法名为："clear"+首字母大写的group值
             */
            scope.$parent.UI['clear' + groupName] = function () {
                angular.forEach($('input[name=' + name + ']'), function (o) {
                    o.checked = false;
                });
            };
            /**
             * 在scope.UI上添加一个全选方法，用于全选
             * 方法名为："select"+首字母大写的group值+"All"
             */
            scope.$parent.UI['select' + groupName + 'All'] = function () {
                angular.forEach($('input[name=' + name + ']'), function (o) {
                    o.checked = true;
                });
            };
            //如果该元素设置了"data-change"属性，则在这个多选框上添加一个onchange事件
            if (iAttrs.change) {
                iElement.bind('change', function () {
                    var checked = $(this).find('input')[0].checked;
                    var selected = scope.$parent.UI.getCheckboxSelected();
                    scope.change(selected);
                });
            }
        }
    };
});