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
        title: '制单时间',
        align: 'center',
        key: 'create_time',
        minWidth: 120,
        fixed: 'left'
      },
      {
        title: '客户名称',
        align: 'center',
        minWidth: 80,
        key: 'custom_username',
        fixed: 'left'
      },{
        title: '公司名称',
        align: 'center',
        minWidth: 100,
        key: 'company_name',
        fixed: 'left'
      },{
        title: '回款编号',
        align: 'center',
        minWidth: 110,
        key: 'serial_number'
      },{
        title: '回款公司',
        align: 'center',
        minWidth: 100,
        key: 'collection_company',
      },{
        title: '到账日期',
        align: 'center',
        minWidth: 80,
        key: 'receipt_date',
        slot: 'receipt_date',
      },
      {
        title: '充值类型',
        align: 'center',
        minWidth: 80,
        key: 'type_name',
      },{
        title: '充值金额',
        align: 'center',
        key: 'fee',
        slot: 'fee',
        minWidth: 80,
      },{
        title: '备注',
        align: 'center',
        minWidth: 80,
        key: 'memo',
        // slot: 'memo'
      },{
        title: '制单人',
        align: 'center',
        key: 'operation_name',
        minWidth: 80,
      },{
        title: '审批状态',
        align: 'center',
        minWidth: 80,
        key: 'status_name',
      },{
        title: '拒绝原因',
        align: 'center',
        minWidth: 100,
        key: 'audit_remark',
      },{
        title: '审批时间',
        align: 'center',
        key: 'check_time',
        minWidth: 80,
      },{
        title: '审批人',
        align: 'center',
        key: 'check_name',
        minWidth: 80,
      }
    ],
    approveTable: [
      {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center',
        key: 'index'
      },
      {
        title: '制单时间',
        align: 'center',
        key: 'create_time',
        minWidth: 100
      },
      {
        title: '客户名称',
        align: 'center',
        key: 'custom_username',
        minWidth: 100,
      },
      {
        title: '公司名称',
        align: 'center',
        key: 'company_name',
        minWidth: 100,
      },{
        title: '回款编号',
        align: 'center',
        minWidth: 100,
        key: 'serial_number'
      },{
        title: '回款公司',
        align: 'center',
        minWidth: 100,
        key: 'collection_company',
      },{
        title: '到账日期',
        align: 'center',
        minWidth: 100,
        key: 'receipt_date',
        slot: 'receipt_date',
      },
      {
        title: '充值类型',
        align: 'center',
        key: 'type_name',
        minWidth: 100,
      },
      {
        title: '充值金额',
        align: "center",
        key: 'fee',
        slot: 'fee',
        minWidth: 100,
      },
      {
        title: '制单人',
        align: "center",
        key: 'operation_name',
        minWidth: 100,
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        align: 'center',
        slot: 'action'
      }
    ],
    tradingInquiry: [
      { 
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center'
      },
      {
        title: '审批时间',
        key: 'check_time',
        minWidth: 100,
        align: "center"
      },
      {
        title: '用户名',
        align: "center",
        key: 'custom_username',
        minWidth: 100,
      },
      {
        title: '公司名称',
        align: "center",
        key: 'company_name',
        minWidth: 100,
      },{
        title: '回款编号',
        align: 'center',
        minWidth: 100,
        key: 'serial_number'
      },{
        title: '回款公司',
        align: 'center',
        minWidth: 100,
        key: 'collection_company',
      },{
        title: '到账日期',
        align: 'center',
        minWidth: 100,
        key: 'receipt_date',
        slot: 'receipt_date',
      },
      {
        title: '充值类型',
        align: "center",
        key: 'type_name',
        minWidth: 100,
      },
      {
        title: '充值金额',
        align: "center",
        key: 'fee',
        minWidth: 100,
      },
      {
        title: '制单人',
        align: "center",
        key: 'operation_name',
        minWidth: 100,
      },
      {
        title: '备注',
        align: 'center',
        key: 'memo',
        minWidth: 100,
      }, {
        title: '审批人',
        align: 'center',
        key: 'check_name',
        minWidth: 100,
      }
    ]
  }
