export default {
    tradingInquiry: [
      {
        type: 'selection',
        width: 60,
        align: 'center',
        fixed: 'left'
      },
      { 
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        // fixed: 'left'
      },
      {
        title: '账期月度',
        align: "center",
        key: 'statisticsMonth',
        // fixed: 'left',
        minWidth: 90,
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
      },{
        title: '计费方式',
        align: 'center',
        key: 'chargeTypeName',
        minWidth: 110
      },
      {
        title: '逾期金额',
        align: "center",
        key: 'overdueMoney',
        slot: 'overdueMoney',
        minWidth: 110,
      },
      {
        title: '逾期时长',
        align: "center",
        key: 'overdueDay',
        slot: 'overdueDay',
        minWidth: 110,
      },
      {
        title: '销售员',
        align: "center",
        key: 'salesman',
        minWidth: 110,
      }
    ],
    allStatus: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '全部回款'
        },
        {
          value: 2,
          label: '部分回款'
        },
        {
          value: 128,
          label: '未回款'
        },{
          value: 4,
          label: '逾期'
        }
    ],
  }
