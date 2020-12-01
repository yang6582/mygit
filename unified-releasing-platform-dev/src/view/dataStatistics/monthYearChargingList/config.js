export default {
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
      key: 'statisticsMonth'
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
      minWidth: 90,
      key: 'companyName'
    },
    {
      title: '推广产品',
      align: 'center',
      minWidth: 90,
      key: 'product'
    },
    {
      title: '合作内容',
      align: 'center',
      minWidth: 90,
      key: 'contentName'
    },
    {
      title: '计费方式',
      align: 'center',
      key: 'chargedType',
      slot: 'chargedType',
      minWidth: 90
    },
    {
      title: '订单编号',
      align: 'center',
      minWidth: 90,
      key: 'orderNo'
    },
    {
      title: '所属版图',
      align: 'center',
      minWidth: 90,
      key: 'industryName'
    },
    {
      title: '上线日期',
      align: 'center',
      key: 'onlineDate',
      minWidth: 100
    },{
      title: '下线日期',
      align: 'center',
      key: 'offlineDate',
      minWidth: 100
    },
    {
      title: '结算金额',
      align: 'center',
      key: 'settlementAmount',
      // slot: 'realTotal',
      minWidth: 90
    },  {
      title: '年费总和',
      align: 'center',
      key: 'annualFee',
      minWidth: 90
    }, 
    {
      title: 'AE',
      align: 'center',
      key: 'aeManager',
      minWidth: 90
    }, {
      title: '销售',
      align: 'center',
      key: 'salesName',
      minWidth: 90
    }, {
      title: '更新时间',
      align: 'center',
      key: 'updateTime',
      slot: 'updateTime',
      minWidth: 100
    }, {
      title: '更新人',
      align: 'center',
      key: 'updateUser',
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
      minWidth: 100,
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
      key: 'settlementAmount',
      minWidth: 90
    }, 
    // {
    //   title: '预估金额',
    //   align: 'center',
    //   key: 'estimatedAmount',
    //   minWidth: 110
    // },
    {
      title: '账单编号',
      align: 'center',
      key: 'statementNo',
      minWidth: 100
    }, {
      title: '状态',
      align: 'center',
      key: 'collectStatus',
      slot: 'collectStatus',
      minWidth: 100
    }, {
      title: 'AE',
      align: 'center',
      key: 'aeManager',
      minWidth: 90
    },  {
      title: '操作人',
      align: 'center',
      key: 'operationUser',
      minWidth: 100
    }, {
      title: '操作时间',
      align: 'center',
      key: 'createStatementTime',
      slot: 'createStatementTime',
      minWidth: 100
    },{
      title: '操作',
      align: 'center',
      key: 'action',
      slot: 'action',
      fixed: 'right',
      minWidth: 220
    }
  ]
}
