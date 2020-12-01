export default {
  partnerNames: [
    {
      label: "金立",
      value: "gionee"
    }, {
      label: "OPPO",
      value: "oppo"
    }, {
      label: "VIVO",
      value: "vivo"
    }, {
      label: "小米",
      value: "xiaomi"
    }, {
      label: '乐视',
      value: 'letv'
    }, {
      label: 'ZUK',
      value: 'zuk'
    }, {
      label: "ADX",
      value: "adx"
    }, {
      label: "DSP",
      value: "DSP"
    }, {
      label: "yunOS",
      value: "yunos"
    }, {
      label: "1Plus",
      value: "oneplus"
    }, {
      label: "其它",
      value: "其它"
    }
  ],
  enterpriseMenuColumns: [
    {
      title: '序号',
      type: 'index',
      width: 60,
      fixed: 'left',
      align: 'center',
      key: 'index'
    }, {
      title: '日期',
      align: 'center',
      minWidth: 90,
      fixed: 'left',
      key: 'date'
    }, {
      title: '客户名称',
      align: 'center',
      minWidth: 90,
      fixed: 'left',
      key: 'customUsername'
    },
    {
      title: '公司名称',
      align: 'center',
      key: 'companyName',
      fixed: 'left',
      minWidth: 90
    },
    {
      title: '厂商',
      align: 'center',
      fixed: 'left',
      key: 'partnerName',
      minWidth: 90
    },
    {
      title: '广告渠道',
      align: 'center',
      key: 'adType',
      minWidth: 90
    },  {
      title: '广告行业',
      align: 'center',
      key: 'adIndustry',
      minWidth: 90
    },{
      title: '广告版图',
      align: 'center',
      key: 'adTerritory',
      minWidth: 90
    },{
      title: '广告名称',
      align: 'center',
      key: 'adName',
      minWidth: 90
    },
    {
      title: '菜单名称',
      align: 'center',
      key: 'menuName',
      minWidth: 90
    }, {
      title: '推广链接',
      align: 'center',
      key: 'menuUrlDes',

      slot: 'menuUrlDes',
      minWidth: 90
    }, {
      title: '点击PV',
      align: 'center',
      key: 'pv',
      minWidth: 90
    }, {
      title: '点击UV',
      align: 'center',
      key: 'uv',
      minWidth: 90
    }, {
      title: '计费点击数',
      align: 'center',
      key: 'costClickCount',
      minWidth: 90
    }, {
      title: '单价',
      align: 'center',
      key: 'price',
      minWidth: 90
    }, {
      title: '消费金额',
      align: 'center',
      key: 'newuvtotalfee',
      minWidth: 90
    }, {
      title: '返点比例',
      align: 'center',
      key: 'benefitRatio',
      minWidth: 90
    }, {
      title: '返点金额',
      align: 'center',
      key: 'uvbenefit',
      minWidth: 90
    }, {
      title: '结算方式',
      align: 'center',
      key: 'balanceTypeName',
      minWidth: 90
    }, {
      title: '销售人员',
      align: 'center',
      key: 'adSalesName',
      minWidth: 90
    }
  ]
}
