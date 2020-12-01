export default {
    columnsTop: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '商户名称',
            align: 'center',
            key: 'shopName'
        }, {
            title: '厂商',
            align: 'center',
            key: 'partnerNameList',
            slot: 'partnerNameList'
        },
        {
            title: '投诉日期',
            align: 'center',
            key: 'complaintTime',
            slot: 'complaintTime'
        },
        {
            title: '投诉来源',
            align: 'center',
            key: 'complaintSource',
            slot: 'complaintSource',
            width: 90
        },
        {
            title: '投诉人',
            align: 'center',
            key: 'complaintPerson'
        },
        {
            title: '投诉原因',
            align: 'center',
            key: 'complaintReason',
            slot: 'complaintReason',
            minWidth: 60
        },
        {
            title: '接收投诉人',
            align: 'center',
            key: 'complaintReceiptPerson'
        },
        {
            title: '处理投诉人',
            align: 'center',
            key: 'optUser'
        },
        {
            title: '处理投诉时间',
            align: 'center',
            key: 'createTime',
            slot: 'createTime',
            width: 100
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            slot: 'action',
            width: 70
        }
    ]
}
