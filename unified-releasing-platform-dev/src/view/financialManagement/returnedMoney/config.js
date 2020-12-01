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
        title: '流水编号',
        align: 'center',
        key: 'serialNumber',
        slot: 'serialNumber',
        minWidth: 100,
        fixed: 'left'
      },{
        title: '回款主体',
        align: 'center',
        key: 'collectionSubject',
        minWidth: 100,
        fixed: 'left'
      },
      {
        title: '公司名称',
        align: 'center',
        key: 'companyName',
        fixed: 'left',
        minWidth: 150,
      },{
        title: '入账金额',
        align: 'center',
        key: 'entryAmount',
        slot: 'entryAmount',
        // fixed: 'left',
        minWidth: 90,
      },
      {
        title: '入账日期',
        align: 'center',
        key: 'entryDate',
        slot: 'entryDate',
        // fixed: 'left',
        minWidth: 100,
      }, {
        title: '类型',
        align: 'center',
        key: 'entryType',
        // slot: 'balanceCount',
        minWidth: 100,
      },{
        title: '银行',
        align: 'center',
        key: 'bank',
        minWidth: 80,
      },{
        title: '录入人',
        align: 'center',
        key: 'createUser',
        // slot: 'totalIncome',
        minWidth: 80,
      },{
        title: '录入时间',
        align: 'center',
        key: 'createTime',
        slot: 'createTime',
        minWidth: 100,
      },{
        title: '充值金额',
        align: 'center',
        key: 'rechargeAmount',
        slot: 'rechargeAmount',
        // fixed: 'left',
        minWidth: 90,
      },{
        title: '抵扣金额',
        align: 'center',
        key: 'deductionAmount',
        minWidth: 100,
      },{
        title: '可用抵扣金额',
        align: 'center',
        key: 'availableDeductionAmount',
        slot: 'availableDeductionAmount',
        minWidth: 100,
      },{
        title: '抵扣账单',
        align: 'center',
        key: 'statementNo',
        slot: 'statementNo',
        minWidth: 200,
      },{
        title: '号码认证',
        align: 'center',
        key: 'numberAuthAmount',
        minWidth: 100,
      },{
        title: 'DSP业务',
        align: 'center',
        key: 'dspAmount',
        minWidth: 100,
      },{
        title: 'SP业务',
        align: 'center',
        key: 'spAmount',
        slot: 'spAmount',
        minWidth: 90,
      },{
        title: '网络消息',
        align: 'center',
        key: 'networkAmount',
        slot: 'networkAmount',
        minWidth: 90,
      },{
        title: '快应用',
        align: 'center',
        key: 'fastappAmount',
        slot: 'fastappAmount',
        minWidth: 90,
      }, {
        title: '智能短信',
        align: 'center',
        key: 'smsAmount',
        slot: 'smsAmount',
        minWidth: 90,
      }, {
        title: '对接AE',
        align: 'center',
        key: 'aeName',
        minWidth: 80,
      }, {
        title: '备注',
        align: 'center',
        key: 'remark',
        minWidth: 80,
      }, {
        title: '更新时间',
        align: 'center',
        key: 'updateTime',
        slot: 'updateTime',
        minWidth: 100,
      }, {
        title: '操作',
        align: 'center',
        key: 'action',
        slot: 'action',
        minWidth: 140,
      }, 
    ]
  }
