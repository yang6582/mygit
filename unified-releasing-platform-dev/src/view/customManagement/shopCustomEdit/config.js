export const limitOptions = [
  {
    value: "$IMEIFID",
    label: '$IMEIFID=="xxx"->判断IMEI文件ID'
  },
  {
    value: "$M",
    label: '$M=="iphone6s"->判断手机型号'
  },
  {
    value: "$CITY",
    label: '$CITY=="北京"->判断城市'
  },
  {
    value: "$PROVINCE",
    label: '$PROVINCE=="陕西"->判断省份'
  },
  {
    value: "$V",
    label: '$V>="13.8.0"->TeddySDK版本号'
  },
  {
    value: "$SDK",
    label: '$SDK>=23->Android系统版本,数值型'
  },
  {
    value: "$H",
    label: '$H==23->设备百分比'
  },
  {
    value: "$HF",
    label: '$HF==1->参数定制，仅支持VIVO，参数取值范围0/1'
  },
  {
    value: "&&",
    label: '&&->并且'
  },
  {
    value: "||",
    label: '||->或'
  }
]
export const defaultForm = {
  name: "", //菜单名称
  sum: "",
  corner_type: "0", //角标类型
  corner_graph: "", //角标图示
  type: "url", //类型
  menuLogo: { logo_front: "", logo_back: "" }, //前后置图标
  striking: { type: "0" },
  index: 1,
  data: '',
  browser_type: "3",
  isCommercial: "0",
  show_add_sub: true,
  show_click_style: true,
  show_sub_item_icon: true,
  extendData: {
    appName: "", //应用名称,
    packageName: "", //包名
    deeplink: "", //直达页面和快应用链接
    html_link: "", //备用链接
    fastAppVer: "", //最低版本号
    htmlLink: "", //备用链接
  },
  backupMenu: { name: '', type: 'url', isCommercial: '0', data: '', browser_type: '1', extendData: { menuAdType: 0 } }
}
export const choiceAdColumn = [
  {
    title: '序号',
    type: 'index',
    width: 65,
    align: 'center',
    // fixed: 'left'
  },
  {
    title: '客户名称',
    key: 'customerName',
    align: 'center'
  },
  {
    title: '计划名称',
    key: 'planName',
    align: 'center'
  },
  {
    title: '广告名称',
    key: 'adName',
    align: 'center'
  },
  {
    title: '厂商',
    key: 'partnerName',
    align: 'center'
  },
  {
    title: '广告状态',
    key: 'approvalStatusName',
    align: 'center'
  },
  {
    title: '广告渠道',
    key: 'adPositionTypeName',
    align: 'center'
  },
  {
    title: 'oppo状态',
    key: 'oppoApprovalStatusName',
    align: 'center'
  },
  {
    title: '短链',
    slot: 'adShortUrl',
    align: 'center',
    width: 250
  },
  {
    title: '原链',
    key: 'adUrl',
    align: 'center',
    width: 250

  },
  {
    title: '操作',
    slot: 'operation',
    align: 'center',
    width: 100
  }
]
export const choicefastAppColumn = [
  {
    title: '序号',
    type: 'index',
    width: 65,
    align: 'center',
    // fixed: 'left'
  },
  {
    title: '快应用名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '包名',
    key: 'packageName',
    align: 'center'
  },
  {
    title: '快应用跳转链接',
    key: 'deeplink',
    align: 'center'
  },
  {
    title: '快应用最低版本号',
    key: 'fastAppVer',
    align: 'center'
  },
  {
    title: '操作',
    slot: 'operation',
    align: 'center'
  }

]
export const copyMenuColumn = [
  {
    title: '多项选择',
    slot: 'checkbox',
    align: 'center',
    width: 100,

  },
  {
    title: '序号',
    type: 'index',
    width: 65,
    align: 'center',
    // fixed: 'left'
  },
  {
    title: '商户名称',
    key: 'shopName',
    align: 'center',
    width: 120
  },
  {
    title: '菜单名称',
    key: 'name',
    align: 'center',
    width: 140

  },
  {
    title: '菜单类型',
    key: 'type',
    align: 'center',
    width: 100

  },
  {
    title: '菜单属性',
    slot: 'isCommercial',
    align: 'center',
    width: 120

  },
  {
    title: '对应菜单类型链接',
    slot: 'data',
    align: 'center'
  }

]