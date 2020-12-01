export default {
    refundOptTable: [
      {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        key: 'index',
        fixed: 'left'
      },
      {
        title: '日期',
        align: 'center',
        key: 'statisticDate',
        slot: 'statisticDate',
        minWidth: 100,
        fixed: 'left'
      },
      {
        title: '客户名称',
        align: 'center',
        key: 'customerName',
        fixed: 'left',
        minWidth: 90,
      },{
        title: '公司名称',
        align: 'center',
        key: 'companyName',
        fixed: 'left',
        minWidth: 90,
      },
      {
        title: '广告名称',
        align: 'center',
        key: 'adName',
        fixed: 'left',
        minWidth: 90,
      },{
        title: '结算数据',
        align: 'center',
        key: 'balanceCount',
        slot: 'balanceCount',
        minWidth: 70,
      },{
        title: '结算单价',
        align: 'center',
        key: 'payUnitPrice',
        minWidth: 70,
      },{
        title: '总营收',
        align: 'center',
        key: 'totalIncome',
        slot: 'totalIncome',
        minWidth: 70,
      },{
        title: '总点击量',
        align: 'center',
        key: 'clickCount',
        slot: 'clickCount',
        minWidth: 70,
      },{
        title: '平均单价',
        align: 'center',
        key: 'avgUnitPrice',
        minWidth: 70,
      },{
        title: '结算方式',
        align: 'center',
        key: 'chargedType',
        slot: 'chargedType',
        minWidth: 70,
      },{
        title: 'vivo返款金额',
        align: 'center',
        key: 'returnMoneyVivo',
        minWidth: 70,
      },{
        title: 'oppo返款金额',
        align: 'center',
        key: 'returnMoneyOppo',
        minWidth: 70,
      },{
        title: '金立返款金额',
        align: 'center',
        key: 'returnMoneyJinli',
        minWidth: 70,
      },{
        title: '快应用返款金额',
        align: 'center',
        key: 'returnMoneyFastapp',
        minWidth: 70,
      }, {
        title: '操作日期',
        align: 'center',
        key: 'operateTime',
        slot: 'operateTime',
        minWidth: 70,
      }, {
        title: '操作人',
        align: 'center',
        key: 'operator',
        minWidth: 70,
      }, 
    ]
  }
