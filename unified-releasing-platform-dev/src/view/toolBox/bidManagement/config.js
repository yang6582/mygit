export default {
    bidFields: [
      { 
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        fixed: 'left'
      },
      {
        title: '竞价日期',
        key: 'bidDate',
        slot: 'bidDate',
        align: "center",
        minWidth: 100,
        fixed: 'left'
      },
      {
        title: '竞价广告',
        align: "center",
        key: 'adName',
        slot: 'adName',
        minWidth: 100,
        fixed: 'left'
      },
      {
        title: '状态',
        align: "center",
        width: 80,
        key: 'status',
        slot: 'status'
      },{
        title: '参与竞价客户个数',
        align: "center",
        key: 'joinCount',
        minWidth: 100
      },{
        title: '起拍竞价（元）',
        align: "center",
        key: 'initPrice',
        minWidth: 100
      },{
        title: '最高竞拍价格（元）',
        align: "center",
        key: 'finalPrice',
        minWidth: 100
      },{
        title: '竞拍成功客户',
        align: "center",
        key: 'successCustomerNames',
        slot: 'successCustomerNames',
        minWidth: 110
      },{
        title: '发起竞价人',
        align: "center",
        key: 'creator',
        minWidth: 100
      },{
        title: '创建时间',
        align: "center",
        key: 'createTime',
        slot: 'createTime',
        minWidth: 100
      },{
        title: '更新时间',
        align: "center",
        key: 'updateTime',
        slot: 'updateTime',
        minWidth: 100
      },{
        title: '操作',
        align: "center",
        key: 'operator',
        slot: 'operator',
        minWidth: 186
      },
    ],
    detailsFields: [{ 
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center'
    },{
      title: '更新时间',
      key: 'createTime',
      slot: 'createTime',
      align: "center"
    },{
      title: '竞价客户',
      key: 'customerName',
      align: "center"
    }, {
      title: '出价（元）',
      key: 'price',
      align: "center"
    },{
      title: '增加出价（元）',
      key: 'addedPrice',
      align: "center"
    },]
  }
