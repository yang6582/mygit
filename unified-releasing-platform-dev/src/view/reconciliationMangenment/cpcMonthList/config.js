export default {
    cpcMonthFields: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center',
        key: 'index'
    }, {
        title: '月度',
        align: 'center',
        minWidth: 90,
        key: 'statisticsMonth'
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
        title: '消费金额',
        align: 'center',
        key: 'costTotal',
        slot: 'costTotal',
        minWidth: 90
    }],
  enterpriseMenuColumns: [
    {
      title: '序号',
      type: 'index',
      width: 60,
      // fixed: 'left',
      align: 'center',
      key: 'index'
    }, {
      title: '日期',
      align: 'center',
      minWidth: 90,
      // fixed: 'left',
      key: 'statisticsDate'
    }, {
      title: '客户名称',
      align: 'center',
      minWidth: 90,
      // fixed: 'left',
      key: 'customName'
    },
    {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      // fixed: 'left',
      minWidth: 90
    },
    {
      title: '计划名称',
      align: 'center',
      // fixed: 'left',
      key: 'planName',
      minWidth: 90
    },{
      title: '广告名称',
      align: 'center',
      key: 'adName',
      minWidth: 90
    }, {
      title: '推广链接',
      align: 'center',
      key: 'fullUrl',
      slot: 'fullUrl',
      minWidth: 90
    }, {
      title: '计费点击数',
      align: 'center',
      key: 'costClickCount',
      slot: 'costClickCount',
      minWidth: 90
    }, {
      title: '单价',
      align: 'center',
      key: 'price',
      slot: 'price',
      minWidth: 90
    }, {
      title: '消费金额',
      align: 'center',
      key: 'costTotal',
      slot: 'costTotal',
      minWidth: 90
    }
  ]
}
