export default {
    tableFields: [{
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        key: 'index'
    }, {
        title: '客户名称',
        align: 'center',
        minWidth: 90,
        key: 'customName'
    }, {
        title: '公司名称',
        align: 'center',
        key: 'companyName',
        minWidth: 90
    }, {
        title: '推广产品',
        align: 'center',
        key: 'product',
        minWidth: 90
    }, {
      title: '推广内容',
      align: 'center',
      key: 'content',
      slot: 'content',
      minWidth: 90
    }, {
        title: '结算金额',
        align: 'center',
        key: 'realTotal',
        slot: 'realTotal',
        minWidth: 90
    }],
  enterpriseMenuColumns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      fixed: 'left',
      align: 'center',
      key: 'index'
    }, {
      title: '账期',
      align: 'center',
      minWidth: 80,
      fixed: 'left',
      key: 'statisticsMonth',
      slot: 'statisticsMonth'
    }, {
      title: '客户名称',
      align: 'center',
      minWidth: 90,
      fixed: 'left',
      key: 'customName'
    },
    {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      fixed: 'left',
      minWidth: 110
    },{
      title: '订单编号',
      align: 'center',
      key: 'orderNo',
      minWidth: 100
    },{
      title: '推广产品',
      align: 'center',
      key: 'product',
      minWidth: 90
    }, {
      title: '推广内容',
      align: 'center',
      key: 'content',
      slot: 'content',
      minWidth: 130
    },
    {
      title: '计费方式',
      align: 'center',
      key: 'chargedType',
      slot: 'chargedType',
      minWidth: 90
    },{
      title: '所属版图',
      align: 'center',
      key: 'industry',
      slot: 'industry',
      minWidth: 90
    }, {
      title: '结算金额',
      align: 'center',
      key: 'realTotal',
      slot: 'realTotal',
      sortable: 'custom',
      minWidth: 110
    }, {
      title: '预估金额',
      align: 'center',
      key: 'estimatedAmount',
      slot: 'estimatedAmount',
      sortable: 'custom',
      minWidth: 110
    }, {
      title: 'AE负责人',
      align: 'center',
      key: 'aeManager',
      minWidth: 90
    }, {
      title: '更新时间',
      align: 'center',
      key: 'baseInfoUpdateTime',
      slot: 'baseInfoUpdateTime',
      minWidth: 100
    }, {
      title: '更新人',
      align: 'center',
      key: 'optUser',
      minWidth: 100
    }, {
      title: '操作',
      align: 'center',
      key: 'action',
      slot: 'action',
      minWidth: 130
    }
  ],
  incomeColumns:[
    {
      type: 'selection',
      width: 60,
      align: 'center',
      fixed: 'left',
  },
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index'
    }, {
      title: '账期',
      align: 'center',
      minWidth: 80,
      key: 'statisticsMonth',
    }, {
      title: '客户名称',
      align: 'center',
      minWidth: 90,
      key: 'customName'
    },
    {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      minWidth: 90
    }, {
      title: '结算金额',
      align: 'center',
      key: 'realTotal',
      minWidth: 90
    }, {
      title: '预估金额',
      align: 'center',
      key: 'estimatedAmount',
      minWidth: 110
    },{
      title: '账单编号',
      align: 'center',
      key: 'statementNo',
      minWidth: 100
    }, {
      title: 'AE',
      align: 'center',
      key: 'aeNames',
      slot: 'aeNames',
      minWidth: 90
    },{
      title: '操作人',
      align: 'center',
      key: 'operationUser',
      minWidth: 90
    },{
      title: '操作时间',
      align: 'center',
      key: 'operationTime',
      minWidth: 110
    }, {
      title: '状态',
      align: 'center',
      key: 'collectStatus',
      slot: 'collectStatus',
      minWidth: 100
    }, {
      title: '操作',
      align: 'center',
      key: 'action',
      slot: 'action',
      fixed: 'right',
      minWidth: 210
    }
  ]
}
