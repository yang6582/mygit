export default {
  roleColumns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index'
    },
    {
      title: '角色名称',
      align: 'center',
      key: 'roleName'
    },
    {
      title: '描述',
      align: 'center',
      key: 'roleDesc'
    },
    {
      title: '状态',
      align: 'center',
      slot: 'status'
    },
    {
      title: '创建人',
      align: 'center',
      key: 'createUserName'
    },
    {
      title: '创建时间',
      align: 'center',
      slot: 'createTime'
    },
    {
      title: '操作',
      align: 'center',
      slot: 'operate',
      width:260
    },
  ],
  accountColumns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index'
    },
    {
      title: '姓名',
      align: 'center',
      key: 'nickName'
    },
    {
      title: '所属角色',
      align: 'center',
      slot: 'userRoles'
    },
    {
      title: '邮箱',
      align: 'center',
      key: 'userEmail'
    },
    {
      title: '创建时间',
      align: 'center',
      slot: 'createTime'
    },
    {
      title: '状态',
      align: 'center',
      slot: 'isEnable'
    },
    {
      title: '操作',
      align: 'center',
      slot: 'operate',
      width:140
    }
  ]
}
