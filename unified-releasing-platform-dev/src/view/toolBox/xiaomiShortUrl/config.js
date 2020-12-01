export default {
    tableColumns: [
      {
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center',
        key: 'index'
      },{
        title: '日期',
        align: 'center',
        key: 'createTime',
        slot: 'createTime',
        width: 86
      },{
        title: '客户名称',
        align: 'center',
        key: 'customerName',
        // minWidth: 90
      }, {
        title: '计划名称',
        align: 'center',
        key: 'planName',
      }, {
        title: '广告名称',
        align: 'center',
        key: 'adName',
        // minWidth: 90
      }, {
        title: '厂商',
        align: 'center',
        key: 'partnerName',
        width: 90
      },{
        title: '短链',
        align: 'center',
        key: 'adShortUrl',
        slot: 'adShortUrl'
        // minWidth: 90
      }, 
      {
        title: '原链',
        align: 'center',
        key: 'adUrl',
        slot: 'adUrl',
      },{
        title: '加密短链',
        align: 'center',
        key: 'miShortUrl',
        slot: 'miShortUrl',
      },
    ]
  }
  