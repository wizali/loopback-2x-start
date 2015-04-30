/* =========================================================
 * angular-directive.js
 *
 * 项目专用指令库
 * 基于anjularjs、jquery、ace1.3、bootstrap3.1.1
 * 开发原则：
 * 1、如果用到控件交互（取值、赋值、初始化、刷新），利用$scope.UI命名空间；
 * ========================================================= */
/*
 *2015-01-21
 *author : wizaliu
 *description : 弹出框指令，向某个按钮或元素上绑定一个弹出框事件，当元素被点击以后，弹出框弹出
 * 提供cancelfun、clearfun、submitfun、beforeopen四个自定义方法，分别用于“取消”、“清空”、“提交”和打开窗口以前的处理
 * 如果添加了beforeopen方法，则必须返回一个boolean值，如果返回true，则显示弹出框，如果返回false则不显示
 **/
(function () {
    var moduleName = 'phoebe.library.directive';
    var module;
    try {
        module = angular.module(moduleName);
    } catch (e) {
        module = angular.module(moduleName, []);
    }

    module.directive('phoPopBox', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    cancelfun: '&',
                    clearfun: '&',
                    submitfun: '&',
                    beforeopen: '&',
                    closefun: '&'
                },
                template: '<pho ng-transclude></pho>',
                replace: false,
                transclude: true,
                link: function (scope, iElement, iAttrs) {
                    var btns = [];
                    if (iAttrs.hasOwnProperty('cancelfun')) {
                        btns.push({
                            text: "关闭",
                            "class": "btn btn-xs",
                            click: function () {
                                $(this).dialog("destroy").addClass('hide');
                                scope.cancelfun();
                            }
                        });
                    }
                    if (iAttrs.hasOwnProperty('clearfun')) {
                        btns.push({
                            text: "清空",
                            "class": "btn btn-success btn-xs",
                            click: function () {
                                scope.clearfun();
                            }
                        });
                    }
                    if (iAttrs.hasOwnProperty('submitfun')) {
                        btns.push({
                            text: "提交",
                            "class": "btn btn-primary btn-xs",
                            click: function () {
                                scope.submitfun();
                            }
                        });
                    }
                    iElement.on('click', function () {
                        var f = scope.beforeopen();
                        if (f || f === undefined) {
                            $("#" + iAttrs.target).removeClass('hide').dialog({
                                modal: true,
                                title: "<div class='widget-header widget-header-small'><h4 class='smaller'>" + iAttrs.title + "</h4></div>",
                                width: iAttrs.width || null,
                                title_html: true,
                                buttons: btns
                            });

                            if (iAttrs.hasOwnProperty('closefun')) {
                                $("#" + iAttrs.target).on("dialogclose", function (event, ui) {
                                    scope.closefun();
                                });
                            }
                            if (iAttrs.height) {
                                $("#" + iAttrs.target).dialog({
                                    height: iAttrs.height || null
                                });
                            }
                            resize(iAttrs);
                        }
                    });
                    //弹出框以后，要判断高度是否超过浏览器窗口的高度，并进行相应的调整
                    function resize(attrs) {
                        var pHeight = 80;
                        if (attrs.cancelfun || attrs.clearfun || attrs.submitfun) {
                            pHeight = 120;
                        }
                        var widgetId = attrs.id,
                            screenHeight = $(window).height() - pHeight,
                            contengHeight = $("#" + widgetId).height(),
                            css = {
                                'max-height': screenHeight,
                                'overflow-y': 'auto',
                                'overflow-x': 'auto'
                            };
                        if (screenHeight < contengHeight) {
                            css = {
                                'height': screenHeight,
                                'overflow-y': 'scroll',
                                'overflow-x': 'hidden'
                            };
                        }
                        //如果设置了弹出框高度，则直接使用这个高度
                        /*if (attrs['height']) {
                         css['height'] = parseInt(attrs['height'],10);
                         }*/
                        $("#" + widgetId).css(css);
                    }
                }
            };
        }
    ]);
    /**
     * 2015-02-03
     * author : wizaliu
     * description : 每页显示条数控制指令，如果使用了分页，则可以加上这个指令来控制每页显示的条数
     * 默认选项有5、10、20、30、40、50
     */
    module.directive('phoPaginCtrl', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: function (iElement, iAttrs) {
                    var model = iAttrs.model,
                        optionStr = '<option value="5">5</option>';
                    for (i = 1; i <= 5; i++) {
                        optionStr += '<option value="' + i * 10 + '">' + i * 10 + '</option>';
                    }
                    return '<div class="dataTables_length"><label>显示 <select size="1" ng-model="' + model + '" aria-controls="sample-table-2">' + optionStr + '</select> 条数据</label></div>';
                },
                link: function (scope, iElement, iAttrs) {
                    var model = iAttrs.model;
                    scope[model] = '10';
                }
            };
        }
    ]);
    /*
     *2015-01-20
     *author：wizaliu
     *description: 可重复添加相同内容的指令，例如添加多条路由表信息
     **/
    module.directive('phoWell', [
        function () {
            return {
                restrict: 'E',
                template: function (iElement, iAttrs) {
                    var title = iAttrs.title || '';
                    return '<div class="widget-box"><div class="widget-header widget-header-small">' + '<h5 class="widget-title lighter">' + title + '</h5><span class="widget-toolbar">' + '<a href="javascript:void(0)" data-role="plus"><i class="ace-icon fa fa-plus"></i></a>' + '</span></div><div class="widget-body"><div class="widget-core">' + '<div class="profile-activity clearfix" ng-transclude></div></div></div></div>';
                },
                replace: true,
                transclude: true,
                link: function (scope, iElement, iAtrs) {
                    var delBtnStr = '<div class="tools action-buttons"><a href="javascript:void(0)" class="red" data-role="del">' + '<i class="ace-icon fa fa-times bigger-125"></i></a></div>',
                        container = iElement.find('.widget-core'),
                        formStr = '<div class="profile-activity clearfix">' + container.children().eq(0).html() + delBtnStr + '</div>';
                    iElement.find('a[data-role=plus]').on('click', function () {
                        container.append($(formStr));
                    });
                    iElement.delegate('a[data-role=del]', 'click', function () {
                        if (window.confirm('确定删除吗？')) {
                            $(this).closest('.profile-activity').remove();
                        }
                    });
                }
            };
        }
    ]);
    /*
     *2015-01-23
     *author : wizaliu
     *description : 简单的可重复添加相同内容的指令，例如添加多条路由表信息
     **/
    module.directive('phoSimpleWell', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: function (iElement, iAttrs) {
                    var id = iAttrs.id;
                    if (!id) {
                        console.log('请给您的phoSimpleWell指令添加“data-id”属性！否则无法添加getValue方法！');
                    }
                    return '<pho id=""><div class="well" ng-transclude></div></pho>';
                },
                link: function (scope, iElement, iAttrs) {
                    var id = iAttrs.id,
                        plusBtn = '<a href="javascript:void(0);" class="green"><i class="ace-icon fa fa-plus"></i></a>',
                        delBtn = '<a href="javascript:void(0);" class="red"><i class="ace-icon fa fa-times"></i></a>',
                        delTemplate = '<div class="well">' + iElement.find('div:first').html() + delBtn + '</div>',
                        plusTemplate = '<div class="well">' + iElement.find('div:first').html() + plusBtn + '</div>';
                    //向第一个代码块加一个“添加”按钮，并绑定添加事件
                    $(plusBtn).appendTo(iElement.find('div:first'));
                    iElement.delegate('a.green', 'click', function () {
                        $(delTemplate).appendTo(iElement);
                        //找到所有的日期框进行初始化
                        angular.forEach(iElement.children('div:last').find('input[class*=date-picker]'), function (o) {
                            $(o).datepicker({
                                autoclose: true,
                                format: 'yyyy-mm-dd'
                            });
                            $(o).next().on('click', function () {
                                $(this).prev().focus();
                            });
                        });
                    });
                    //给所有“删除”按钮代理点击事件，如果被删除数据内容有id，则只hide不能remove，因为要记录id
                    iElement.delegate('a.red', 'click', function () {
                        if (window.confirm('确定删除吗？')) {
                            if ($(this).prev().find('input[type=hidden]').val()) {
                                //隐藏的同时，给这个代码块加一个state属性，值为remove，表示这个是要被删除的
                                $(this).parent().hide().attr('state', 'remove');
                            } else {
                                $(this).parent().remove();
                            }
                        }
                    });
                    /*
                     *给scope的UI属性上添加一个获取多选框选中项的方法，命名规则为"get"+首字母大写的groupName值+"Value"
                     *例如，groupName为"love"，则添加的方法名为："getLoveValue"，调用方法为：scope.UI.getLoveValue()
                     */
                    scope.UI = scope.UI || {};
                    groupName = id.substr(0, 1).toUpperCase() + id.substr(1);
                    scope.UI["get" + groupName + "Value"] = function () {
                        var arr = [];
                        angular.forEach(iElement.children('div[class*=well]'), function (div) {
                            var $div = $(div);
                            o = {};
                            //如果div上有state=remove的属性，则表示这个是要被删除的
                            if ($div.attr('state') == 'remove') {
                                o.state = 'remove';
                            }
                            angular.forEach($div.find('input'), function (c) {
                                var attr = $(c).attr('data-key');
                                if (attr !== 'id' || (attr === 'id' && $(c).val() !== '')) {
                                    o[attr] = $(c).val();
                                }
                            });
                            angular.forEach($div.find('textarea'), function (c) {
                                o[$(c).attr('data-key')] = $(c).val();
                            });
                            angular.forEach($div.find('select'), function (c) {
                                o[$(c).attr('data-key')] = $(c).val();
                            });
                            arr.push(o);
                        });
                        return arr;
                    };
                    //赋值方法，先将表单清空成原来的样子
                    scope.UI['set' + groupName + 'Value'] = function (val) {
                        //先将代码快重置
                        iElement.html('');
                        $(plusTemplate).appendTo(iElement);
                        var count = val.length - 1,
                            plusBtn = iElement.find('a.green');
                        for (var i = 0; i < count; i++) {
                            plusBtn.trigger('click');
                        }
                        //赋值
                        angular.forEach(val, function (o, index) {
                            var $subForm = iElement.children('div').eq(index);
                            for (var k in o) {
                                $subForm.find('[data-key=' + k + ']').val(o[k]);
                            }
                        });
                    };
                }
            };
        }
    ]);
    /*
     *2015-01-29
     *author : wizaliu
     *description : 单选框指令
     */
    module.directive('phoRadio', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    change: '&'
                },
                template: function (iElement, iAttrs) {
                    var name = iAttrs.group,
                        value = iAttrs.value,
                        msg = iElement.html();
                    return '<div class="radio"><label><input name="' + name + '" value="' + value + '" type="radio" class="ace">' + '<span class="lbl">' + msg + '</span></label></div>';
                },
                link: function (scope, iElement, iAttrs) {
                    //如果配置了data-selected属性，则判断，将被选中的选中
                    if (iAttrs.selected == "true") {
                        iElement.find('input')[0].checked = true;
                    }
                    /*
                     *向scope.UI上添加get和set方法，方法名为"get"+首字母大写的data-group+"Value"、"set"+首字母大写的data-group+"Value"
                     *如果有指令上有data-change属性，则添加一个onchange的监听事件
                     */
                    var group = iAttrs.group,
                        name = group.substr(0, 1).toUpperCase() + group.substr(1);
                    scope.$parent.UI = scope.$parent.UI || {};
                    scope.$parent.UI['get' + name + 'Value'] = function () {
                        var val = '';
                        angular.forEach($('input[name=' + group + ']'), function (el) {
                            if (el.checked === true) {
                                val = $(el).val();
                            }
                        });
                        return val;
                    };
                    scope.$parent.UI['set' + name + 'Value'] = function (val) {
                        angular.forEach($('input[name=' + group + ']'), function (el) {
                            if ($(el).val() == val) {
                                el.checked = true;
                            }
                        });
                    };
                    if (iAttrs.change) {
                        iElement.on('change', function () {
                            scope.change(scope.$parent.UI['get' + name + 'Value']());
                        });
                    }
                }
            };
        }
    ]);
    /*
     *2015-01-22
     *author : wizaliu
     *description : 多选框指令，提供全选，全不选功能；提供点击后绑定事件功能
     */
    module.directive('phoCheckbox', function () {
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
    /**
     *2015-01-22
     *author : wizaliu
     *description : 表格全选的checkbox
     */
    module.directive('phoSelectAllRows', function ($document) {
        return function (scope, element, attrs) {
            element.on('click', function () {
                var that = this,
                    checked = that.checked;
                $(this).closest('table').find('tr > td:first-child input:checkbox').each(function () {
                    this.checked = checked;
                    $(this).closest('tr').toggleClass('selected');
                });
                angular.forEach(scope.houses, function (house) {
                    house.selected = checked;
                });
            });
        };
    });
    /**
     *2015-01-22
     *author : wizaliu
     *description : 普通弹出框的相关操作
     *    给弹出框的两个关闭按钮添加监听事件，单击以后关闭
     *
     */
    module.directive('phoWidgetBoxTemplate', function () {
        var directive = {
            restrict: "CEA",
            link: function (scope, element, attrs) {
                //关闭按钮
                element.find("a[data-role=widget_close]").on("click", function () {
                    $.hideWidget(angular.element(this).attr("data-target"));
                    scope.item = {};
                });
                //清空按钮
                element.find('a[data-role=widget_clear]').on('click', function () {
                    if (scope.item) {
                        scope.item = {};
                    }
                });
            }
        };
        return directive;
    });

    /**
     * 日期选择控件
     * 验证截止日期大于起始日期：依据data-role来区分是否需要验证
     * usage:
     *      一般用法：<input pho_datepicker />
     *      开始时间：<input pho_datepicker data-role="startDate" data-end="endDate" />
     *      结束时间：<input pho_datepicker data-role="endDate" data-start="endDate" />
     *      所选日期不能大于今天：<input pho_datepicker data-role="beforeToday" />
     *
     * 参数：pho_datepicker--》申明为日期选择框
     *      data-role--》日期选择框类型：startDate（开始时间）、endDate（结束时间）、beforeToday（所选日期不能大于今天）
     *      data-start-->与结束时间对应的开始时间的id
     *      data-end-->与开始时间对应的结束时间的id
     */
    module.directive('phoDatepicker', function () {
        return function (scope, element, attrs) {
            $(element).datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });
            $(element).next().on('click', function () {
                $(this).prev().focus();
            });
            /**
             * 开始时间或结束时间
             */
            if (attrs.role === 'startDate' || attrs.role === 'endDate') {
                var startEl = null,
                    endEl = null;
                if (attrs.role === 'startDate') {
                    startEl = $$(element);
                    endEl = $$('#' + attrs.end);
                } else {
                    startEl = $$('#' + attrs.start);
                    endEl = $$(element);
                }
                element.on('changeDate', function () {
                    try {
                        var start = startEl.val().replace(/-/g, ""),
                            end = endEl.val().replace(/-/g, "");
                        if (start && end) {
                            if (end < start) {
                                $.tips("结束日期不能小于起始日期！", "error");
                                $$(this).val("");
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
            //判断所选日期不能大于今天
            if (attrs.role == 'beforeToday') {
                element.on('changeDate', function () {
                    var selected = $$(this).val().replace(/-/g, ""),
                        newDate = new Date(),
                        ny = newDate.getFullYear(),
                        nm = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1),
                        nd = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate(),
                        today = ny + "" + nm + "" + nd;
                    if (today < selected) {
                        $.tips("所选日期不能大于今天！", "error");
                        $$(this).val("");
                    }
                });
            }
        };
    });
    /*
     *2015-01-29
     *author : wizaliu
     *description : 数据列表。每条数据按照内联元素样式排列，排满一行后自动换行
     *              该指令还可以被当做多选框来使用，需要给指令标签添加"data-checkbox='true'"属性，
     *              然后scope.UI上会自动注册get和set方法
     */
    module.directive('phoDataList', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    data: '@list'
                },
                transclude: true,
                template: function (iElement, iAttrs) {
                    var id = iAttrs.id;
                    return '<ul class="data-list" id="' + id + '"></ul>';
                },
                compile: function () {
                    return {
                        pre: function (scope, iElement, iAttrs) {
                            var data = $.parseJSON(scope.data),
                                _html = '';
                            angular.forEach(data, function (d) {
                                _html += '<li><a href="javascript:void(0)" data-key="' + d.key + '">' + d.value + '</a></li>';
                            });
                            iElement.html($(_html));
                        },
                        post: function (scope, iElement, iAttrs) {
                            /*
                             *如果设置的data-checkbox="true"，则给每一条数据绑定单击事件，切换选中和未选中样式，并向scope.UI上注册get和set方法，命名方式为"get"+首字母大写的data-id+"Value"，"set"+首字母大写的data-id+"Value"。从而实现checkbox功能
                             *再提供一个清空值和设置选中项的方法，方法名分别为"clear"+首字母大写的data-id+"Value";"set"+首字母大写的data-id+"Selected"
                             *
                             */
                            var id = iAttrs.id,
                                name = id.substr(0, 1).toUpperCase() + id.substr(1);
                            if (iAttrs.checkbox === "true") {
                                iElement.delegate('a', 'click', function () {
                                    $(this).toggleClass('data-list-on');
                                });
                                scope.$parent.UI = scope.$parent.UI || {};
                                scope.$parent.UI['get' + name + 'Value'] = getValue;
                                scope.$parent.UI['set' + name + 'Value'] = setValue;
                                scope.$parent.UI['clear' + name + 'Value'] = clear;
                                scope.$parent.UI['set' + name + 'Selected'] = setSelected;
                            }
                            //取值方法
                            function getValue() {
                                var arr = [];
                                angular.forEach(iElement.find('a.data-list-on'), function (el) {
                                    arr.push($(el).attr('data-key'));
                                });
                                return arr;
                            }

                            //赋值方法
                            function setValue(val) {
                                var _html = '';
                                angular.forEach(val, function (d) {
                                    _html += '<li><a href="javascript:void(0)" data-code="' + d.key + '">' + d.value + '</a></li>';
                                });
                                iElement.html($(_html));
                            }

                            //清空方法
                            function clear() {
                                angular.forEach(iElement.find('a.data-list-on'), function (el) {
                                    $(el).removeClass('data-list-on');
                                });
                            }

                            //设置选中值得方法
                            function setSelected(selected) {
                                var $el = null;
                                angular.forEach(iElement.find('a'), function (el) {
                                    $el = $(el);
                                    angular.forEach(selected, function (s) {
                                        if ($el.attr('data-key') == s) {
                                            $el.addClass('data-list-on');
                                        }
                                    });
                                });
                            }
                        }
                    };
                }
            };
        }
    ]);
    /**
     * 2015-01-29
     * author ： wizaliu
     * description : 表单控件指令。可使用的表单控件包含以下类型（“ ”中表示该类型可配置的属性和可添加的指令）：
     *
     *  1、输入框：input  “”
     *  2、文本框：textarea  “”
     *  3、日期选择框：datepicker  “data-date-format:格式化方式，默认为‘yyyy-mm-dd’；data-role；data-end；data-start”
     *
     *  4、下拉框：dropdwon
     *     下拉框分三种：（1）字典表；（2）外健；（3）级联下拉框。每一种下拉框有唯一标识的配置想，并且互斥（外健下拉框和级联下拉框都要配置data—options）
     *     如果配置了data-dict，则视为字典下拉框，data-dict为加载的数据来源，用于构建ng-options；
     *     如果配置了data-options，则视为外健的下拉框，data-options为加载的数据来源，用于构建ng-options;
     *          data-options有两种格式：
     *              1、只配置已经加载的数组，并且这个数据已经被绑定在scope的作用域链上，（例如：hostList表示$scope.hostList）
     *                  使用这种配置，需要在directive的template阶段拼接ng-options中前面的部分，（例如下拉框字典：opt.id as opt.name for opt in hostList）
     *              2、当下拉框的显示值由数据源model中的多个字段共同组成时，可配置ng-options中的全部内容，（例如下拉框外健：opt.id as (opt.hostname +' <' + opt.hostnumber + '>') for opt in hostList）
     *                  使用这种配置，直接将配置信息当作ng-options即可
     *     如果配置了data-trigger，则视为级联下拉菜单，data-trigger为上一级下拉框的id;
     *          此外，还要配置data-options（用于构建ng-options）、data-source-model（加载数据使用的模型名称）、data-load-condition：（加载数据源时的条件，例如：{include:['cfg_host']}）、data-load-method:加载数据的方法
     *
     *  7、插槽式字段：slot  “”
     *
     *  此外，每一种表单控件都可以配置以下属性：
     *   1、data-type:控件类型
     *   2、data-model:ng-model
     *   3、data-required:必填
     *   4、data-disabled:ng-disabled
     *   5、data-id：id
     *   6、data-name：name
     */
    module.directive('phoFormControls', ['PhoebeResource',
        function (PhoebeResource) {
            //根据配置属性构造属性字符串
            function buildAttrbutes(attr) {
                var str = '';
                for (var k in attr.$attr) {
                    switch (k) {
                        //type属性不用加到标签中
                        case 'type':
                            break;
                        //将model设置为ng-model指令
                        case 'model':
                            str += ' ng-model="' + attr[k] + '"';
                            break;
                        //name是控件的中文名，不用加到标签中
                        case 'name':
                            break;
                        //将disabled设置为ng-disabled指令
                        case 'disabled':
                            attr[k] = attr[k] || true;
                            str += ' ng-disabled="' + attr[k] + '"';
                            break;
                        case 'required':
                            str += ' ng-required="true"';
                            break;
                        case 'dict':
                            //字典表下拉菜单
                            str += ' ng-options="opt.key as opt.value for opt in ' + attr[k] + '"';
                            break;
                        case 'options':
                            //外健下拉框或者二级下拉框
                            if (attr[k].split(' ').length > 1) { //给出全部配置
                                str += ' ng-options="' + attr[k] + '"';
                            } else { //只配置数据来源
                                str += ' ng-options="opt.id as opt.name for opt in ' + attr[k] + '"';
                            }
                            break;
                        case 'style':
                            //自定义样式
                            str += ' style="' + attr[k] + '"';
                            break;
                        case 'change':
                            //绑定ng-change事件
                            str += ' ng-change="' + attr[k] + '"';
                            break;
                        //将其他属性直接添加到标签中
                        case 'id':
                            str += ' id="' + attr[k] + '"';
                            break;
                        default:
                            str += ' ' + attr.$attr[k] + '="' + attr[k] + '"';
                            break;
                    }
                }
                return str;
            }

            //根据表单控件类型构造字符串
            function buildWidget(attrs) {
                var name = attrs.name ? attrs.name + '：' : '',
                    str = '<div class="form-element"><label class="form-label">' + name + '</label><div class="form-content">';
                switch (attrs.type) {
                    case 'input':
                        str += '<input class="col-xs-12" type="text"' + buildAttrbutes(attrs) + '/></div></div>';
                        break;
                    case 'number':
                        str += '<input class="col-xs-12" type="number"' + buildAttrbutes(attrs) + '/></div></div>';
                        break;
                    case 'textarea':
                        str += '<textarea class="col-xs-12"' + buildAttrbutes(attrs) + '></textarea></div></div>';
                        break;
                    case 'datepicker':
                        str += '<div class="input-group"><input class="form-control date-picker" type="text" pho_datepicker' + buildAttrbutes(attrs) + '/><span class="input-group-addon"><i class="fa fa-calendar bigger-110"></i></span></div></div></div>';
                        break;
                    case 'dropdown':
                        str += '<select class="col-xs-12"' + buildAttrbutes(attrs) + '><option value="">请选择</option></select></div></div>';
                        break;
                    /*case 'checkbox':
                     var dataSource = attrs['source'];
                     str += '<ul class="checkbox-list"><li ng-repeat="equipment in equipmentList"><a href="javascript:void(0);" data-code="{{equipment.code}}">{{equipment.name}}</a></li></ul></div></div>';
                     break;
                     case 'radiobox':
                     break;*/
                    default:
                        break;
                }
                return str;
            }

            return {
                restrict: 'E',
                template: function (tElement, tAttr) {
                    return buildWidget(tAttr);
                },
                replace: true,
                transclude: true,
                link: function (scope, iElement, iAttrs) {
                    var s = scope;
                    //级联下拉菜单的触发事件
                    if (iAttrs.trigger) {
                        var model = iAttrs.trigger,
                        //确保dataSource指向下拉菜单数据源的名称
                            dataSource = iAttrs.options.split(' ').pop(),
                            dataSourceModuleName = iAttrs.sourceModel,
                            loadCondition = {},
                            loadMethod = 'query';
                        if (iAttrs.loadCondition) {
                            loadCondition = $.parseJSON(iAttrs.loadCondition.replace(/'/g, '"'));
                        }
                        scope.$watch(model, function (nv, ov, scope) {
                            if (nv) {
                                var module = new PhoebeResource('/' + dataSourceModuleName);
                                module[loadMethod](typeof(loadCondition) == 'string' ? {} : loadCondition).success(function (data) {
                                    scope[dataSource] = data;
                                }).error(function () {
                                    $.tips('加载级联下拉框数据失败！', 'error');
                                });
                            }
                        });
                    }
                }
            };
        }
    ]);
    /**
     * 根据表单配置的json串构建表单控件
     * 要配置的项有：
     *      data-controllers:表单控件的配置数据，该值应该有一个scope上的属性与之对应，phoAutoForm会监听scope上的‘controllers’，若有变化，则重新渲染表单
     *      data-model-name：表单初始化数据的名称，例如在scope中是scope.item，那么这里就写item
     */
    module.directive('phoAutoForms', ['PhoebeDict', 'PhoebeResource',
        function (PhoebeDict, PhoebeResource) {
            //将属性列表按照某字段排序
            function sortByKey(data, key) {
                if (!key) {
                    return data;
                }
                for (var i = 1, l = data.length; i < l; i++) {
                    if (data[i][key] < data[i - 1][key]) {
                        var j = i - 1;
                        var x = data[i][key];
                        data[i][key] = data[i - 1][key];
                        while (data[j] && x < data[j][key]) {
                            data[j + 1][key] = data[j][key];
                            j--;
                        }
                        data[j + 1][key] = x;
                    }
                }
                return data;
            }

            //拼接HTML文档
            function buildHTML(attrs) {
                //        var str = '<div class="row">';
                var str = '';
                angular.forEach(attrs, function (attr) {
                    str += '<div class="col-xs-' + attr.grids + '"><div class="form-element"><label class="form-label">' + attr.cnName + '：</label><div class="form-content">';
                    var type = attr.type;
                    switch (type) {
                        case 'input':
                            str += '<input type="text" class="form-control ' + attr.enName + '"></div></div></div>';
                            break;
                        case 'datepicker':
                            str += '<div class="input-group"><input class="form-control date-picker ' + attr.enName + '" /><span class="input-group-addon"><i class="fa fa-calendar bigger-110"></i></span></div></div></div></div>';
                            break;
                        case 'textarea':
                            str += '<textarea class="col-xs-12 ' + attr.enName + '"></textarea></div></div></div>';
                            break;
                        case 'dropdown_dict':
                            str += '<select class="form-control ' + attr.enName + '"><option value="">请选择</option></select></div></div></div>';
                            break;
                        case 'dropdown_foreign':
                            str += '<select class="form-control ' + attr.enName + '"><option value="">请选择</option></select></div></div></div>';
                            break;
                        /*case 'checkbox':
                         break;
                         case 'radiobox':
                         break;*/
                        default:
                            break;
                    }
                });
                //        str += '</div>';
                return str;
            }

            //控件初始化和赋值
            function initialize(attrs, modelName, scope) {
                var model = angular.copy(scope[modelName]) || {};
                angular.forEach(attrs, function (attr) {
                    var type = attr.type,
                        enName = attr.enName,
                        $$el = $$('.' + enName);
                    switch (type) {
                        case 'input':
                            break;
                        case 'textarea':
                            break;
                        case 'datepicker':
                            //日期选择框，先初始化然后赋值
                            $$el.datepicker({
                                'autoclose': true,
                                'format': attr.dateFormat || 'yyyy-mm-dd'
                            });
                            $$el.next().on('click', function () {
                                $(this).prev().focus();
                            });
                            break;
                        case 'dropdown_dict':
                            //字典表下拉框，先生成下拉菜单。 如果没有加载字典项，加载之
                            var dictName = attr.dictName;
                            if (!scope.dicts || !scope.dicts[dictName]) {
                                PhoebeDict.preload([dictName]).success(function (data) {
                                    if (!scope.dicts) {
                                        scope.dicts = {};
                                    }
                                    scope.dicts[dictName] = PhoebeDict.getDict([dictName]).dictoptions;
                                    fillInOptions($$el, scope.dicts[dictName], 'key', 'value');
                                });
                            } else {
                                fillInOptions($$el, scope.dicts[dictName], 'key', 'value');
                            }
                            break;
                        case 'dropdown_foreign':
                            //外健下拉菜单，先生成下拉菜单。如果没有数据，加载之
                            var foreignModel = attr.foreighModel,
                            //所有外健下拉菜单数据名==外健模型名+‘List’
                                optionsName = foreignModel + 'List';
                            if (optionsName) {
                                if (!scope[foreignModel]) {
                                    var loadCondition;
                                    if (attr.foreignSearchStr) {
                                        loadCondition = $.parseJSON(attr.foreignSearchStr.replace(/'/g, '"'));
                                    }
                                    new PhoebeResource('/' + foreignModel).query(loadCondition || {}).success(function (data) {
                                        scope[optionsName] = data;
                                        fillInOptions($$el, scope[optionsName], 'id', 'name');
                                    }).error('加载外健下拉列表失败！', 'error');
                                } else {
                                    fillInOptions($$el, scope[optionsName], 'id', 'name');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    //如果有初始值，赋值
                    if (model[enName]) {
                        setValue($$el, type, model[enName]);
                    }
                });
                //向下拉框加入选项
                function fillInOptions(el, options, key, value) {
                    var str = '';
                    angular.forEach(options, function (o) {
                        str += '<option value="' + o[key] + '">' + o[value] + '</option>';
                    });
                    el.append($$(str));
                }
            }

            //赋值
            function setValue(el, type, val) {
                if (!val) {
                    return false;
                }
                switch (type) {
                    /*case 'datepicker':

                     break;*/
                    case 'dropdown_dict':
                        break;
                    case 'dropdown_foreign':
                        break;
                    default:
                        el.val(val);
                        break;
                }
            }

            //取值方法，返回所有表单控件值组成的json串
            function getValues(attrs) {
                var o = {};
                angular.forEach(attrs, function (attr) {
                    var key = attr.enName,
                        $$el = $$('.' + key);
                    o[key] = $$el.val();
                });
                return o;
            }

            //表单初始化赋值方法
            function setValues(attrs, modelName, scope) {
                if (!scope[modelName]) {
                    return false;
                }
                var obj = scope[modelName];
                angular.forEach(attrs, function (attr) {
                    setValue($$('.' + attr.enName), attr.type, obj[attr.enName]);
                });
            }

            return {
                restrict: 'A',
                replace: false,
                transclude: false,
                template: function (tElement, tAttr) {
                    return '';
                },
                compile: function () {
                    return {
                        pre: function (scope, iElement, iAttrs) {
                            var controllers = iAttrs.controllers;
                            scope.$watch(controllers, function (newVal, oldVal, scope) {
                                var modelName = iAttrs.modelName;
                                if (newVal && newVal.length > 0) {
                                    var formStr = buildHTML(sortByKey(newVal, 'index'), modelName, scope);
                                    $$(iElement).html(formStr);
                                    initialize(newVal, modelName, scope);
                                }
                            });
                        },
                        post: function (scope, iElement, iAttrs) {
                            var id = iAttrs.id;
                            scope['get' + id + 'Values'] = getValues;
                            scope['set' + id + 'Values'] = setValues;
                        }
                    };
                }
            };
        }
    ]);
    /**
     * 2015-01-26
     * author : wizaliu
     * description : 文件上传指令
     */
    module.directive('phoFileUpload', [
        function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                template: function (iElement, iAttrs) {
                    if (!window.FileReader) {
                        $.tips('您使用的浏览器不支持文件上传功能！', 'error');
                    }
                    return '<label class="ace-file-input"><input type="file">' + '<span class="ace-file-container" data-title="选择文件"><span class="ace-file-name" data-title="单击选择文件">' + '<i class=" ace-icon fa fa-upload"></i></span></span><a class="remove" href="#"><i class=" ace-icon fa fa-times"></i></a></label>';
                },
                link: function (scope, iElement, iAttrs) {
                    var id = iAttrs.id;
                    iElement.find('input[type=file]')
                        //                .ace_file_input()
                        .on('change', function (e) {
                            scope.$apply(function () {
                                iElement.find('.ace-file-name').attr('data-title', '单击选择文件');
                                scope.UI = scope.UI || {};
                                scope.UI[id + 'Value'] = {};
                            });
                            var el = $(this),
                                file = e.target.files[0],
                                fileReader = new FileReader();
                            fileReader.onloadend = function (e) {
                                var content = e.target.result,
                                    time = new Date(file.lastModifiedDate),
                                    year = time.getFullYear(),
                                    mon = time.getMonth() + 1,
                                    day = time.getDate();
                                //将文件大小、文件名称、最后修改时间、文件内容组成一个object，放在scope.UI上，属性名称为"data-id"+"Value"
                                scope.$apply(function () {
                                    scope.UI[id + 'Value'] = {
                                        'size': file.size + 'K',
                                        'name': file.name,
                                        'updateTime': year + '-' + mon + '-' + day,
                                        'content': content
                                    };
                                });
                                //将文件名称放在表单控件上
                                iElement.find('.ace-file-name').attr('data-title', file.name);
                            };
                            if (file && !legal(file)) {
                                fileReader.readAsText(file, 'UTF-8');
                            }
                        });
                    //验证选择的文件是否合法
                    function legal(file) {
                        if (iAttrs.maxSize) {
                            var size = file.size / 1024,
                                maxSize = iAttrs.maxSize;
                            if (size > maxSize) {
                                $.tips('所选择的文件大小为【' + size + 'M】，超过了最大限制【' + maxSize + 'M】，请重新选择！', 'error');
                                return 1;
                            }
                        }
                        if (iAttrs.allow) {
                            var allowed = iAttrs.allow,
                                format = file.name.split('.')[1];
                            if (allowed.indexOf(format) == -1) {
                                $.tips('请选择以下格式【' + allowed + '】', 'error');
                                return 1;
                            }
                        }
                        return 0;
                    }

                    //向scope.UI添加一个获取值得方法，方法名为"get"+首字母大写的"data-id"属性+"Value"
                    scope.UI = scope.UI || {};
                    name = id.substr(0, 1).toUpperCase() + id.substr(1);
                    scope.UI['get' + name + 'Value'] = function () {
                        return scope.UI[id + 'Value'];
                    };
                    /**
                     * 向scope.UI添加一个清空值的方法
                     * 用于将scope.UI上保存的该文件的数据清空，同时将文件输入框中的文字恢复成“clear”+首字母大写的"data-id"属性+"Value"
                     * 方法名为"get"+首字母大写的"data-id"属性+"Value"
                     */
                    scope.UI['clear' + name + 'Value'] = function () {
                        iElement.find('input[type=file]').val('');
                        iElement.find('.ace-file-name').attr('data-title', '单击选择文件');
                        scope.$apply(function () {
                            scope.UI[id + 'Value'] = {};
                        });
                    };
                }
            };
        }
    ]);
    /*
     *2015-02-03
     *author : wizaliu
     *description : 树指令，配置项包括：
     *              data-id             树元素的id
     *              data-source         数据来源，必须是scope上的一个属性，如果是异步加载的，
     *              data-idField        树中每个节点的id字段的名字
     *              data-foreignKey     树中每个节点的父节点字段的名字（例如“parentid”）
     *              data-rootLevel      树中第一级节点的父节点id（例如“0000”），这些节点没有父节点，所以父节点不指向任何节点
     *              data-menu           给树配置右键菜单，目前提供添加（add）、编辑（edit）、删除（del）三种，需要几个就配几个，中间用" "隔开（例如：data-menu="add del"）、如果默认三种都要，就写data-menu就可以，不用给值
     *              data-addfun         该属性指向scope上的一个方法，当右键菜单中点击“添加”后，会触发该方法
     *              data-editfun        该属性指向scope上的一个方法，当右键菜单中点击“编辑”后，会触发该方法
     *              data-delfun         该属性指向scope上的一个方法，当右键菜单中点击“删除”后，会触发该方法
     *              data-selectfun      该属性指向scope上的一个方法，当选择树上的一个节点后，触发该方法
     *
     *
     */
    module.directive('phoTree', [
        function () {
            //上下文构造方法
            function ContextMunu(scope, config) {
                if (!config) {
                    $.tips('创建右键菜单失败，因为没有配置项！', 'error');
                }
                this.scope = scope;
                this.config = config;
                this.treeId = config.id;
                this.menuId = config.id + 'Menu';
                this.munus = config.menu;
                return this.buildContextMenu(config);
            }

            ContextMunu.prototype = {
                buildContextMenu: function (config) {
                    function addBtn(arr) {
                        arr.push({
                            text: "添加孩子节点"
                        });
                    }

                    function editBtn(arr) {
                        arr.push({
                            text: "编辑节点"
                        });
                    }

                    function delBtn(arr) {
                        arr.push({
                            text: "删除节点"
                        });
                    }

                    var that = this,
                        treeId = config.id,
                        menuId = treeId + 'Menu',
                        node = $('<ul id="' + treeId + '"></ul>'),
                        menuArr = [],
                        menus = config.menu.split(' ');
                    if (menus.length && menus[0] !== '') {
                        for (var i = 0, l = menus.length; i < l; i++) {
                            var menu = menus[i];
                            switch (menus[i]) {
                                case 'add':
                                    addBtn(menuArr);
                                    break;
                                case 'edit':
                                    editBtn(menuArr);
                                    break;
                                case 'del':
                                    delBtn(menuArr);
                                    break;
                                default:
                                    break;
                            }
                        }
                    } else {
                        addBtn(menuArr);
                        editBtn(menuArr);
                        delBtn(menuArr);
                    }
                    //渲染右键菜单
                    node.appendTo($('body')).kendoContextMenu({
                        filter: '#' + treeId + ' .k-in',
                        dataSource: menuArr,
                        select: function (e) {
                            that.contextMenuHander.call(that, e);
                        }
                    });
                },
                contextMenuHander: function (e) {
                    var that = this;
                    var button = $(e.item);
                    var node = $(e.target);
                    var operType = button.text().substr(0, 2);
                    var treeView = $("#" + that.treeId).data('kendoTreeView');
                    var selectedItem = treeView.dataItem(node);
                    var params = {
                        t: treeView,
                        n: selectedItem
                    };
                    switch (operType) {
                        case '添加':
                            that.scope.addfun(params);
                            break;
                        case '编辑':
                            that.scope.editfun(params);
                            break;
                        case '删除':
                            that.scope.delfun(params);
                            break;
                        default:
                            break;
                    }
                }
            };
            //处理指令
            return {
                restrict: 'E',
                replace: true,
                transclude: false,
                scope: {
                    addfun: '&',
                    editfun: '&',
                    delfun: '&',
                    selectfun: '&',
                    datasource: '=source'
                },
                template: function (iElement, iAttrs) {
                    return '<div id></div>';
                },
                link: function (scope, iElement, iAttrs) {
                    var dataSource = scope.datasource,
                        treeId = iAttrs.id;
                    scope.$watch('datasource', function (newVal, oldVal, scope) {
                        if (newVal !== undefined && newVal.length && newVal.length > 0) {
                            dataSource = scope.datasource;
                            var showField = iAttrs.showfield || 'name';
                            //判断数据源是否被处理过，如果resource中只有一条数据，证明是处理过的，否则是没有处理的
                            if (dataSource.length > 1) {
                                var idField = iAttrs.idField || 'id',
                                    foreignKey = iAttrs.foreignKey || 'parentid',
                                    rootLevel = iAttrs.rootlevel || '0';
                                dataSource = $.toKendoTreeData(dataSource, idField, foreignKey, rootLevel);
                            }
                            //渲染树
                            $("#" + treeId).kendoTreeView({
                                dataSource: dataSource,
                                loadOnDemand: false,
                                dataTextField: showField
                            });
                            var treeView = $("#" + treeId).data('kendoTreeView');
                            treeView.expand('.k-item');
                            //如果有data-selectfun，则在选择树节点时触发该方法
                            if (iAttrs.selectfun) {
                                treeView.bind("select", function (e) {
                                    scope.selectfun({
                                        t: treeView,
                                        n: treeView.dataItem(e.node)
                                    });
                                });
                            }
                            //如果配置了右键菜单，则显示
                            if (iAttrs.menu !== undefined) {
                                var menu = new ContextMunu(scope, iAttrs);
                            }
                        }
                    });
                }
            };
        }
    ]);
    /**
     * pho:search
     */
    module.directive('phoSearch', ['PhoebeResource',
        function (PhoebeResource) {
            return {
                restrict: 'A',
                scope: {
                    model: '@',
                    showlist: '@',
                    include: '='
                },
                link: function (scope, element, attrs) {
                    var input = element.find("input[data-role='keywords']");
                    //保存searchKye关键字
                    var searchKye = '';
                    //点击搜索字段按钮所响应的动作
                    var UL = $("ul[class='dropdown-menu']");
                    UL.on('click', function (event) {
                        var el = angular.element(event.target),
                            oneSearchKye = el.attr('data-key');
                        //将所选字段项的汉字显示到按钮中
                        angular.element(this).parent().find('.dropdown-toggle').html(el.html() + '<span class="caret">');
                        searchKye = oneSearchKye;
                    });
                    //点击搜索按钮时所响应的动作
                    var searchSubmit = $("button[data-role='searchSubmit']");
                    searchSubmit.click(function () {
                        var inputValue = input.val();
                        //                var inputValue = '';
                        //                var value = input.val();
                        //                console.log(Object.prototype.toString.apply(value));
                        //                var n = Number(value);
                        //                if (!isNaN(n) && value != '')
                        //                {
                        //                    console.log("是数字");
                        //                    inputValue = Number(value);
                        //                    console.log(Object.prototype.toString.apply(inputValue));
                        //                }
                        //                else{
                        //                    inputValue = input.val();
                        //                    console.log("不是数字");
                        //                }
                        //整理查询条件
                        var obj = {},
                        //                    where = {},
                            include = [],
                            like = {};
                        //                where[searchKye] = inputValue;
                        like.field = searchKye;
                        like.val = inputValue;
                        include = scope.include;
                        obj.like = like;
                        obj.include = include;
                        if (searchKye === '') {
                            //进行模糊查询
                            console.log("进行模糊查询");
                            return;
                        } else {
                            //进行精确查询
                            new PhoebeResource('/' + scope.model).query(obj).success(function (data) {
                                var listName = scope.showlist + 'DataSource';
                                scope.$parent.$model[listName] = data;
                            });
                        }
                    });
                }
            };
        }
    ]);
    /**
     * 适用于弹出窗展示、勾选、提交的表格
     * 例如：向集群添加关联节点时，该弹出框内是节点列表，可在该列表做勾选操作，提交时使用所勾选数据的id来更新数据库
     */
    module.directive('phoTableSelect', [
        function () {
            return function (scope, element, attrs) {
                /**
                 * 向scope添加一个属性，属性的名字是attrs['tablename']的值
                 * @type {{
                 *      getSelected     获取表格中所数据的id组成的数组
                 *  }}
                 */
                scope[attrs.tablename] = {
                    init: function () {
                        element.find('tr').removeClass('table-mini-tr-selected');
                        angular.forEach(element.find('input[type=checkbox]'), function (c) {
                            c.checked = false;
                        });
                    },
                    getSelected: function () {
                        var arr = [],
                            els = element.find('input[type=hidden]');
                        angular.forEach(els, function (el) {
                            var $$el = $$(el);
                            if ($$el.parent().find('input[type=checkbox]')[0].checked) {
                                arr.push($$(el).val());
                            }
                        });
                        return arr;
                    }
                };
                //单选
                element.delegate('tbody tr', 'click', function (e) {
                    e.preventDefault();
                    var $$this = $$(this);
                    if ($$this.hasClass('table-mini-tr-selected')) {
                        $$this.removeClass('table-mini-tr-selected').find('input[type=checkbox]')[0].checked = false;
                    } else {
                        $$this.addClass('table-mini-tr-selected').find('input[type=checkbox]')[0].checked = true;
                    }
                });
                //全选
                element.delegate('thead input[type=checkbox]', 'click', function (e) {
                    var that = this,
                        checked = that.checked,
                        trs = $$(this).closest('table').find('tbody tr');
                    if (checked) {
                        angular.forEach(trs, function (tr) {
                            $$(tr).addClass('table-mini-tr-selected').find('input[type=checkbox]')[0].checked = true;
                        });
                    } else {
                        angular.forEach(trs, function (tr) {
                            $$(tr).removeClass('table-mini-tr-selected').find('input[type=checkbox]')[0].checked = false;
                        });
                    }
                });
            };
        }
    ]);
    module.directive('phoSelect', ['$parse',
        function ($parse) {
            return {
                restrict: 'EAC',
                // templateUrl: '../bower_components/phoebe/templates/pho.select.html',
                template: function (iElement, iAttrs) {
                    return '<select class="chosen-select"></select>';
                },
                scope: {
                    default: '@',
                    valuefidle: '@',
                    labelfidle: '@',
                    model: '@',
                    options: '=',
                    changed: '&',
                    returnObject: '='
                },
                link: function (scope, iElement, iAttrs) {
                    // init val.
                    var width = (iAttrs.hasOwnProperty('width')) ? iAttrs.width : '60%';
                    var select = iElement.find('.chosen-select');
                    // Construction the select.
                    scope.$watch('options', function (vals) {
                        if (vals) {
                            var html = '<option value="" selected>-- ' + scope.
                                default + ' --</option>';
                            angular.forEach(vals, function (option) {
                                html += '<option value="' + option[scope.valuefidle] + '">' + option[scope.labelfidle] + '</option>';
                            });
                            select.append(html);
                            select.chosen().next().css({
                                'width': width
                            });
                        }
                    });
                    // changed.
                    select.on('change', function () {
                        //
                        if (scope.returnObject === true) {
                            for (var i = 0; i < scope.options.length; i++) {
                                if (scope.options[i][scope.valuefidle] === select.val()) {
                                    scope.$parent[scope.model] = scope.options[i];
                                }
                            }
                        } else {
                            scope.$parent[scope.model] = select.val();
                        }
                        if (scope.changed) scope.changed();
                        scope.$parent.$apply();
                    });
                }
            };
        }
    ]);
    /**
     * 下拉框联动
     */
    module.directive('phoLinkage', function () {
        return function (scope, element, attrs) {
            var data = scope[attrs.ngModel],
                selectors = element.find('select'),
                selectors_arr = [];
            angular.forEach(selectors, function (selector) {
                selectors_arr.push(angular.element(selector).attr('id'));
            });
            var c = $.linkage(selectors_arr, data, '');
        };
    });
    /**
     * 分页控件
     * pho-Pagination
     * usage :
     *      <pho-pagination></pho-pagination>
     */
    module.directive('phoPagination', function () {
        return {
            restrict: 'E',
            template: '<ul class="pagination">' + '<li class="prev"  ng-class="prevPageDisabled()"><a href="#" ng-click="firstPage()"><i class="fa fa-angle-double-left"></i></a></li>' + '<li class="prev"  ng-class="prevPageDisabled()"><a href="#" ng-click="prevPage()"><i class="fa fa-angle-left"></i></a></li>' + '<li ng-repeat="n in range()" ng-class="{active: n == pagination.currentPage}" ng-click="setPage(n)"><a href="#">{{n+1}}</a></li>' + '<li class="next" ng-class="nextPageDisabled()"><a href="#" ng-click="nextPage()"><i class="fa fa-angle-right"></i></a></li>' + '<li class="next" ng-class="nextPageDisabled()"><a href="#" ng-click="lastPage()"><i class="fa fa-angle-double-right"></i></a></li>' + '</ul>',
            replace: true,
            link: function (scope, element, attrs) {
                //添加一个对表格数据长度的监听，当数据发生变化时，初始化分页控件
                scope.$watch('items.length', function (newValue, oldValue, scope) {
                    if (!scope.pagination) {
                        if (!scope.items || !scope.items.length) {
                            scope.items = [];
                        }
                        if (scope.items.length > 0) {
                            scope.initPagination();
                        }
                    } else if (scope.items) {
                        scope.pagination.items = scope.items;
                    }
                });
                scope.initPagination = function () {
                    scope.pagination = {
                        itemsPerPage: 10,
                        items: scope.items,
                        itemCount: scope.items.length,
                        currentPage: 0,
                        active: 0
                    };
                    //选择每页显示条数以后刷新表格
                    scope.reloadTable = function () {
                        scope.pagination.currentPage = 0;
                    };
                    //获取数据条数
                    scope.getItemCount = function () {
                        return scope.pagination.items.length;
                    };
                    scope.getPageCount = function () {
                        var o = scope.pagination;
                        return Math.ceil(o.items.length / o.itemsPerPage) - 1;
                    };
                    scope.setItemsPerPage = function (n) {
                        scope.pagination.itemsPerPage = n;
                        scope.reloadTable();
                    };
                    //跳到第n页
                    scope.setPage = function (n) {
                        scope.pagination.currentPage = n;
                    };
                    //显示几个页的按钮
                    scope.range = function () {
                        var arr = [];
                        var pageCount = scope.getPageCount();
                        for (var i = 0; i < pageCount + 1; i++) {
                            arr.push(i);
                        }
                        return arr;
                    };
                    scope.firstPage = function () {
                        scope.pagination.currentPage = 0;
                    };
                    scope.lastPage = function () {
                        scope.pagination.currentPage = scope.getPageCount();
                    };
                    scope.prevPage = function () {
                        if (scope.pagination.currentPage > 0) {
                            scope.pagination.currentPage--;
                        }
                    };
                    scope.prevPageDisabled = function () {
                        return scope.pagination.currentPage === 0 ? "disabled" : "";
                    };
                    scope.nextPage = function () {
                        var o = scope.pagination;
                        if (o.currentPage < scope.getPageCount()) {
                            scope.pagination.currentPage++;
                        }
                    };
                    scope.nextPageDisabled = function () {
                        return scope.pagination.currentPage === scope.getPageCount() ? "disabled" : "";
                    };
                };
            }
        };
    });
    /**
     * imgupload
     */
    module.directive('phoImg', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="javascript:void(0);">' + '<input type="file" style="width: 100%;height: 100%;position: absolute;top: 0;opacity: 0"/>' + '<img src=""/>' + '</a> ',
                link: function (scope, element, attrs) {
                    var limitSize = attrs.size;
                    element.find('input').attr('ng-disabled', attrs['ng-disabled']).on('change', function (ev) {
                        var target = ev.target;
                        //上传文件尺寸判断
                        if (limitSize) {
                            var size = target.files[0].size;
                            if (parseInt(limitSize, 10) * 1000000 < size) {
                                $.tips("上传图片不能超过" + limitSize + "M,请重新选择图片！", "error");
                                return false;
                            }
                        }
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            element.find('img').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(target.files[0]);
                    });
                }
            };
        }
    ]);
    /**
     * 高度自适应容器
     */
    module.directive('phoContainer', ['$parse',
        function ($parse) {
            return {
                restrict: 'EAC',
                template: '<div></div>',
                replace: true,
                scope: {},
                link: function (scope, iElement, iAttrs) {
                    // Find the parent of the element.
                    var parentElement = iElement.parent();
                    // Cache
                    var fullSize = {
                        width: parentElement.outerWidth(),
                        height: parentElement.outerHeight()
                    };
                    // Set the width.
                    if (!iElement.width()) {
                        if (iAttrs.width) iElement.width(valParser(iAttrs.width, fullSize.width));
                        else iElement.width(fullSize.width);
                    }
                    // Set the height.
                    if (iAttrs.height) iElement.height(valParser(iAttrs.height, fullSize.height));
                    else iElement.height(fullSize.height);
                    // The parser of value.
                    function valParser(value, fullsize) {
                        if (value) {
                            var widthVal;
                            if (value.indexOf('%') > -1) {
                                widthVal = (value.substr(0, value.indexOf('%')) / 100) * fullsize;
                            } else if (value.indexOf('px') > -1) {
                                widthVal = value.substr(0, value.indexOf('px'));
                            } else {
                                widthVal = value;
                            }
                            return widthVal;
                        } else {
                            return 0;
                        }
                    }
                }
            };
        }
    ]);


    /**
     * 2015-04-07  (replace with "pho-form-controls")
     * author ： wizaliu
     * description : 表单控件指令。可使用的表单控件包含以下类型（“ ”中表示该类型可配置的属性和可添加的指令）：
     *
     *  1、输入框        ：text  “”
     *  2、数字          ：number
     *  3、网络地址      ：url
     *  4、邮箱          : email
     *  5、密码          : password
     *  6、文本框        ：textarea  “”
     *  7、日期选择框     ：datepicker  “data-date-format:格式化方式，默认为‘yyyy-mm-dd’；data-role；data-end；data-start”
     *  8、下拉框        ：dropdwon  “data-options:like ng-options directive”
     *
     *  此外，每一种表单控件都可以配置以下属性：
     *   1、data-type                : 控件类型
     *   2、data-id                  ：id
     *   3、data-name                ：name
     *   4、data-model               : ng-model
     *   5、data-options             ：下拉框选项（dropdown独有）
     *   6、data-required            : 必填
     *   7、data-disabled            : disabled
     *     8、data-classes               : 要添加的额外央视
     *     9、data-minlength             :最小长度
     *     10、data-maxlength            :最大长度
     *     11、data-change               :ng-change事件
     *     12、data-keydown              :ng-keydown事件
     *     13、data-keypress             :ng-keypress事件
     *     14、data-keyup                :ng-keyup事件
     *     15、data-style                ：单独设置的样式
     *     16、data-placeholder             ：placeholder
     */
    module.directive('phoFc', ['PhoebeResource',
        function (PhoebeResource) {

            //根据配置属性构造属性字符串
            function buildAttrbutes(attr) {
                var _props = '';
                for (var k in attr.$attr) {
                    switch (k) {
                        //type属性不用加到标签中
                        case 'type':
                            break;
                        //name是控件的中文名，不用加到标签中
                        case 'name':
                            break;
                        case 'id':
                            _props += ' id="' + attr[k] + '"';
                            break;
                        //将model设置为ng-model指令
                        case 'model':
                            _props += ' ng-model="' + attr[k] + '"';
                            break;
                        case 'value':
                            _props += ' value="'+attr[k]+'"';
                            break;
                        case 'required':
                            _props += ' required';
                            break;
                        case 'disabled':
                            _props += ' disabled';
                            break;
                        case 'readonly':
                            _props += ' readonly';
                            break;
                        case 'minlength':
                            _props += ' ng-minlength="' + attr[k] + '"';
                            break;
                        case 'maxlength':
                            _props += ' ng-maxlength="' + attr[k] + '"';
                            break;
                        case 'options':
                            _props += ' ng-options="' + attr[k] + '"';
                            break;
                        case 'style':
                            _props += ' style="' + attr[k] + '"';
                            break;
                        case 'change':
                            _props += ' ng-change="' + attr[k] + '"';
                            break;
                        case 'keydown':
                            _props += ' ng-keydown="' + attr[k] + '"';
                            break;
                        case 'keypress':
                            _props += ' ng-keypress="' + attr[k] + '"';
                            break;
                        case 'keyup':
                            _props += ' ng-keyup="' + attr[k] + '"';
                            break;
                        case 'placeholder':
                            _props += ' placeholder="' + attr[k] + '"';
                            break;
                        default:
                            _props += ' ' + attr.$attr[k] + '="' + attr[k] + '"';
                            break;
                    }
                }
                if (attr.classes) {
                    _props += ' class="form-control ' + attr.classes + '"';
                } else {
                    _props += ' class="form-control"';
                }

                return _props;
            }

            //根据表单控件类型构造字符串
            function buildWidget(attrs) {
                var type = attrs.type,
                    cols = attrs.cols ? attrs.cols : '12',
                    name = attrs.name ? attrs.name + '：' : '',
                    _html = '<div class="col-xs-' + cols + '"><div class="form-group form-group-sm"><label for="text" class="control-label">' + name +
                        '</label><div class="form-content">',
                    _htmlInner = '';

                switch (type) {
                    case 'text' :
                        _htmlInner += '<input type="text" ' + buildAttrbutes(attrs) + '/>';
                        break;
                    case 'number' :
                        _htmlInner += '<input type="number" ' + buildAttrbutes(attrs) + '/>';
                        break;
                    case 'url' :
                        _htmlInner += '<input type="url" ' + buildAttrbutes(attrs) + '/>';
                        break;
                    case 'email' :
                        _htmlInner += '<input type="email" ' + buildAttrbutes(attrs) + '/>';
                        break;
                    case 'password' :
                        _htmlInner += '<input type="password" ' + buildAttrbutes(attrs) + '/>';
                        break;
                    case 'textarea' :
                        _htmlInner += '<textarea rows="5" ' + buildAttrbutes(attrs) + '></textarea>';
                        break;
                    case 'dropdown' :
                        _htmlInner += '<select ' + buildAttrbutes(attrs) + '><option value="">请选择</option></select>';
                        break;
                    case 'datepicker' :
                        _htmlInner += '<div class="input-group">' + '<input type="text" pho-date' + buildAttrbutes(attrs) + ' readonly/>' + '<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span></div>';
                        break;
                    default :
                        break;
                }

                //handle the "data-th" property
                if (attrs.th && type !== 'datepicker'){
                    var th = attrs.th,
                        inner = '';
                    if (th === 'date'){
                        inner = '<i class="glyphicon glyphicon-th"></i>';
                    } else {
                        inner = th;
                    }
                    _html += '<div class="input-group">' + _htmlInner + '<span class="input-group-addon">'+inner+'</span></div></div></div></div>';
                } else {
                    _html += _htmlInner + '</div></div></div>';
                }

                return _html;
            }

            return {
                restrict: 'E',
                template: function (tElement, tAttr) {
                    return buildWidget(tAttr);
                },
                replace: true,
                transclude: true,
                link: function (scope, iElement, iAttrs) {
                    //去掉文本框的尺寸限制
                    if (iAttrs.type === 'textarea') {
                        $(iElement).find('.form-group').removeClass('form-group-sm');
                    }
                }
            };
        }
    ]);


    /**
     * 20150408 (replace with "pho-datepicker")
     * author : wizaliu
     * description : 日期选择框
     * usage :
     *
     * 参数：data-role-->日期选择框类型：start（开始时间）、end（结束时间）、beforetoday（所选日期不能大于今天）
     *      data-start-->与结束时间对应的开始时间的id
     *      data-end-->与开始时间对应的结束时间的id
     *      data-form-->制定时间选择框的选择范围，即只能选data-form规定之后的时间
     *      data-to-->制定时间选择框的选择范围，即只能选data-form规定之前的时间
     *      data-format-->日期选择框显示格式
     *
     */
    module.directive('phoDate', [function () {
        return {
            restrict: 'EA',
            transclude: false,
            template: function (iElement, iAttrs) {
                var attr = iAttrs.$attr;
                if (attr.phoDate) {
                    return '';
                }

                //如果使用原生指令，则需要整理配置项
                var _props = '';
                for (var k in attr) {
                    switch (k) {
                        case 'model':
                            _props += ' ng-model="' + iAttrs[k] + '"';
                            break;
                        case 'id':
                            _props += ' id="' + iAttrs[k] + '"';
                            break;
                        case 'required':
                            _props += ' required';
                            break;
                        case 'disabled':
                            _props += ' disabled';
                            break;
                        case 'change':
                            _props += ' ng-change="' + iAttrs[k] + '"';
                            break;
                        case 'style':
                            _props += ' style="' + iAttrs[k] + '"';
                            break;
                        case 'placeholder':
                            _props += ' placeholder="' + iAttrs[k] + '"';
                            break;
                    }
                }

                if (attr.classes) {
                    _props += ' class="form-control ' + iAttrs.classes + '"';
                } else {
                    _props += ' class="form-control"';
                }

                return '<div class="input-group"><input type="text" '+_props+' readonly/><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span></div>';

                // return '<input type="text" ' + _props + ' />';
            },
            link: function (scope, iElement, iAttrs) {
                if (!iAttrs.$attr.phoDate) {
                    iElement = $(iElement).find('input').eq(0);
                }

                //构建配置项
                var config = {},
                    role = iAttrs.role;

                //结束时间
                if (iAttrs.to) {
                    config.endDate = iAttrs.to;
                }
                //开始时间
                if (iAttrs.form) {
                    config.startDate = iAttrs.form;
                }
                
                //there are two kinds of "datepicker", if you need to select "hour" and "minute", we use the second one
                if (iAttrs.format && iAttrs.format.indexOf('hh') > 0){
                    //格式化类型
                    config.format = iAttrs.format;
                    config.autoclose = true;
                    $(iElement).datetimepicker(config);
                } else {
                    //格式化类型
                    if (iAttrs.format) {
                        config.type = iAttrs.format;
                    }
                    if (role && role === 'beforetoday') {
                        var date = new Date(),
                            year = date.getFullYear(),
                            month = date.getMonth() + 1,
                            day = date.getDate(),
                            today = year + '-' + month + '-' + day;

                        config.endDate = today;
                    }
                    $(iElement).cxCalendar(config);
                } 

                /**
                 * 开始时间或结束时间
                 */
                if (role === 'start' || role === 'end') {
                    var startEl, endEl;

                    if (role === 'start') {
                        startEl = iElement;
                        endEl = $('#' + iAttrs.end);
                    } else {
                        startEl = $('#' + iAttrs.start);
                        endEl = iElement;
                    }
                    iElement.on('change', function () {
                        try {
                            var start = new Date(startEl.val() || 0).getTime(),
                                end = new Date(endEl.val() || 0).getTime();

                            if (start && end) {
                                if (end < start) {
//                                    console.log('error!');
                                    $.tips("结束日期不能小于起始日期！", "error");
                                    $(this).val("");
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
                //判断所选日期不能大于今天
                if (role == 'beforetoday') {
                    iElement.on('changeDate', function () {
                        var selected = $(this).val().replace(/-/g, ""),
                            newDate = new Date(),
                            ny = newDate.getFullYear(),
                            nm = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1),
                            nd = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate(),
                            today = ny + "" + nm + "" + nd;
                        if (today < selected) {
                            $.tips("所选日期不能大于今天！", "error");
                            $(this).val("");
                        }
                    });
                }
            }
        };
    }]);

})();


/**
 * ======================================================================================================
 *
 * 2015-04-10
 * 项目中使用的Jquery扩展，这些扩展用directive实现更繁琐，所以用Jquery进行扩展，方便调用。
 * 主要包括两种类型：
 * 1、交互类：提示框、console开关
 * 2、数据处理类 ： 数组去重、格式转换、对象继承...
 *
 * ======================================================================================================
 */
$.extend({
    /**
     * 2015-04-10
     * author : wizaliu
     * description : 提示框
     * @param content
     * @param style
     */
    tips: function (content, style) {
        style = (style === undefined ? "success" : style);
        style = style === 'error' ? 'danger' : style;

        $('#tip_alert').remove();
        var styleSheet = 'position:fixed;top:150px;left:50%;z-index:9999;border-radius:3px;opacity:0.6;width:230px;margin-left:-100px;text-align:center;';
        var _html = '<div id="tip_alert" class="alert alert-' + style + '" style="' + styleSheet + '">' + content + '</div>';
        $('body').append($(_html));
        var $el = $('#tip_alert');
        $el.animate({
            opacity: 1
        }, 200, function () {
            $el.animate({
                opacity: 1
            }, 1000, function () {
                $el.animate({
                    opacity: 0.2
                }, 1500, function () {
                    $el.remove();
                });
            });
        });
    }
});

