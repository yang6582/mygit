export default {
  totalColumns: [
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
      minWidth: 80

    }, {
      title: '客户名称',
      align: 'center',
      key: 'customName',
      minWidth: 80
    }, {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      minWidth: 80
    }, {
      title: '推广产品',
      align: 'center',
      key: 'planName',
      minWidth: 100
    }, {
      title: '推广链接',
      align: 'center',
      slot: 'fullUrl',
      minWidth: 140
    }, {
      title: '消费金额',
      align: 'center',
      key: 'costTotal',
      slot: 'costTotal',
      minWidth: 100

    }, {
      title: '核减金额',
      align: 'center',
      key: 'benefitTotal',
      slot: 'benefitTotal',
      minWidth:100
    }, {
      title: '应收金额',
      align: 'center',
      key: 'realTotal',
      slot: 'realTotal',
      minWidth: 100

    }, {
      title: '账单日期',
      align: 'center',
      key: 'date',
      minWidth:180
    }],
    detailsColumns:[
      {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        key: 'index'
      }, {
        title: '日期',
        align: 'center',
        key: 'statisticsDate',
        minWidth: 80
      }, {
        title: '客户名称',
        align: 'center',
        key: 'customName',
        minWidth: 80
      }, {
        title: '公司名称',
        align: 'center',
        key: 'companyName',
        minWidth: 80
      }, {
        title: '计划名称',
        align: 'center',
        key: 'planName',
        minWidth: 80
      }, {
        title: '广告名称',
        align: 'center',
        key: 'adName',
        minWidth: 80
      }, {
        title: '推广链接',
        align: 'center',
        slot: 'fullUrl',
        minWidth: 80
      }, {
        title: '计费点击数',
        align: 'center',
        key: 'costClickCount',
        slot: 'costClickCount',
        minWidth: 80
      }, {
        title: '单价',
        align: 'center',
        key: 'price',
        slot: 'price',
        minWidth: 80
      }, {
        title: '消费金额',
        align: 'center',
        key: 'costTotal',
        slot: 'costTotal',
        minWidth: 80
      },
    ],
  approvalTables: [{
    title: '序号',
    type: 'index',
    width: 65,
    align: 'center',
    key: 'index'
  },{
    title: '过程',
    align: 'center',
    key: 'name',
  }, {
    title: '审批人',
    align: 'center',
    key: 'optUser',
  }, {
    title: '审批时间',
    align: 'center',
    key: 'auditTime',
    slot: 'auditTime'
  }, {
    title: '当前审批意见',
    align: 'center',
    key: 'auditRemark',
    slot: 'auditRemark',
  }],
  approvalTableData: {
    ae: {
      name: 'AE提交',
    },
    saleLeader: {
      name: '销售leader审批',
    },
    omLeader: {
      name: '运营审批',
    },
    cfo: {
      name: '风控审批',
    },
    coo: {
      name: 'COO审批',
    },
    cto: {
      name: 'CTO审批',
    }
  }
}
