export const columns = [
    {
        type: 'selection',
        width: 60,
        align: 'center',
       // fixed: 'left'
    },
    {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
       // fixed: 'left'
    },
    {
        title: '商户名称',
        key: 'name',
        align: 'center',
        minWidth: 100,
        // fixed: 'left'
    },
    {
        title: '主号码',
        key: 'primaryPhone',
        align: 'center',
        minWidth: 100
    },
    {
        title: 'Logo',
        slot: 'logo',
        align: 'center',
        minWidth: 100


    },
    {
        title: '行业',
        slot: 'industry',
        align: 'center',
        minWidth: 100


    },
    {
        title: '定制状态',
        slot: 'customStatus',
        align: 'center',
        minWidth: 120


    },
    {
        title: '可送审vivo',
        slot: 'smsMenuNeedVivoApproval',
        align: 'center',
        minWidth: 100

    },
    {
        title: 'vivo状态',
        slot: 'vivoApprovalStatus',
        align: 'center',
        minWidth: 100


    },
    {
        title: 'vivo回传结果',
        slot: 'vivoApprovalDetail',
        align: 'center',
        minWidth: 110


    },
    {
        title: '更新时间',
        slot: 'customTime',
        align: 'center',
        width: 100

    },
    {
        title: '定时上线时间',
        slot: 'autoOnlineTime',
        align: 'center',
        width: 109

    },
    {
        title: '是否人工干预',
        slot: 'manual_inteervention',
        align: 'center',
        width: 120
    },
    {
        title: '操作',
        slot: 'operator',
        align: 'center',
        width: 320,
      //  fixed: 'right'
    }
]
export const columnsNoVivo = [
    {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center'
    },
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '商户名称',
        key: 'name',
        align: 'center'
    },
    {
        title: '主号码',
        key: 'primaryPhone',
        align: 'center'

    },
    {
        title: 'Logo',
        slot: 'logo',
        align: 'center'

    },
    {
        title: '行业',
        slot: 'industry',
        align: 'center'

    },
    {
        title: '定制状态',
        slot: 'customStatus',
        align: 'center'

    },
    {
        title: '定时上线时间',
        key: 'autoOnlineTime',
        align: 'center',
        width: 109

    },
    {
        title: '更新时间',
        slot: 'customTime',
        align: 'center',
        width: 100
    },
    // {
    //     title: '是否人工干预',
    //     slot: 'manual_inteervention',
    //     align: 'center'
    // },
    {
        title: '操作',
        slot: 'operator',
        align: 'center',
        width: 250
    }
]
export const customOptions2 = {
    0: '未定制线上无',
    1: '已定制已上线',
    2: '已定制未上线',
    3: '未定制线上有',
    4: '已定制未同步'
}
export const vivoApprovalStatusName = {
    0: '通过',
    1: '拒绝',
    2: '未送审',
    3: '已送审'
}
