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
            title: '公司',
            align: 'center',
            key: 'customerName',
            minWidth:80
        },
        {
            title: '计划',
            align: 'center',
            key: 'planName',
            minWidth:80

        },
        {
            title: '广告名称',
            align: 'center',
            key: 'adName',
            minWidth:90

        },
        {
            title: '链接',
            align: 'center',
            slot: 'adUrl',
            minWidth:70

        },
        {
            title: '单价',
            align: 'center',
            key: 'adPrice',
            minWidth:70

        }, 
        // {
        //     title: '广告类型',
        //     align: 'center',
        //     key: 'adChargedTypeName'
        // },
         {
            title: '广告渠道',
            align: 'center',
            key: 'adPositionTypeName',
            minWidth:90

        }, {
            title: '厂商',
            align: 'center',
            key: 'partnerName',
            minWidth:70

        }, {
            title: '操作人',
            align: 'center',
            key: 'optUser',
            minWidth:90

        },
    ],
    adjustColumns: [
        {
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },
        {
            title: '广告名称',
            align: 'center',
            key: 'adName',
            minWidth:90

        },
        {
            title: '链接',
            align: 'center',
            slot: 'adUrl',
            minWidth:70

        },
        {
            title: '修改前单价',
            align: 'center',
            key: 'oldPrice',
            minWidth:100

        }, {
            title: '修改后单价',
            align: 'center',
            key: 'newPrice',
            minWidth:100

        }, {
            title: '修改时间',
            align: 'center',
            slot: 'optTime',
            width:100
        }, {
            title: '操作人',
            align: 'center',
            key: 'optUser',
            minWidth:80

        },
    ]
}