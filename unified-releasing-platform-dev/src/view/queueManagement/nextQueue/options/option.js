export const columns = [
    {
      title:'序号',
      type: 'index',
      width: 65,
      align: 'center',
      key:'index'
    },
    {
        title: '规则ID',
        key: 'serviceId',
        align: 'center'
    },
    {
        title: 'button文字',
        key: 'buttonText',
        align: 'center'

    },
    {
        title: '位置',
        slot: 'buttonPosition',
        align: 'center'

    },
    {
        title: '按钮类型',
        slot: 'actionType',
        align: 'center'

    },
    {
        title: '顺序',
        key: 'queueIndex',
        align: 'center'

    },
    {
        title: '操作',
        slot: 'operator',
        align: 'center',
        width:'140'
    }
]
