export const columns = [
    {
      title:'序号',
      type: 'index',
      width: 65,
      align: 'center',
      key:'index'
    },
    {
        title: 'code',
        key: 'code',
        align: 'center',
        minWidth:100

    },
    // {
    //     title: '完整短链',
    //     key: 'shortUrl',
    //     align: 'center',
    //     minWidth:100
    // },
    {
        title: '短链名称',
        key: 'name',
        align: 'center',
        minWidth:100
    },{
        title: '短链链接',
        key: 'shortUrl',
        slot: 'shortUrl',
        align: 'center',
        minWidth:120
    },
    {
        title: '描述',
        slot: 'urlDesc',
        align: 'center',
        minWidth:230
    },
    {
        title: '原链',
        slot: 'fullUrl',
        align: 'center',
        width:100
    },
    {
        title: '是否关联广告',
        slot: 'isRelevance',
        align: 'center',
        width:110

    },
    {
        title: '广告名称',
        key: 'adName',
        align: 'center',
        minWidth:110

    },
    {
        title: '广告ID',
        slot: 'adId',
        align: 'center',
        minWidth:100

    },
    {
        title: '生效时间',
        slot: 'replaceTime',
        align: 'center',
        width:100

    },
    {
        title: '添加时间',
        slot: 'createTime',
        align: 'center',
        width:100

    },
    {
        title: '更新时间',
        slot: 'updateTime',
        align: 'center',
        width:100
    },
    {
        title: '修改人',
        key: 'updateUser',
        align: 'center',
        minWidth:100

    },
    {
        title: '操作',
        slot: 'operation',
        align: 'center',
        fixed:'right',
        width:'250'
    }
]
