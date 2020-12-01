export default {
    columns: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '版本号',
            align: 'center',
            key: 'versionName'
        },
        {
            title: '智能短信数据包',
            align: 'center',
            key: 'msgFileName'
        },
        {
            title: '网络消息数据包',
            align: 'center',
            key: 'networkFileName'
        },
        {
            title: '操作人',
            align: 'center',
            key: 'operatorName'
        },
        {
            title: '操作时间',
            align: 'center',
            key: 'operatorTime'
        }
    ],
    columnsTop: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '版本号',
            align: 'center',
            key: 'versionName'
        },
        {
            title: '智能短信数据包',
            align: 'center',
            slot: 'msgFileName'
        },
        {
            title: '网络消息数据包',
            align: 'center',
            slot: 'networkFileName'
        },
        {
            title: '链接地址',
            align: 'center',
            slot: 'linkUrl'
        },
        {
            title: '链接地址(无标题)',
            align: 'center',
            slot: 'linkUrl2'
        },
        {
            title: '操作人',
            align: 'center',
            key: 'operatorName'
        },
        {
            title: '操作时间',
            align: 'center',
            key: 'operatorTime'
        },
        {
            title: '版本操作',
            align: 'center',
            slot: 'action'
        }
    ]
}
