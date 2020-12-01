export const columns = [
    {
      title:'序号',
      type: 'index',
      width: 65,
      align: 'center',
      key:'index'
    },
    {
        title: '商户名称',
        key: 'merchant_name',
        align: 'center'
    },
    {
        title: '菜单名称',
        key: 'ad_name',
        align: 'center'

    },
    {
        title: '菜单位置',
        slot: 'menuLocation',
        align: 'center'

    },
    {
        title: '菜单类型',
        slot: 'menuType',
        align: 'center'

    },
    {
        title: '菜单详情',
        slot: 'menuDetails',
        align: 'center'

    },
    {
        title: '权重',
        key: 'weight',
        align: 'center'

    },
    {
        title: '规则',
        key: 'guide_value',
        align: 'center'

    },
    {
        title: '创建时间',
        key: 'create_time',
        align: 'center'
    },
    {
        title: '操作',
        slot: 'operator',
        align: 'center',
        width:'140'
    }
]
