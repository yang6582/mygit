export default {
    enterpriseMenuColumns: [
      {
        title: '序号',
        type: 'index',
        minWidth: 40,
        align: 'center',
        key: 'index'
      },
      {
        title: '公司名称',
        align: 'center',
        key: 'companyName',
        minWidth: 200
      },
      {
        title: '开票主体',
        align: 'center',
        key: 'serviceName',
        slot: 'serviceName',
        minWidth: 120
      },
      {
        title: '业务类型',
        align: 'center',
        key: 'invoiceBussinessType',
        minWidth: 60
      },{
        title: '开票金额',
        align: 'center',
        key: 'invoiceMoney',
        slot: 'invoiceMoney',
        minWidth: 100
      },{
        title: '应收金额',
        align: 'center',
        key: 'realIncome',
        slot: 'realIncome',
        minWidth: 100
      },
      {
        title: '状态',
        align: 'center',
        key: 'invoiceStatus',
        slot: 'invoiceStatus',
        minWidth: 60
      },{
        title: '失败原因',
        align: 'center',
        key: 'rejectedReason',
        slot: 'rejectedReason',
        minWidth: 60
      },{
        title: '申请时间',
        align: 'center',
        key: 'createTime',
        slot: 'createTime',
        minWidth: 100
      },{
        title: '开票时间',
        align: 'center',
        key: 'statusOperTime',
        slot: 'statusOperTime',
        minWidth: 100
      },{
        title: '账期',
        align: 'center',
        key: 'billDate',
        slot: 'billDate',
        minWidth: 100
      },{
        title: '申请人',
        align: 'center',
        key: 'applyUser',
        minWidth: 100
      },{
        title: '开票人',
        align: 'center',
        key: 'statusOperUser',
        minWidth: 100
      },{
        title: '发票号',
        align: 'center',
        key: 'invoiceNos',
        slot: 'invoiceNos',
        minWidth: 100
      },{
        title: '操作',
        align: 'center',
        key: 'action',
        slot: 'action',
        minWidth: 180
      }
    ]
  }
  