export default {
    onlineColumns: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '客户名称',
            align: 'center',
            key: 'customName'
        },
        {
            title: '商户名称',
            align: 'center',
            key: 'shopName'
        },
        {
            title: '合作内容',
            align: 'center',
            key: 'cooperationContent'
        },
        {
            title: '上线日期',
            align: 'center',
            key: 'onlineTime',
            width:100
        },
        {
            title: '下线日期',
            align: 'center',
            key: 'offlineTime',
            width:100

        },
        {
            title: '价格',
            align: 'center',
            key: 'price'
        }, {
            title: '上月计费',
            align: 'center',
            key: 'lastMonthCost'
        }, {
            title: '累计计费',
            align: 'center',
            key: 'totalCost'
        }, {
            title: '操作人',
            align: 'center',
            key: 'operationName'
        }, {
            title: '操作时间',
            align: 'center',
            key: 'operationTime',
            width:100
        }
    ],
    onlineRecordColumns: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '日期',
            align: 'center',
            key: 'date'
        },
        {
            title: '客户名称',
            align: 'center',
            key: 'customName'
        },
        {
            title: '商户名称',
            align: 'center',
            key: 'shopName'
        },
        {
            title: '合作内容',
            align: 'center',
            key: 'cooperationContent'
        },
        {
            title: '上线日期',
            align: 'center',
            key: 'onlineTime',
            width:100
        },
        {
            title: '下线日期',
            align: 'center',
            key: 'offlineTime',
            width:100
        },
        {
            title: '价格',
            align: 'center',
            key: 'price'
        }, {
            title: '商户当前状态',
            align: 'center',
            key: 'shopNowStatusName'
        }
    ],
    monthDetailColumns: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '月份',
            align: 'center',
            key: 'reportMonth'
        },
        {
            title: '客户名称',
            align: 'center',
            key: 'customName'
        },
        {
            title: '商户名称',
            align: 'center',
            key: 'shopName'
        },
        {
            title: '合作内容',
            align: 'center',
            key: 'cooperationContent'
        },
        {
            title: '上线日期',
            align: 'center',
            key: 'onlineTime'
        },
        {
            title: '下线日期',
            align: 'center',
            key: 'offlineTime'
        },
        {
            title: '计费周期',
            align: 'center',
            key: 'billingCycle'
        }, {
            title: '价格',
            align: 'center',
            key: 'price'
        }, {
            title: '本月计费时长(单位月)',
            align: 'center',
            key: 'billingMonthTime',
            width:180
        }, {
            title: '本月费用(月*价格)',
            align: 'center',
            key: 'cost',
            width:180
        }
    ]
}
