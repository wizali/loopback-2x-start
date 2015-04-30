'use strict';

angular.module('app.phoebe')
    .run(['$rootScope', function ($rootScope) {
//catalog tree data, include tree node's name, node's URL

        $rootScope.catalog = [
            {
                name: '资源检索',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: 'jQuery官网',
                        url: 'http://www.hemin.cn/jq/index.html'
                    },
                    {
                        name: 'boorstrap中文网',
                        url: 'http://www.bootcss.com/'
                    },
                    {
                        name: 'loopback官方文档',
                        url: 'http://docs.strongloop.com/pages/viewpage.action?pageId=3836180'
                    },
                    {
                        name: 'mongoDB官方文档',
                        url: 'http://docs.mongoing.com/manual-zh/index.html'
                    },
                    {
                        name: 'javascript标准参考教程',
                        url: 'http://javascript.ruanyifeng.com/'
                    },
                    {
                        name: 'CSS参考手册',
                        url: 'http://css.doyoe.com/'
                    }
                ]
            },
            {
                name: '基础样式',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '按钮',
                        url: '/app/phoebe/demo/button'
                    },
                    {
                        name: '表格',
                        url: '/app/phoebe/demo/table'
                    },
                    {
                        name: 'TAB页面',
                        url: '/app/phoebe/demo/tab'
                    }
                ]
            },
            {
                name: '表单',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '表单组件',
                        url: '/app/phoebe/demo/widget'
                    },
                    {
                        name: '多选框组',
                        url: '/app/phoebe/demo/checkbox'
                    },
                    {
                        name: '单选框',
                        url: '/app/phoebe/demo/radiobox'
                    },
                    {
                        name: '带搜索功能的下拉框',
                        url: '/app/phoebe/demo/searchabledropdown'
                    },
                    {
                        name: '日期选择框',
                        url: '/app/phoebe/demo/datepicker'
                    },
                    {
                        name: '多级下拉联动',
                        url: '/app/phoebe/demo/cascadingdropdown'
                    }
                ]
            },
            {
                name: '基础类插件',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '分页',
                        url: '/app/phoebe/demo/pagination'
                    },
                    {
                        name: '提示框',
                        url: '/app/phoebe/demo/tips'
                    },
                    {
                        name: '弹出框（可伸缩）',
                        url: '/app/phoebe/demo/popbox'
                    }
                ]
            },
            {
                name: '扩展类插件',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '树',
                        url: '/app/phoebe/demo/tree'
                    },
                    {
                        name: '可编辑表格',
                        url: '/app/phoebe/demo/editabletable'
                    },
                    {
                        name: '重复代码块',
                        url: '/app/phoebe/demo/mimeograph'
                    }
                ]
            },
            {
                name: '文件操作',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '文件上传',
                        url: '/app/phoebe/demo/fileupload'
                    },
                    {
                        name: '图片上传（带剪裁功能）',
                        url: '/app/phoebe/demo/imgupload'
                    },
                    {
                        name: 'EXCEL文件导出',
                        url: '/app/phoebe/demo/excelexport'
                    }
                ]
            },
            {
                name: '其它',
                url: 'javascript:void(0);',
                children: [
                    {
                        name: '开启/关闭console',
                        url: '/app/phoebe/demo/console'
                    }
                ]
            }
        ];
    }]);