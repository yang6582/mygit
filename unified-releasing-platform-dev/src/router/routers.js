import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
      noControl: true

      //resourceUrl: '/'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home',
          noControl: true

          //resourceUrl: '/home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/clientManagement',
    name: 'clientManagement',
    redirect: '/clientManagement/clientList',
    meta: {
      icon: 'md-person-add',
      title: '客户管理',
      showAlways: true,
      resourceUrl: '/clientManagement'
    },
    component: Main,
    children: [
      {
        path: 'clientList',
        name: 'clientList',
        meta: {
          title: '客户列表',
          resourceUrl: '/clientManagement/clientList'
        },
        component: () => import('@/view/clientManagement/clientList.vue')
      },
      {
        path: 'marketList',
        name: 'marketList',
        meta: {
          title: '销售列表',
          resourceUrl: '/clientManagement/marketList'
        },
        component: () => import('@/view/clientManagement/marketList')
      },
      {
        path: 'newClient',
        // notCache: true,
        name: 'newClient',
        meta: {
          title: '新建客户',
          resourceUrl: "/clientManagement/newClient",
        },
        component: () => import('@/view/clientManagement/newClient.vue')
      }
    ]
  },
  {
    path: '/AdManagement',
    name: 'AdManagement',
    meta: {
      icon: 'logo-buffer',
      title: '广告创建',
      hideInMenu: true,
      resourceUrl: "/AdManagement",
      //notCache:true
    },
    component: Main,
    children: [
      {
        path: 'promotionPlan',
        name: 'promotionPlan',
        meta: {
          title: '推广计划',
          notCache: true,
          resourceUrl: "/AdManagement/promotionPlan",

        },
        component: () => import('@/view/AdManagement/promotionPlan.vue')
      },
      // {
      //   path: 'menuSet',
      //   name: 'menuSet',
      //   meta: {
      //     title: '菜单配置',
      //     notCache: true
      //   },
      //   component: () => import('@/view/AdManagement/menuSet.vue')
      // }
    ]
  },
  {
    path: '/AdList',
    name: 'AdList',
    meta: {
      icon: 'logo-buffer',
      title: '广告管理',
      showAlways: true,
      resourceUrl: "/AdList",
    },
    redirect: '/AdList/AdPlanList',
    component: Main,
    children: [
      {
        path: 'AdPlanList',
        name: 'AdPlanList',
        meta: {
          resourceUrl: "/AdList/AdPlanList",
          title: '计划列表'
        },
        component: () => import('@/view/adList/adPlanList.vue')
      },
      {
        path: 'AdAduit',
        name: 'AdAduit',
        meta: {
          resourceUrl: "/AdList/AdAduit",
          title: '广告审核'
        },
        component: () => import('@/view/adList/adAduit.vue')
      },
      {
        path: 'AdAllList',
        name: 'AdAllList',
        meta: {
          resourceUrl: "/AdList/AdAllList",
          title: '广告列表'
        },
        component: () => import('@/view/adList/adList.vue')
      },
      // {
      //   path: 'AdTypeList',
      //   name: 'AdTypeList',
      //   meta: {
      //     hideInMenu: true,
      //     title: '菜单列表'
      //   },
      //   component: () => import('@/view/adList/adTypeList.vue')
      // },
      {
        path: 'patchAudit',
        name: 'patchAudit',
        meta: {
          resourceUrl: "/AdList/patchAudit",
          title: 'patch审核'
        },
        component: () => import('@/view/adList/patchAudit.vue')
      }
    ]
  },
  {
    path: '/shortUrlManagement',
    name: 'shortUrlManagement',
    redirect: '/shortUrlManagement/shortUrlCustom',
    meta: {
      icon: 'md-planet',
      title: '短链管理',
      showAlways: true,
      resourceUrl: "/shortUrlManagement",
      //notCache:true
    },
    component: Main,
    children: [
      {
        path: 'shortUrlCustom',
        name: 'shortUrlCustom',
        meta: {
          resourceUrl: "/shortUrlManagement/shortUrlCustom",
          title: '短链定制'
        },
        component: () => import('@/view/shortUrlManagement/shortUrlCustom/index.vue')
      }
    ]
  },
  {
    path: '/queueManagement',
    name: 'queueManagement',
    redirect: '/queueManagement/menuQueue',

    meta: {
      icon: 'md-bookmark',
      title: '队列管理',
      showAlways: true,
      resourceUrl: "/queueManagement",
      //notCache:true
    },
    component: Main,
    children: [
      {
        path: 'menuQueue',
        name: 'menuQueue',
        meta: {
          resourceUrl: "/queueManagement/menuQueue",
          title: '菜单队列'
        },
        component: () => import('@/view/queueManagement/menuQueue/index.vue')
      },
      {
        path: 'nextQueue',
        name: 'nextQueue',
        meta: {
          resourceUrl: "/queueManagement/nextQueue",
          title: '下一步队列'
        },
        component: () => import('@/view/queueManagement/nextQueue/index.vue')
      }, {
        path: 'historyRelation',
        name: 'historyRelation',
        meta: {
          resourceUrl: "/queueManagement/historyRelation",
          title: '历史关系表'
        },
        component: () => import('@/view/queueManagement/historyRelation/index.vue')
      }
    ]
  },
  {
    path: '/customManagement',
    name: 'customManagement',
    redirect: '/customManagement/shopCustom',
    meta: {
      icon: 'md-aperture',
      title: '菜单管理',
      showAlways: true,
      resourceUrl: "/customManagement",

      //notCache:true
    },
    component: Main,
    children: [
      {
        path: 'shopCustom',
        name: 'shopCustom',
        meta: {
          title: '商户定制',
          resourceUrl: "/customManagement/shopCustom",
        },
        component: () => import('@/view/customManagement/shopCustom/index.vue')
      },
      {
        path: 'menuEdit',
        name: 'menuEdit',
        meta: {
          hideInMenu: true,
          title: '编辑短信菜单',
          beforeCloseName: 'before_close_normal',
          resourceUrl: "/customManagement/menuEdit",
        },
        component: () => import('@/view/customManagement/shopCustomEdit/index.vue')
      }
    ]
  },
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    meta: {
      icon: 'md-analytics',
      title: '数据统计',
      showAlways: true,
      resourceUrl: "/dataStatistics",
      // noControl: true
    },
    redirect: '/dataStatistics/AdBilling',
    component: Main,
    children: [
      {
        path: 'AdBilling',
        name: 'AdBilling',
        meta: {
          title: 'CPC广告计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/AdBilling",

        },
        component: () => import('@/view/dataStatistics/adBilling')
      },
      {
        path: 'AdBilling2',
        name: 'AdBilling2',
        meta: {
          title: 'CPC广告计费表(备用)',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/AdBilling2",

        },
        component: () => import('@/view/dataStatistics/adBilling2')
      },
      {
        path: 'monthBilling',
        name: 'monthBilling',
        meta: {
          title: '包月计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/monthBilling",

        },
        component: () => import('@/view/dataStatistics/monthBilling')
      },
      
      {
        path: 'yearBilling',
        name: 'yearBilling',
        meta: {
          title: '包年计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/yearBilling",

        },
        component: () => import('@/view/dataStatistics/yearBilling')
      },
      {
        path: 'CpdBilling',
        name: 'CpdBilling',
        meta: {
          title: 'CPD计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/CpdBilling",

        },
        component: () => import('@/view/dataStatistics/cpdBilling')
      },
      {
        path: 'CpdReport',
        name: 'CpdReport',
        meta: {
          title: 'CPD明细数据报表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/CpdReport",

        },
        component: () => import('@/view/dataStatistics/cpdReport')
      }, {
        path: 'cpscpaBilling',
        name: 'cpscpaBilling',
        meta: {
          title: 'CPS/CPA分润表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/cpscpaBilling",

        },
        component: () => import('@/view/dataStatistics/cpscpaBilling')
      }, {
        path: 'cpscpaChargingList',
        name: 'cpscpaChargingList',
        meta: {
          title: 'CPS/CPA计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/cpscpaChargingList",

        },
        component: () => import('@/view/dataStatistics/cpscpaChargingList')
      }, {
        path: 'monthYearChargingList',
        name: 'monthYearChargingList',
        meta: {
          title: '包月/包年计费表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/dataStatistics/monthYearChargingList",

        },
        component: () => import('@/view/dataStatistics/monthYearChargingList')
      }]
  },
  
  {
    path: '/financialManagement',
    name: 'financialManagement',
    meta: {
      icon: 'md-card',
      title: '财务管理',
      showAlways: true,
      resourceUrl: "/financialManagement",
      // noControl: true
    },
    redirect: '/financialManagement/monthlyReport',
    component: Main,
    children: [
      {
        path: 'receipt',
        name: 'receipt',
        meta: {
          title: '开票',
          // notCache: true,
          // noControl: true,
          resourceUrl: "/financialManagement/receipt",

        },
        component: () => import('@/view/financialManagement/receipt')
      },
      {
        path: 'recharge',
        name: 'recharge',
        meta: {
          title: '充值',
          notCache: true,
          // noControl: true,
          resourceUrl: "/financialManagement/recharge",

        },
        component: () => import('@/view/financialManagement/recharge')
      },{
        path: 'returnedMoney',
        name: 'returnedMoney',
        meta: {
          title: '回款',
          notCache: true,
          resourceUrl: '/financialManagement/returnedMoney'
        },
        component: () => import('@/view/financialManagement/returnedMoney')
      },
      {
        path: 'monthlyReport',
        name: 'monthlyReport',
        meta: {
          title: '月度客户报表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/financialManagement/monthlyReport",

        },
        component: () => import('@/view/financialManagement/monthlyReport')
      }
    ]
  },
  {
    path: '/reconciliationMangenment',
    name: 'reconciliationMangenment',
    meta: {
      icon: 'ios-albums',
      title: '对账管理',
      showAlways: true,
      resourceUrl: "/reconciliationMangenment",
    },
    redirect: '/reconciliationMangenment/cpcReconciliationList',
    component: Main,
    children: [
      {
        path: 'cpcReconciliationList',
        name: 'cpcReconciliationList',
        meta: {
          title: 'CPC对账列表',
          notCache: true,
          resourceUrl: "/reconciliationMangenment/cpcReconciliationList",

        },
        component: () => import('@/view/reconciliationMangenment/cpcReconciliationList')
      },{
        path: 'discountList',
        name: 'discountList',
        meta: {
          title: '核减记录',
          notCache: true,
          resourceUrl: "/reconciliationMangenment/discountList",

        },
        component: () => import('@/view/reconciliationMangenment/discountList')
      },
      {
        path: 'billDetails',
        name: 'billDetails',
        meta: {
          title: '账单详情',
          notCache: true,
          hideInMenu: true,
          resourceUrl: "/reconciliationMangenment/billDetails"
        },
        component: () => import('@/view/reconciliationMangenment/cpcReconciliationList/billDetails')
      },
      {
        path: 'cpcMonthList',
        name: 'cpcMonthList',
        meta: {
          title: 'CPC月度报表',
          notCache: true,
          resourceUrl: "/reconciliationMangenment/cpcMonthList",

        },
        component: () => import('@/view/reconciliationMangenment/cpcMonthList')
      }
    ]
  },
  {
    path: '/payManagement',
    name: 'payManagement',
    meta: {
      icon: 'md-card',
      title: '应收管理',
      showAlways: true,
      resourceUrl: "/payManagement",
    },
    redirect: '/payManagement/summaryTables',
    component: Main,
    children: [
      {
        path: 'summaryTables',
        name: 'summaryTables',
        meta: {
          title: '应收管理总表',
          // notCache: true,
          // noControl: true,
          resourceUrl: "/payManagement/summaryTables",

        },
        component: () => import('@/view/payManagement/summaryTables')
      }, {
        path: 'incomeDetails',
        name: 'incomeDetails',
        meta: {
          title: '应收管理明细表',
          notCache: true,
          resourceUrl: "/payManagement/incomeDetails",
        },
        component: () => import('@/view/payManagement/incomeDetails')
      }, {
        path: 'unCIncomeDetails',
        name: 'unCIncomeDetails',
        meta: {
          title: '非C应收管理明细表',
          notCache: true,
          resourceUrl: "/payManagement/unCIncomeDetails",
        },
        component: () => import('@/view/payManagement/unCIncomeDetails')
      }, {
        path: 'monthYearIncomeDetails',
        name: 'monthYearIncomeDetails',
        meta: {
          title: '包月/包年应收管理明细表',
          notCache: true,
          resourceUrl: "/payManagement/monthYearIncomeDetails",
        },
        component: () => import('@/view/payManagement/monthYearIncomeDetails')
      }, {
        path: 'overdue',
        name: 'overdue',
        meta: {
          title: '逾期管理',
          notCache: true,
          resourceUrl: "/payManagement/overdue",
        },
        component: () => import('@/view/payManagement/overdue')
      }]
  },
  
  {
    path: '/toolBox',
    name: 'toolBox',
    meta: {
      icon: 'md-hammer',
      title: '工具箱',
      showAlways: true,
      resourceUrl: "/toolBox",
      // noControl: true
    },
    redirect: '/toolBox/dataEntering',
    component: Main,
    children: [
      {
        path: 'dataEntering',
        name: 'dataEntering',
        meta: {
          title: 'H5-Demo',
          notCache: true,
          // noControl: true,
          resourceUrl: "/toolBox/dataEntering",

        },
        component: () => import('@/view/toolBox/dataEntering')
      }, {
        path: 'vivoApp',
        name: 'vivoApp',
        meta: {
          title: 'VIVO-APP实时状态',
          notCache: true,
          // noControl: true,
          resourceUrl: "/toolBox/vivoApp",

        },
        component: () => import('@/view/toolBox/vivoApp')
      }, {
        path: 'bidManagement',
        name: 'bidManagement',
        meta: {
          title: '广告竞价',
          notCache: true,
          // noControl: true,
          resourceUrl: "/toolBox/bidManagement",

        },
        component: () => import('@/view/toolBox/bidManagement')
      }, {
        path: 'xiaomiShortUrl',
        name: 'xiaomiShortUrl',
        meta: {
          title: '小米加密短链表',
          notCache: true,
          // noControl: true,
          resourceUrl: "/toolBox/xiaomiShortUrl",

        },
        component: () => import('@/view/toolBox/xiaomiShortUrl')
      }
    ]
  },
  {
    path: '/blacklistMangement',
    name: 'blacklistMangement',
    meta: {
      icon: 'md-unlock',
      title: '黑名单管理',
      showAlways: true,
      resourceUrl: "/blacklistMangement",
      // noControl: true
    },
    redirect: '/blacklistMangement/blacklist',
    component: Main,
    children: [
      {
        path: 'blacklist',
        name: 'blacklist',
        meta: {
          title: '黑名单',
          notCache: true,
          // noControl: true,
          resourceUrl: "/blacklistMangement/blacklist",
        },
        component: () => import('@/view/blacklistMangement/blacklist')
      }]
  },
  {
    path: '/logManagement',
    name: 'logManagement',
    meta: {
      icon: 'ios-time',
      title: '日志管理',
      showAlways: true,
      resourceUrl: "/logManagement",
    },
    redirect: '/logManagement/entry',
    component: Main,
    children: [
      {
        path: 'Entry',
        name: 'Entry',
        meta: {
          title: '登录日志',
          resourceUrl: "/logManagement/Entry",
        },
        component: () => import('@/view/logManagement/entry.vue')
      },
      {
        path: 'Operation',
        name: 'Operation',
        meta: {
          title: '操作日志',
          resourceUrl: "/logManagement/Operation",
        },
        component: () => import('@/view/logManagement/operation.vue')
      },
      {
        path: 'AdOperation',
        name: 'AdOperation',
        meta: {
          title: '广告操作日志',
          resourceUrl: "/logManagement/AdOperation",
        },
        component: () => import('@/view/logManagement/adOperation.vue')
      }
    ]
  },
  {
    path: '/permissionMangement',
    name: 'permissionMangement',
    meta: {
      icon: 'md-lock',
      title: '权限管理',
      showAlways: true,
      resourceUrl: "/permissionMangement",
    },
    redirect: '/permissionMangement/rolePermission',
    component: Main,
    children: [
      {
        path: 'rolePermission',
        name: 'rolePermission',
        meta: {
          title: '角色管理',
          notCache: true,
          resourceUrl: "/permissionMangement/rolePermission",

        },
        component: () => import('@/view/permissionMangement/rolePermission')
      },
      {
        path: 'accountPermission',
        name: 'accountPermission',
        meta: {
          title: '账号管理',
          notCache: true,
          resourceUrl: "/permissionMangement/accountPermission",

        },
        component: () => import('@/view/permissionMangement/accountPermission')
      },
      {
        path: 'historyRecord',
        name: 'historyRecord',
        meta: {
          title: '操作记录',
          notCache: true,
          resourceUrl: "/permissionMangement/historyRecord",

        },
        component: () => import('@/view/permissionMangement/historyRecord')
      },
      {
        path: 'resourceSet',
        name: 'resourceSet',
        meta: {
          title: '资源配置',
          notCache: true,
          resourceUrl: "/permissionMangement/resourceSet",

        },
        component: () => import('@/view/permissionMangement/resourceSet')
      }
    ]
  },
  {
    path: '/permissionMangementFront',
    name: 'permissionMangementFront',
    meta: {
      icon: 'md-unlock',
      title: '前台管理',
      showAlways: true,
      resourceUrl: "/permissionMangementFront",
      // noControl: true
    },
    redirect: '/permissionMangementFront/rolePermission',
    component: Main,
    children: [
      {
        path: 'rolePermissionFront',
        name: 'rolePermissionFront',
        meta: {
          title: '角色管理',
          notCache: true,
          // noControl: true,
          resourceUrl: "/permissionMangementFront/rolePermissionFront",

        },
        component: () => import('@/view/permissionMangementFront/rolePermissionFront')
      },
      {
        path: 'accountPermissionFront',
        name: 'accountPermissionFront',
        meta: {
          title: '账号管理',
          notCache: true,
          // noControl: true,
          resourceUrl: "/permissionMangementFront/accountPermissionFront",
        },
        component: () => import('@/view/permissionMangementFront/accountPermissionFront')
      },
      {
        path: 'historyRecordFront',
        name: 'historyRecordFront',
        meta: {
          title: '操作记录',
          notCache: true,
          // noControl: true,
          resourceUrl: "/permissionMangementFront/historyRecordFront",

        },
        component: () => import('@/view/permissionMangementFront/historyRecordFront')
      },
      {
        path: 'loginLogsFront',
        name: 'loginLogsFront',
        meta: {
          title: '登录日志',
          notCache: true,
          // noControl: true,
          resourceUrl: "/permissionMangementFront/loginLogsFront",

        },
        component: () => import('@/view/permissionMangementFront/loginLogsFront')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true,
      noControl: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true,
      noControl: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true,
      noControl: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
