export const menuData = [
    {
        id: '0',
        title: '系统首页',
        index: '/system',
        icon: 'HomeIcon'
    },
    {
        id: '1',
        title: '组件',
        index: '1',
        icon: 'CalendarIcon',
        children: [
            {
                pid: '1',
                id: '11',
                title: '表单',
                index: '/form',
            },
            {
                pid: '1',
                id: '12',
                title: '上传',
                index: '/upload',
            }
        ]
    },
    {
        id: '3',
        title: '表格',
        index: '3',
        icon: 'CalendarIcon',
        children: [
            {
                id: '31',
                pid: '3',
                index: '/table',
                title: '基础表格',
            },
            {
                id: '32',
                pid: '3',
                index: '/table-editor',
                title: '可编辑表格',
            },
        ]
    }
]