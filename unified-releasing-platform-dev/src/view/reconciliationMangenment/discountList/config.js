export default {
    tableFields: [
      { 
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        // fixed: 'left'
      },
      {
        title: '账期',
        align: "center",
        key: 'statisticsMonth',
        // fixed: 'left',
        minWidth: 80,
      },
      {
        title: '客户名称',
        align: "center",
        key: 'customName',
        // fixed: 'left',
        minWidth: 110,
      },
      {
        title: '公司名称',
        align: "center",
        key: 'companyName',
        // fixed: 'left',
        minWidth: 110,
      },
      {
        title: '推广产品',
        align: "center",
        key: 'planName',
        minWidth: 110,
      },
      {
        title: '推广链接',
        align: "center",
        key: 'fullUrl',
        slot: 'fullUrl',
        minWidth: 130,
      },
      {
        title: '消费金额',
        align: "center",
        key: 'costTotal',
        slot: 'costTotal',
        minWidth: 100,
      },
      {
        title: '核减金额',
        align: "center",
        key: 'benefitTotal',
        slot: 'benefitTotal',
        minWidth: 100,
      },
      {
        title: '应收金额',
        align: "center",
        key: 'realTotal',
        slot: 'realTotal',
        minWidth: 100,
      },
      {
        title: '账单日期',
        align: "center",
        key: 'billDateRange',
        minWidth: 110,
      },
      {
        title: '操作人',
        align: "center",
        key: 'optUser',
        minWidth: 110,
      },{
        title: '操作时间',
        align: "center",
        key: 'optTime',
        slot: 'optTime',
        minWidth: 100,
      }
    ]
  }
