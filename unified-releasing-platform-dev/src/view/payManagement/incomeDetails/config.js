export default {
    detailsFields: [
      {
        // type: 'selection',
        title: '选择',
        width: 65,
        align: 'center',
        key: 'id',
        slot: 'id'
    },{
      title: '流水编号',
      key: 'serialNumber',
      align: "center"
    },{
      title: "回款主体",
      align: "center",
      key: "collectionSubject",
    },{
      title: '公司名称',
      key: 'companyName',
      align: "center"
    }, {
      title: '入账金额',
      key: 'entryAmount',
      slot: 'entryAmount',
      align: "center"
    },{
      title: '入账日期',
      key: 'entryDate',
      slot: 'entryDate',
      align: "center"
    },{
        title: '类型',
        key: 'entryType',
        align: "center"
    },{
        title: '可用金额',
        key: 'availableDeductionAmount',
        slot: 'availableDeductionAmount',
        align: "center"
    },{
      title: "抵扣金额",
      width: 120,
      align: "center",
      key: "collectionAmount",
      slot: "collectionAmount"
    },]
  }
