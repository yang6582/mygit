export default {
    yearOptTable: [
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
        key: 'customerName'
      },{
        title: '商户名称',
        align: 'center',
        key: 'shopName'
      },
      {
        title: '合作内容',
        align: 'center',
        key: 'content',
        slot: 'content'
      },
      {
        title: '上线日期',
        align: 'center',
        key: 'onlineDate',
        slot: 'onlineDate'
      },
      {
        title: '下线日期',
        align: 'center',
        key: 'offlineDate',
        slot: 'offlineDate'
      },
      {
        title: '当前状态',
        align: 'center',
        key: 'status',
        slot: 'status'
      },{
        title: '价格',
        align: 'center',
        key: 'price'
      },{
        title: '操作人',
        align: 'center',
        key: 'operator'
      },{
        title: '操作时间',
        align: 'center',
        key: 'operateTime',
        slot: 'operateTime'
      },
    ]
  }
