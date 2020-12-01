export default {
    companyDimension: [
      { 
        title: '序号',
        type: 'index',
        width: 65,
        key: 'index',
        align: 'center',
        fixed: 'left'
      },
      {
        title: '账期',
        align: "center",
        key: 'statisticsMonth',
        fixed: 'left',
        minWidth: 110,
      },
      {
        title: '公司名称',
        align: "center",
        key: 'companyName',
        fixed: 'left',
        minWidth: 110,
      },
      {
        title: '开始日期',
        align: "center",
        key: 'statisticsStart',
        minWidth: 110,
      },
      {
        title: '结束日期',
        align: "center",
        key: 'statisticsEnd',
        minWidth: 110,
      },{
        title: '计费方式',
        align: "center",
        key: 'chargeTypeName',
        minWidth: 110,
      },
      {
        title: '消耗金额',
        align: "center",
        key: 'costTotal',
        slot: 'costTotal',
        minWidth: 110,
        sortable: 'custom'
      },{
        title: '是否有结算单',
        align: "center",
        key: 'hasBalanceBill',
        slot: 'hasBalanceBill',
        minWidth: 80,
      },
      {
        title: '核减金额',
        align: "center",
        key: 'benefitTotal',
        slot: 'benefitTotal',
        minWidth: 110,
        sortable: 'custom'
      },
      {
        title: '核减原因',
        align: "center",
        key: 'remark',
        minWidth: 110,
      },
      {
        title: '应收金额',
        align: "center",
        key: 'realTotal',
        slot: 'realTotal',
        minWidth: 110,
        sortable: 'custom'
      },{
        title: "应收日期",
        align: "center",
        key: "shouldReceiveMoneyDate",
        width: 100
      },
      {
        title: '回款金额',
        align: "center",
        key: 'collectionTotal',
        slot: 'collectionTotal',
        minWidth: 110,
        sortable: 'custom'
      },
      {
        title: '未回款金额',
        align: "center",
        key: 'notCollectionMoney',
        slot: 'notCollectionMoney',
        minWidth: 120,
        sortable: 'custom'
      },
      {
        title: '回款状态',
        align: "center",
        key: 'returnMoneyStatusName',
        minWidth: 110,
      },{
        title: "账龄",
        align: "center",
        key: "billAge",
        width: 80
      },{
        title: "是否逾期",
        align: "center",
        key: 'overdueFlag',
        slot: 'overdueFlag',
        width: 70
      },
      // {
      //   title: '开票金额',
      //   align: "center",
      //   key: 'debtTotal',
      //   slot: 'debtTotal',
      //   minWidth: 110,
        // sortable: 'custom'
      // },
      {
        title: 'AE',
        align: "left",
        key: 'ae',
        minWidth: 100,
      },
      // {
      //   title: '累计逾期金额',
      //   align: "center",
      //   key: 'overdueTotal',
      //   slot: 'overdueTotal',
      //   minWidth: 110,
      // },
      // {
      //   title: '回款比例',
      //   align: "left",
      //   key: 'returnRatio',
      //   slot: 'returnRatio',
      //   minWidth: 130,
      // },
    ],
    productDimension: [{
      title: '序号',
      type: 'index',
      key: 'index',
      width: 65,
      align: 'center',
      // fixed: 'left'
    }, 
    // {
    //     title: '账期',
    //     align: "center",
    //     key: 'statisticsMonth',
    //     fixed: 'left',
    //     minWidth: 110,
    // }, 
    // {
    //   title: '公司名称',
    //   align: "center",
    //   key: 'companyName',
    //   fixed: 'left',
    //   minWidth: 110,
    // },  
    {
        title: '推广产品',
        align: "center",
        key: 'planName',
        minWidth: 110,
    }, 
    // {
    //   title: '开始日期',
    //   align: "center",
    //   key: 'statisticsStart',
    //   minWidth: 110,
    // },
    // {
    //   title: '结束日期',
    //   align: "center",
    //   key: 'statisticsEnd',
    //   minWidth: 110,
    // },
    {
      title: '计费方式',
      align: "center",
      key: 'chargeTypeName',
      minWidth: 110,
    },
    {
      title: '消耗金额',
      align: "center",
      key: 'costTotal',
      slot: 'costTotal',
      minWidth: 110,
    },
    {
      title: '核减金额',
      align: "center",
      key: 'benefitTotal',
      slot: 'benefitTotal',
      minWidth: 110,
    },
    // {
    //   title: '核减原因',
    //   align: "center",
    //   key: 'remark',
    //   minWidth: 110,
    // },
    {
      title: '应收金额',
      align: "center",
      key: 'realTotal',
      slot: 'realTotal',
      minWidth: 110,
    },
    // {
    //   title: '回款金额',
    //   align: "center",
    //   key: 'returnTotal',
    //   slot: 'returnTotal',
    //   minWidth: 110,
    // },
    // {
    //   title: '最后一次回款日期',
    //   align: "center",
    //   key: 'lastReturnDate',
    //   slot: 'lastReturnDate',
    //   minWidth: 110,
    // },
    // {
    //   title: '回款状态',
    //   align: "center",
    //   key: 'returnMoneyStatusName',
    //   minWidth: 110,
    // },
    // {
    //   title: '开票金额',
    //   align: "center",
    //   key: 'debtTotal',
    //   slot: 'debtTotal',
    //   minWidth: 110,
    // },
    // {
    //   title: '累计逾期金额',
    //   align: "center",
    //   key: 'overdueTotal',
    //   slot: 'overdueTotal',
    //   minWidth: 110,
    // },
    // {
    //   title: '回款比例',
    //   align: "left",
    //   key: 'returnRatio',
    //   slot: 'returnRatio',
    //   minWidth: 130,
    ],
    chargeStatus: [{
      value: -1,
      label: '全部'
    }, {
      value: 1,
      label: 'CPC'
    },
    {
      value: 2,
      label: 'CPS/CPA'
    },
    {
      value: 3,
      label: '包年/包月'
    }],
    allStatus: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 4,
          label: '全部回款'
        },
        {
          value: 1,
          label: '未回款'
        },{
          value: 3,
          label: '部分回款'
        }
    ],
  }
