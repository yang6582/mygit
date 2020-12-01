export default {
    cpcColumns: [
      {
        title: '序号',
        type: 'index',
        width: 60,
        fixed: 'left',
        align: 'center',
        key: 'index'
      },{
        title: '月报时间',
        align: 'center',
        minWidth: 90,
        fixed: 'left',
        key: 'reportMonth'
      },
      {
        title: '客户名称',
        align: 'center',
        key: 'customUsername',
        fixed: 'left',
        minWidth: 90
      },
      {
        title: '公司名称',
        align: 'center',
        fixed: 'left',
        key: 'companyName',
        minWidth: 90
      },
      {
        title: '期初余额',
        align: 'center',
        key: 'initTotalLeftFee',
        slot: 'initTotalLeftFee',
        minWidth: 90
      },{
        title: '期初现金余额',
        align: 'center',
        key: 'initCashLeftFee',
        slot: 'initCashLeftFee',
        minWidth: 90
      },
      {
        title: '期初返点余额',
        align: 'center',
        key: 'initBenefitLeftFee',
        slot: 'initBenefitLeftFee',
        minWidth: 90
      },{
        title: '本月充值',
        align: 'center',
        key: 'rechargeTotalFee',
        slot: 'rechargeTotalFee',
        minWidth: 90
      },{
        title: '本月现金充值',
        align: 'center',
        key: 'rechargeCashFee',
        slot: 'rechargeCashFee',
        minWidth: 90
      },{
        title: '本月返点充值',
        align: 'center',
        key: 'rechargeBenefitFee',
        slot: 'rechargeBenefitFee',
        minWidth: 90
      },{
        title: '本月消费',
        align: 'center',
        key: 'consumeTotalFee',
        slot: 'consumeTotalFee',
        minWidth: 90
      },{
        title: '本月现金消费',
        align: 'center',
        key: 'consumeCashFee',
        slot: 'consumeCashFee',
        minWidth: 90
      },{
        title: '本月返点消费',
        align: 'center',
        key: 'consumeBenefitFee',
        slot: 'consumeBenefitFee',
        minWidth: 90
      },{
        title: '期末余额',
        align: 'center',
        key: 'endTotalLeftFee',
        slot: 'endTotalLeftFee',
        minWidth: 90
      },{
        title: '期末现金余额',
        align: 'center',
        key: 'endCashLeftFee',
        slot: 'endCashLeftFee',
        minWidth: 90
      },{
        title: '期末返点余额',
        align: 'center',
        key: 'endBenefitLeftFee',
        slot: 'endBenefitLeftFee',
        minWidth: 90
      },{
        title: '核销金额',
        align: 'center',
        key: 'writeOffMoney',
        slot: 'writeOffMoney',
        minWidth: 90
      }
    ],
    monthColumns: [
      {
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center',
        key: 'index'
      },{
        title: '月度',
        align: 'center',
        // minWidth: 90,
        key: 'reportMonth'
      },{
        title: '客户名称',
        align: 'center',
        key: 'customUsername',
        // minWidth: 90
      }, {
        title: '公司名称',
        align: 'center',
        key: 'companyName',
      }, {
        title: '期初余额',
        align: 'center',
        key: 'initTotalLeftFee',
        slot: 'initTotalLeftFee'
        // minWidth: 90
      }, {
        title: '本月充值',
        align: 'center',
        key: 'rechargeTotalFee',
        slot: 'rechargeTotalFee'
        // minWidth: 90
      }, {
        title: '本月消费',
        align: 'center',
        key: 'consumeTotalFee',
        slot: 'consumeTotalFee'
        // minWidth: 90
      }, {
        title: '期末余额',
        align: 'center',
        key: 'endTotalLeftFee',
        slot: 'endTotalLeftFee'
        // minWidth: 90
      }
    ]
  }
  