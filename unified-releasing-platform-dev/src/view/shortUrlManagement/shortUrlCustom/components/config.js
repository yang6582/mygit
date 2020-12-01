export default {
  menuColumns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index',
      fixed: 'left'
    },
    {
      title: '客户名称',
      align: 'center',
      key: 'customerName',
      minWidth: 120,
      // fixed: 'left'
    },
    {
      title: '计划名称',
      align: 'center',
      key: 'planName',
      minWidth: 120,
      // fixed: 'left'
    },
    {
      title: '广告名称',
      align: 'center',
      key: 'adName',
      minWidth: 120,
      fixed: 'left',
    },
    {
      title: '广告状态',
      align: 'center',
      key: 'approvalStatusName',
      // slot: 'approvalStatusName',
      width: 90
    },
    {
      title: '广告渠道',
      align: 'center',
      slot: 'positionNames',
      width: 90
    },
    
    {
      title: '厂商',
      align: 'center',
      key: 'partnerName',
      minWidth: 90,
      // fixed: 'left'
    },
    {
      title: 'OPPO状态',
      align: 'center',
      key: 'oppoApprovalStatusName',
      minWidth: 120
    },
   
    {
      title: '短链',
      align: 'center',
      slot: 'adShortUrl',
      minWidth: 80
    },
    {
      title: '原链',
      align: 'center',
      slot: 'adUrl',
      minWidth: 80
    },
    {
      title: '操作',
      align: 'center',
      key: 'action',
      slot: 'action',
      width: 100,
      // fixed: 'right'
    }
  ]
}