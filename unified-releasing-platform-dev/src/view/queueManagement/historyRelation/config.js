export default {
  columns: [
    {
      title: '序号',
      type: 'index',
      width: 65,
      align: 'center',
      key: 'index',
    },
    {
      title: '厂商',
      align: 'center',
      key: 'company_id',
      slot: 'company_id',
      minWidth: 90,
    },
    {
      title: '商户名称',
      align: 'center',
      key: 'shop_name',
      width: 90,
      // fixed: 'left'
    },
    {
      title: '菜单名称',
      align: 'center',
      key: 'menu_name',
      minWidth: 90,
      // fixed: 'left'
    },
    {
      title: '包名',
      align: 'center',
      key: 'package_name',
      minWidth: 90,
      // fixed: 'left'
    },
    {
      title: '应用名称',
      align: 'center',
      key: 'app_name',
      minWidth: 90
      // fixed: 'left'
    },
    {
      title: '直达链接',
      align: 'center',
      key: 'deep_link',
      slot: 'deep_link',
      width: 90
    },
    {
      title: '备用链接',
      align: 'center',
      key: 'html_link',
      slot: 'html_link',
      width: 90
    },
    {
      title: '监控链接显示',
      align: 'center',
      key: 'monitor_link_show',
      slot: 'monitor_link_show',
      width: 120
    },
    {
      title: '监控链接点击',
      align: 'center',
      key: 'monitor_link_click',
      slot: 'monitor_link_click',
      width: 120
    },
    {
      title: '创建时间',
      align: 'center',
      key: 'create_time',
      // slot: 'createTime',
      width: 100
    },
    {
      title: '修改时间',
      align: 'center',
      key: 'update_time',
      // slot: 'updateTime',
      width: 100
    }
    ,
    {
      title: '操作',
      align: 'center',
      key: 'action',
      slot: 'action',
      width: 100
    }
  ]
}
