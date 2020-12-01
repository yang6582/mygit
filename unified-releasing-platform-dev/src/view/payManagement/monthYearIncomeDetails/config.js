export default {
    detailsFields: [{
      type: 'selection',
      width: 60,
      align: 'center'
  },{ 
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center'
    },{
      title: '流水编号',
      key: 'createTime',
      slot: 'createTime',
      align: "center"
    },{
      title: '公司名称',
      key: 'customerName',
      align: "center"
    }, {
      title: '入账金额',
      key: 'price',
      align: "center"
    },{
      title: '入账时间',
      key: 'addedPrice',
      align: "center"
    },{
        title: '类型',
        key: 'addedPrice',
        align: "center"
    },{
        title: '可用金额',
        key: 'addedPrice',
        align: "center"
    },{
      title: "抵扣金额",
      width: 120,
      align: "center",
      key: "collectionAmount"
    },]
  }
