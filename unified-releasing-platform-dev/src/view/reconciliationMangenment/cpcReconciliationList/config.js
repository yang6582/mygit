export default {
  cpcColumns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index'
    }, {
      title: '账期',
      align: 'center',
      key: 'statisticsMonth',
      minWidth: 100
    }, {
      title: '客户名称',
      align: 'center',
      key: 'customName',
      minWidth: 100
    }, {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      minWidth: 100
    }, {
      title: '账单编号',
      align: 'center',
      slot: 'statementNo',
      minWidth: 140
    }, {
      title: '消费金额',
      align: 'center',
      key: 'costTotal',
      minWidth: 100
    }, {
      title: '核减金额',
      align: 'center',
      key: 'benefitTotal',
      minWidth: 100
    }, {
      title: '应收金额',
      align: 'center',
      key: 'realTotal',
      minWidth: 100
    }, {
      title: '账单日期',
      align: 'center',
      key: 'date',
      minWidth: 100
    }, 
    // {
    //   title: '是否已开票',
    //   align: 'center',
    //   key: 'dfsfdsse'
    // }, 
    {
      title: '对账人',
      align: 'center',
      key: 'statementUser',
      minWidth: 100
    },  {
      title: '备注',
      align: 'center',
      key: 'remark',
      slot: 'remark',
      minWidth: 130
    },
    {
      title: '是否发送邮件',
      align: 'center',
      key: 'sendMailFlag',
      slot: 'sendMailFlag',
      minWidth: 80
    },{
      title: '状态',
      align: 'center',
      slot: 'status',
      width: 100
    }, {
      title: '操作',
      align: 'center',
      slot: 'action',
      width: 120
    }]
}
