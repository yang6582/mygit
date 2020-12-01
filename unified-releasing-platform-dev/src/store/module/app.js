import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
const PROCESS_ENV = process.env.NODE_ENV === 'production'
const { homeName } = config
const resourceData = [
  {
    "resourceName": "首页",
    'name': '_home',
    'resourceName': '_home',
    "resourceUrl": "/",
    "sonResources": [
      {
        "resourceName": "首页",
        'name': 'home',
        "resourceUrl": "/home",
      }
    ]
  },
  {
    "resourceName": "客户管理",
    'name': 'clientManagement',
    "resourceUrl": "/clientManagement",
    "sonResources": [
      {
        "resourceName": "客户列表",
        'name': 'clientList',
        "resourceUrl": "/clientManagement/clientList",
        "sonResources": [
          {
            "resourceName": "客户管理_客户列表_新建客户",
            "resourceUrl": "客户管理_客户列表_新建客户",
          },
          {
            "resourceName": "客户管理_客户列表_导出",
            "resourceUrl": "/admin//custom/json_export_custom",//直接调佳阳
          },
          {
            "resourceName": "客户管理_客户列表_编辑",
            "resourceUrl": "/ad/customer/edit",
          },
          {
            "resourceName": "客户管理_客户列表_跳转前台",
            "resourceUrl": "客户管理_客户列表_跳转前台",
          },
          {
            "resourceName": "客户管理_客户列表_创建计划",
            "resourceUrl": "/ad/management/plan/list",
          }
        ]
      },
      {
        "resourceName": "销售列表",
        'name': 'clientList',
        "resourceUrl": "/clientManagement/marketList",
        "sonResources": [
          {
            "resourceName": "客户管理_销售列表_导出",
            "resourceUrl": "客户管理_销售列表_导出",
          },
          {
            "resourceName": "客户管理_销售列表_新建销售",
            "resourceUrl": "/ad/management/ads/addSalesmanInfo",
          },
          {
            "resourceName": "客户管理_销售列表_删除销售",
            "resourceUrl": "/ad/management/ads/delSaleInfo",
          },
        ]
      },
      {
        "resourceName": "新建客户",
        'name': 'newClient',
        "resourceUrl": "/clientManagement/newClient",
        "sonResources": [
          {
            "resourceName": "客户管理_新建客户_提交",
            "resourceUrl": "/ad/customer/add",
          }]
      }
    ]
  }
  , {
    "resourceName": "广告创建",
    'name': 'AdManagement',
    "resourceUrl": "/AdManagement",
    "sonResources": [
      {
        "resourceName": "推广计划",
        'name': 'promotionPlan',
        "resourceUrl": "/AdManagement/promotionPlan",
        "sonResources": [
          {
            "resourceName": "推广计划_创建计划_保存计划",
            "resourceUrl": "/ad/management/plan/add",
          }, {
            "resourceName": "推广计划_创建计划_下一步",
            "resourceUrl": "/ad/management/plan/add",
          }, {
            "resourceName": "推广计划_新建广告_按次_提交审核",
            "resourceUrl": "/ad/management/ads/add",
          }, {
            "resourceName": "推广计划_新建广告_按条_提交审核",
            "resourceUrl": "/ad/line/management/add",
          }, {
            "resourceName": "推广计划_新建广告_按次_复制广告",
            "resourceUrl": "/ad/management/ads/getAdGroupAndAdByAdId",
          }]
      }
    ]
  }
  , {
    "resourceName": "广告管理",
    'name': 'AdList',
    "resourceUrl": "/AdList",
    "sonResources": [
      {
        "resourceName": "计划列表",
        'name': 'AdPlanList',
        "resourceUrl": "/AdList/AdPlanList",
        "sonResources": [
          {
            "resourceName": "广告管理_广告列表_批量创建广告",
            "resourceUrl": "/ad/management/ads/import",
          },
          {
            "resourceName": "广告管理_计划列表_编辑",
            "resourceUrl": "/ad/management/plan/edit",
          }, {
            "resourceName": "广告管理_计划列表_新建广告",
            "resourceUrl": "广告管理_计划列表_新建广告",
          }, {
            "resourceName": "广告管理_计划列表_查看",
            "resourceUrl": "/ad/management/ads/findAdsPrepareWithPlan",
          }]
      },
      {
        "resourceName": "广告审核",
        'name': 'AdAduit',
        "resourceUrl": "/AdList/AdAduit",
        "sonResources": [
          {
            "resourceName": "广告管理_广告审核_通过",
            "resourceUrl": "/ad/management/ads/approval",
          }, {
            "resourceName": "广告管理_广告审核_拒绝",
            "resourceUrl": "/ad/management/ads/approval",
          }, {
            "resourceName": "广告管理_广告审核_批量通过",
            "resourceUrl": "/ad/management/ads/approvalAgreeBatch",
          }]
      },
      {
        "resourceName": "广告列表",
        'name': 'AdAllList',
        "resourceUrl": "/AdList/AdAllList",
        "sonResources": [
          {
            "resourceName": "广告管理_广告列表_按次_编辑",
            "resourceUrl": "/ad/management/ads/adsGroupDetailByGroupId",
          }, {
            "resourceName": "广告管理_广告列表_按次_上线",
            "resourceUrl": "/ad/management/ads/online",
          }, {
            "resourceName": "广告管理_广告列表_按次_下线",
            "resourceUrl": "/ad/management/ads/offline",
          }, {
            "resourceName": "广告管理_广告列表_按次_删除",
            "resourceUrl": "/ad/management/ads/delete",
          }, {
            "resourceName": "广告管理_广告列表_按次_送审oppo",
            "resourceUrl": "/ad/management/ads/oppo/approval",
          }, {
            "resourceName": "广告管理_广告列表_按条_编辑",
            "resourceUrl": "/ad/line/management/edit",
          }, {
            "resourceName": "广告管理_广告列表_按条_上线",
            "resourceUrl": "/ad/line/management/online",
          }, {
            "resourceName": "广告管理_广告列表_按条_下线",
            "resourceUrl": "/ad/line/management/offline",
          }, {
            "resourceName": "广告管理_广告列表_按条_删除",
            "resourceUrl": "/ad/line/management/del",
          }, {
            "resourceName": "广告管理_广告列表_按条_恢复",
            "resourceUrl": "/ad/line/management/recovery",
          },
          {
            "resourceName": "广告管理_广告列表_按次投放页面",
            "resourceUrl": "/ad/management/ads/findAdsPrepareWithPlan",
          },
          {
            "resourceName": "广告管理_广告列表_按条投放页面",
            "resourceUrl": "/ad/line/management/list",
          },
          {
            "resourceName": "广告管理_广告列表_在线记录表页面",
            "resourceUrl": "/ad/management/ads/online/history",
          }, {
            "resourceName": "广告管理_广告列表_按次_批量送审oppo",
            "resourceUrl": "/ad/management/ads/oppo/approvalBatch",
          }
        ]
      },
      {
        "resourceName": "patch审核",
        'name': 'patchAudit',
        "resourceUrl": "/AdList/patchAudit",
        "sonResources": [
          {
            "resourceName": "广告管理_patch审核_新建Patch",
            "resourceUrl": "/ad/patch/approval/add",
          }, {
            "resourceName": "广告管理_patch审核_送审",
            "resourceUrl": "/ad/patch/approval/send",
          }, {
            "resourceName": "广告管理_patch审核_下载Patch",
            "resourceUrl": "广告管理_patch审核_下载Patch",
          }]
      }
    ]
  },
  {
    "resourceName": "短链管理",
    'name': 'shortUrlManagement',
    "resourceUrl": "/shortUrlManagement",
    "sonResources": [
      {
        "resourceName": "短链定制",
        'name': 'shortUrlCustom',
        "resourceUrl": "/shortUrlManagement/shortUrlCustom",
        "sonResources": [
          {
            "resourceName": "短链管理_短链定制_添加"
          },
          {
            "resourceName": "短链管理_短链定制_批量添加"
          },
          {
            "resourceName": "短链管理_短链定制_编辑"
          },
          {
            "resourceName": "短链管理_短链定制_关联广告"
          }, {
            "resourceName": "短链管理_短链定制_导出"
          }, {
            "resourceName": "短链管理_短链定制_取消关联"
          }
        ]
      }]
  },
  {
    "resourceName": "队列管理",
    'name': 'queueManagement',
    "resourceUrl": "/queueManagement",
    "sonResources": [
      {
        "resourceName": "菜单队列",
        'name': 'menuQueue',
        "resourceUrl": "/queueManagement/menuQueue",
        "sonResources": [
          {
            "resourceName": "队列管理_菜单队列_新增",
            "resourceUrl": "/ad/menusqueue/add",
          }, {
            "resourceName": "队列管理_菜单队列_批量导入",
            "resourceUrl": "/ad/menusqueue/upload",
          }, {
            "resourceName": "队列管理_菜单队列_修改",
            "resourceUrl": "/ad/menusqueue/edit",
          }, {
            "resourceName": "队列管理_菜单队列_删除",
            "resourceUrl": "/ad/menusqueue/delete",
          }]
      },
      {
        "resourceName": "下一步队列",
        'name': 'nextQueue',
        "resourceUrl": "/queueManagement/nextQueue",
        "sonResources": [
          {
            "resourceName": "队列管理_下一步队列_新增",
            "resourceUrl": "/ad/nextstep/queue/add",
          }, {
            "resourceName": "队列管理_下一步队列_批量导入",
            "resourceUrl": "/ad/nextstep/queue/import",
          }, {
            "resourceName": "队列管理_下一步队列_修改",
            "resourceUrl": "/ad/nextstep/queue/update",
          }, {
            "resourceName": "队列管理_下一步队列_删除",
            "resourceUrl": "/ad/nextstep/queue/delete",
          }]
      },
      {
        "resourceName": "历史关系表",
        'name': 'menuQueue',
        "resourceUrl": "/queueManagement/historyRelation",
        "sonResources": [
          {
            "resourceName": "队列管理_历史关系表_删除",
            "resourceUrl": "/cpd/menus/relation/delete",
          }]
      }
    ]
  }, {
    "resourceName": "菜单管理",
    'name': 'customManagement',
    "resourceUrl": "/customManagement",
    "sonResources": [
      {
        "resourceName": "商户定制",
        'name': 'shopCustom',
        "resourceUrl": "/customManagement/shopCustom",
        "sonResources": [
          {
            "resourceName": "菜单管理_商户定制_指定上线",
            "resourceUrl": "/ad/customizedshops/online/batch/file/async",
          }, {
            "resourceName": "菜单管理_商户定制_批量上线",
            "resourceUrl": "/ad/customizedshops/online/batch/ids",
          }, {
            "resourceName": "菜单管理_商户定制_批量下线",
            "resourceUrl": "/ad/customizedshops/offline/batch",
          }, {
            "resourceName": "菜单管理_商户定制_批量导出",
            "resourceUrl": "/admin/tnt/json_export_custom",//直接调佳阳
          }, {
            "resourceName": "菜单管理_商户定制_批量导入",
            "resourceUrl": "/ad/customizedshops/import",
          }, {
            "resourceName": "菜单管理_商户定制_添加/移除送审vivo商户",
            "resourceUrl": ["/ad/customizedshops/addSmsMenuToVivoApproval", "/ad/customizedshops/removeSmsMenuToVivoApproval"]//一个按钮上有俩家口
          }, {
            "resourceName": "菜单管理_商户定制_批量送审vivo",
            "resourceUrl": "/third/vivo/menu/approvalBatch",
          }, {
            "resourceName": "菜单管理_商户定制_编辑",
            "resourceUrl": "菜单管理_商户定制_编辑",
          }, {
            "resourceName": "菜单管理_商户定制_上线",
            "resourceUrl": "/ad/customizedshops/online/single",
          }, {
            "resourceName": "菜单管理_商户定制_下线",
            "resourceUrl": "/ad/customizedshops/offline/single",
          }, {
            "resourceName": "菜单管理_商户定制_送审vivo",
            "resourceUrl": "/third/vivo/menu/approval",
          }, {
            "resourceName": "菜单管理_商户定制_定时上线",
            "resourceUrl": "/ad/customizedshops/cancelAutoOnline",
          }, {
            "resourceName": "菜单管理_商户定制_人工干预",
            "resourceUrl": "/ad/customizedshops/manualset",
          }, {
            "resourceName": "菜单管理_商户定制_取消干预",
            "resourceUrl": "/ad/customizedshops/manualset",
          }]
      },
      {
        "resourceName": "编辑短信菜单",
        'name': 'menuEdit',
        "resourceUrl": "/customManagement/menuEdit",
        "sonResources": [
          {
            "resourceName": "菜单管理_编辑短信菜单_保存",
            "resourceUrl": "/ad/customizedshops/save",
          }, {
            "resourceName": "菜单管理_编辑短信菜单_保存并上线",
            "resourceUrl": "/ad/customizedshops/saveonline",
          }]
      }
    ]
  }, {
    "resourceName": "日志管理",
    'name': 'logManagement',
    "resourceUrl": "/logManagement",
    "sonResources": [
      {
        "resourceName": "登录日志",
        'name': 'Entry',
        "resourceUrl": "/logManagement/Entry",
      },
      {
        "resourceName": "操作日志",
        'name': 'Operation',
        "resourceUrl": "/logManagement/Operation",
      },
      {
        "resourceName": "广告操作日志",
        'name': 'AdOperation',
        'resourceUrl': "/logManagement/AdOperation",
        "sonResources": [{
          "resourceName": "日志管理_广告操作日志_导出",
          "resourceUrl": "/sys/utils/operation/adLogs/export",
        }]
      }
    ]
  }, {
    "resourceName": "对账管理",
    'name': 'reconciliationMangenment',
    "resourceUrl": "/reconciliationMangenment",
    "sonResources": [
      {
        "resourceName": "CPC对账列表",
        'name': 'cpcReconciliationList',
        "resourceUrl": "/reconciliationMangenment/cpcReconciliationList",
        "sonResources": [{
          "resourceName": "对账管理_CPC对账列表_导出",
          "resourceUrl": "/finance/exportCpcStatement",
        }]
      }, {
        "resourceName": "核减记录",
        'name': 'discountList',
        "resourceUrl": "/reconciliationMangenment/discountList",
        "sonResources": [{
          "resourceName": "对账管理_核减记录_导出",
          "resourceUrl": "",
        }]
      },{
        "resourceName": "CPC月度报表",
        'name': 'cpcMonthList',
        "resourceUrl": "/reconciliationMangenment/cpcMonthList",
        "sonResources": [{
          "resourceName": "对账管理_CPC月度报表_导出",
          "resourceUrl": "/finance/exportCpcMonthlyStatistic",
        }]
      },
      {
        "resourceName": "账单详情",
        'name': 'billDetails',
        "resourceUrl": "/reconciliationMangenment/billDetails",
        "sonResources": [{
          "resourceName": "对账管理_账单详情_修改",
          "resourceUrl": "/finance/editCpcStatement",
        }, {
          "resourceName": "对账管理_账单详情_导出",
          "resourceUrl": "/finance/exportCpcStatementByNo",
        }, {
          "resourceName": "对账管理_账单详情_确认",
          "resourceUrl": "/finance/approvalCpcStatement",
        }, {
          "resourceName": "对账管理_账单详情_拒绝",
          "resourceUrl": "/finance/rejectCpcStatement",
        }, 
        {
          "resourceName": "对账管理_账单详情_核减审批",
          "resourceUrl": "/finance/rejectCpcStatement,/finance/approvalCpcStatement",
        }, {
          "resourceName": "对账管理_账单详情_发送",
          "resourceUrl": "/finance/sendCpcStatementMail",
        }, {
          "resourceName": "对账管理_账单详情_完成对账",
          "resourceUrl": "/finance/completeCpcStatement",
        }, {
          "resourceName": "对账管理_账单详情_导出汇总",
          "resourceUrl": "/finance/exportCpcStatementTotal",
        }, {
          "resourceName": "对账管理_账单详情_导出明细",
          "resourceUrl": "/finance/exportCpcStatementStatistics",
        }, {
          "resourceName": "对账管理_账单详情_凭证",
          "resourceUrl": "/",
        }]
      }
    ]
  },{
    "resourceName": "权限管理",
    'name': 'permissionMangement',
    "resourceUrl": "/permissionMangement",
    "sonResources": [
      {
        "resourceName": "角色管理",
        'name': 'rolePermission',
        "resourceUrl": "/permissionMangement/rolePermission",
      },
      {
        "resourceName": "账号管理",
        'name': 'Operation',
        "resourceUrl": "/permissionMangement/accountPermission",
      },
      {
        "resourceName": "操作记录",
        'name': 'historyRecord',
        "resourceUrl": "/permissionMangement/historyRecord",
      },
      {
        "resourceName": "资源配置",
        'name': 'resourceSet',
        "resourceUrl": "/permissionMangement/resourceSet",
      }
    ]
  }, {
    "resourceName": "权限管理(前台)",
    'name': 'permissionMangementFront',
    "resourceUrl": "/permissionMangementFront",
    "sonResources": [
      {
        "resourceName": "角色管理",
        'name': 'rolePermissionFront',
        "resourceUrl": "/permissionMangementFront/rolePermissionFront",
      },
      {
        "resourceName": "账号管理",
        'name': 'OperationFront',
        "resourceUrl": "/permissionMangementFront/accountPermissionFront",
      },
      {
        "resourceName": "操作记录",
        'name': 'historyRecordFront',
        "resourceUrl": "/permissionMangementFront/historyRecordFront",
      },
      {
        "resourceName": "登录日志",
        'name': 'loginLogsFront',
        "resourceUrl": "/permissionMangementFront/loginLogsFront",
      },
    ]
  }, {
    "resourceName": "财务管理",
    'name': 'financialManagement',
    "resourceUrl": "/financialManagement",
    "sonResources": [
      {
        "resourceName": "月度客户报表",
        'name': 'monthlyReport',
        "resourceUrl": "/financialManagement/monthlyReport",
        "sonResources": [{
          "resourceName": "财务管理_月度客户报表_CPC月度客户报表页面",
          "resourceUrl": "/finance/customerMonthly",
        }, {
          "resourceName": "财务管理_月度客户报表_包月月度客户报表页面",
          "resourceUrl": "/finance/customerMonthlyCptMonth",
        }, {
          "resourceName": "财务管理_月度客户报表_CPC月度客户报表导出",
          "resourceUrl": "/finance/customerMonthly/export",
        }, {
          "resourceName": "财务管理_月度客户报表_包月月度客户报表导出",
          "resourceUrl": "/finance/customerMonthlyCptMonth/export",
        }]
      }, {
        "resourceName": "开票",
        'name': 'receipt',
        "resourceUrl": "/financialManagement/receipt",
        "sonResources": [
          {
            "resourceName": "财务管理_开票_开票申请",
            "resourceUrl": "/finance/invoice/add",
          },{
            "resourceName": "财务管理_开票_审核开票",
            "resourceUrl": "",
          }, {
            "resourceName": "财务管理_开票_同意",
            "resourceUrl": "/finance/invoice/set/passsed",
          }, {
            "resourceName": "财务管理_开票_拒绝",
            "resourceUrl": "/finance/invoice/set/rejected",
          }, {
            "resourceName": "财务管理_开票_编辑",
            "resourceUrl": "/finance/invoice/update",
          }, {
            "resourceName": "财务管理_开票_查看详情",
            "resourceUrl": "",
          }, {
            "resourceName": "财务管理_开票_作废",
            "resourceUrl": "",
          }]
      }, {
        "resourceName": "充值",
        'name': 'recharge',
        "resourceUrl": "/financialManagement/recharge",
        "sonResources": [
          {
            "resourceName": "财务管理_充值_充值",
            "resourceUrl": "/finance/recharge",
          }, {
            "resourceName": "财务管理_充值_退款",
            "resourceUrl": "/finance/cashBack",
          }, {
            "resourceName": "财务管理_充值_制单页面",
            "resourceUrl": "/finance/originatorList",
          }, {
            "resourceName": "财务管理_充值_审批页面",
            "resourceUrl": "/finance/checkRechargeList",
          }, {
            "resourceName": "财务管理_充值_流水查询页面",
            "resourceUrl": "/finance/rechargeList",
          }, {
            "resourceName": "财务管理_充值_制单导出",
            "resourceUrl": "/finance/originatorExport",
          }, {
            "resourceName": "财务管理_充值_审批导出",
            "resourceUrl": "/finance/checkRechargeExport",
          }, {
            "resourceName": "财务管理_充值_流水查询导出",
            "resourceUrl": "/finance/rechargeExport",
          }]
      }, {
        "resourceName": "回款",
        'name': 'returnedMoney',
        "resourceUrl": "/financialManagement/returnedMoney",
        "sonResources": [{
          "resourceName": "财务管理_回款_编辑",
          "resourceUrl": "/finance/collection/businessLineSplit",
        }, {
          "resourceName": "财务管理_回款_删除",
          "resourceUrl": "/finance/collectionDel ",
        }, {
          "resourceName": "财务管理_回款_批量导出",
          "resourceUrl": "/finance/collectionExport",
        },{
          "resourceName": "财务管理_回款_批量导入",
          "resourceUrl": "/finance/collectionImport",
        },{
          "resourceName": "财务管理_回款_回款录入",
          "resourceUrl": "/finance/collectionAdd ",
        },{
          "resourceName": "财务管理_回款_回款拆分导出",
          "resourceUrl": "/finance/collection/businessLineExport",
        },{
          "resourceName": "财务管理_回款_回款拆分导入",
          "resourceUrl": "/finance/collection/businessLineImport",
        }]
      }
    ]
  },
  {
    "resourceName": "应收管理",
    'name': 'payManagement',
    "resourceUrl": "/payManagement",
    "sonResources": [
      {
        "resourceName": "应收管理总表",
        'name': 'summaryTables',
        "resourceUrl": "/payManagement/summaryTables",
        "sonResources": [{
          "resourceName": "应收管理_应收管理总表_导出汇总表",
          "resourceUrl": "/finance/exportQueryAllTypeCollectionMoney",
        }, {
          "resourceName": "应收管理_应收管理总表_导出明细表",
          "resourceUrl": "/finance/exportQueryAllTypeByPlanNameDimension",
        }]
      }, {
        "resourceName": "应收管理明细表",
        'name': 'incomeDetails',
        "resourceUrl": "/payManagement/incomeDetails",
        "sonResources": [{
          "resourceName": "应收管理_应收管理明细表_导出",
          "resourceUrl": "/finance/exportCpcStatementWithCollectionStatus",
        },{
          "resourceName": "应收管理_应收管理明细表_回款维护",
          "resourceUrl": "/finance/addAdCpcConsumeBillReturnMoneyRecord",
        },{
          "resourceName": "应收管理_应收管理明细表_开票",
          "resourceUrl": "",
        }, {
          "resourceName": "应收管理_应收管理明细表_回款",
          "resourceUrl": "/finance/canCollectionList,/finance/canCollectionList",
        }]
      }, {
        "resourceName": "非C应收管理明细表",
        'name': 'unCIncomeDetails',
        "resourceUrl": "/payManagement/unCIncomeDetails",
        "sonResources": [{
          "resourceName": "应收管理_非C应收管理明细表_回款维护",
          "resourceUrl": "/finance/addAdCpsCpaConsumeBillReturnMoneyRecord",
        }]
      },{
        "resourceName": "包月/包年应收管理明细表",
        'name': 'monthYearIncomeDetails',
        "resourceUrl": "/payManagement/monthYearIncomeDetails",
        "sonResources": [{
          "resourceName": "应收管理_包月/包年应收管理明细表_导出",
          "resourceUrl": "/finance/cpt/arDocument/export",
        }, {
          "resourceName": "应收管理_包月/包年应收管理明细表_回款",
          "resourceUrl": "/finance/cpt/arDocument/batchSelectCollection",
        }, {
          "resourceName": "应收管理_包月/包年应收管理明细表_回款维护",
          "resourceUrl": "/finance/addAdCptConsumeBillReturnMoneyRecord",
        }]
      },{
        "resourceName": "逾期管理",
        'name': 'overdue',
        "resourceUrl": "/payManagement/overdue",
        "sonResources": [{
          "resourceName": "应收管理_逾期管理_导出",
          "resourceUrl": "/finance/queryCpcBillOverdueExport",
        }, {
          "resourceName": "应收管理_逾期管理_催收",
          "resourceUrl": "/finance/chaseDebt",
        }]
      }]
  },
  {
    "resourceName": "数据统计",
    'name': 'dataStatistics',
    "resourceUrl": "/dataStatistics",
    "sonResources": [
      {
        "resourceName": "CPC广告计费表",
        'name': 'AdBilling',
        "resourceUrl": "/dataStatistics/AdBilling",
        "sonResources": [
          {
            "resourceName": "数据统计_CPC广告计费表_导出",
            "resourceUrl": "/finance/exportCPCConsumptionStatistic",
          }
        ]
      },
      {
        "resourceName": "CPC广告计费表(备用)",
        'name': 'AdBilling2',
        "resourceUrl": "/dataStatistics/AdBilling2",
        "sonResources": [
        
        ]
      },
      {
        "resourceName": "CPD计费表",
        'name': 'cpdBilling',
        "resourceUrl": "/dataStatistics/CpdBilling",
        "sonResources": [
          {
            "resourceName": "数据统计_CPD计费表_查询",
            "resourceUrl": "/ad/data/statistics/cpd/total",
          },
          {
            "resourceName": "数据统计_CPD计费表_导出",
          }
        ]
      },
      {
        "resourceName": "CPD明细数据报表",
        'name': 'cpdReport',
        "resourceUrl": "/dataStatistics/CpdReport",
        "sonResources": [{
          "resourceName": "数据统计_CPD明细数据报表_OPPO-CPD查询页面",
          "resourceUrl": "/ad/data/statistics/cpd/oppo/detail",
        }, {
          "resourceName": "数据统计_CPD明细数据报表_VIVO-CPD查询页面",
          "resourceUrl": "/ad/data/statistics/cpd/vivo/detail",
        }, {
          "resourceName": "数据统计_CPD明细数据报表_VIVO-导出",
          "resourceUrl": "/ad/data/statistics/cpd/export/vivo/detail",
        }, {
          "resourceName": "数据统计_CPD明细数据报表_OPPO-导出",
          "resourceUrl": "/ad/data/statistics/cpd/export/oppo/detail",
        }]
      }, {
        "resourceName": "CPS/CPA分润表",
        'name': 'cpscpaBilling',
        "resourceUrl": "/dataStatistics/cpscpaBilling",
        "sonResources": [
          {
            "resourceName": "数据统计_CPS/CPA分润表_查询",
            "resourceUrl": "/statistic/cpacps/find",
          }, {
            "resourceName": "数据统计_CPS/CPA分润表_新增",
            "resourceUrl": "/statistic/cpacps/add",
          }, {
            "resourceName": "数据统计_CPS/CPA分润表_批量导入",
            "resourceUrl": "/statistic/cpacps/import",
          }, {
            "resourceName": "数据统计_CPS/CPA分润表_批量导出",
            "resourceUrl": "/statistic/cpacps/export",
          }
        ]
      }, {
        "resourceName": "CPS/CPA计费表",
        'name': 'cpscpaChargingList',
        "resourceUrl": "/dataStatistics/cpscpaChargingList",
        "sonResources": [
          {
            "resourceName": "数据统计_CPS/CPA计费表_新增",
            "resourceUrl": "/finance/cpscpanew/add",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_批量导入",
            "resourceUrl": "/finance/cpscpanew/import",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_导出",
            "resourceUrl": "/finance/cpscpanew/export",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_删除",
            "resourceUrl": "/finance/cpscpanew/delete",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_编辑",
            "resourceUrl": "/finance/cpscpanew/update",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_编辑预估金额",
            "resourceUrl": "/finance/cpscpanew/updateEstimatAmount",
          }, {
            "resourceName": "数据统计_CPS/CPA计费表_生成应收单",
            "resourceUrl": "/finance/cpscpanew/queryStatementStatisticsWithNoReturnStatus",
          },{
            "resourceName": "数据统计_CPS/CPA计费表_重新生成应收",
            "resourceUrl": "/finance/cpscpanew/reCreateCpscpaCollectionMoneyBill",
          },
        ]
      }, {
        "resourceName": "包月/包年计费表",
        'name': 'monthYearChargingList',
        "resourceUrl": "/dataStatistics/monthYearChargingList",
        "sonResources": [
          {
            "resourceName": "数据统计_包月/包年计费表_新增",
            "resourceUrl": "/finance/cpt/add",
          }, {
            "resourceName": "数据统计_包月/包年计费表_批量导入",
            "resourceUrl": "/finance/cpt/import",
          }, {
            "resourceName": "数据统计_包月/包年计费表_导出",
            "resourceUrl": "/finance/cpt/export",
          }, {
            "resourceName": "数据统计_包月/包年计费表_删除",
            "resourceUrl": "/finance/cpt/delete",
          }, {
            "resourceName": "数据统计_包月/包年计费表_编辑",
            "resourceUrl": "/finance/cpt/edit",
          }, {
            "resourceName": "数据统计_包月/包年计费表_生成应收单",
            "resourceUrl": "/finance/cpt/makeArDocument",
          }, {
            "resourceName": "数据统计_包月/包年计费表_重新生成应收",
            "resourceUrl": "/finance/cpt/remakeArDocument",
          }
        ]
      },{
        "resourceName": "包月计费表",
        'name': 'monthBilling',
        "resourceUrl": "/dataStatistics/monthBilling",
        "sonResources": [
          {
            "resourceName": "数据统计_包月计费表_在线表页面",
            "resourceUrl": "/adMonthly/onlineList",
          }, {
            "resourceName": "数据统计_包月计费表_在线记录表页面",
            "resourceUrl": "/adMonthly/historyList",
          }, {
            "resourceName": "数据统计_包月计费表_月度计费明细表页面",
            "resourceUrl": "/adMonthly/monthConsumeList",
          }, {
            "resourceName": "数据统计_包月计费表_在线表_新增",
            "resourceUrl": "/adMonthly/add",
          }, {
            "resourceName": "数据统计_包月计费表_在线表_批量导入",
            "resourceUrl": "/adMonthly/import",
          }, {
            "resourceName": "数据统计_包月计费表_在线表_批量导出",
            "resourceUrl": "/adMonthly/onlineList/export",
          }, {
            "resourceName": "数据统计_包月计费表_在线记录表_导出",
            "resourceUrl": "/adMonthly/historyList/export",
          }, {
            "resourceName": "数据统计_包月计费表_月度计费明细表_导出",
            "resourceUrl": "/adMonthly/monthConsumeList/export",
          }
        ]
      }, {
        "resourceName": "包年计费表",
        'name': 'yearBilling',
        "resourceUrl": "/dataStatistics/yearBilling",
        "sonResources": [
          {
            "resourceName": "数据统计_包年计费表_新增",
            "resourceUrl": "/statistic/yearpackage/add",
          }, {
            "resourceName": "数据统计_包年计费表_批量导入",
            "resourceUrl": "/statistic/yearpackage/import",
          }, {
            "resourceName": "数据统计_包年计费表_批量导出",
            "resourceUrl": "/statistic/yearpackage/export",
          }
        ]
      }
    ]
  },
  {
    "resourceName": "工具箱",
    'name': 'toolBox',
    "resourceUrl": "/toolBox",
    "sonResources": [
      {
        "resourceName": "H5-Demo",
        'name': 'dataEntering',
        "resourceUrl": "/toolBox/dataEntering",
        "sonResources": [
          {
            "resourceName": "工具箱_H5-Demo_批量导入-智能短信",
            "resourceUrl": "/toolCase/msg/import",
          }, {
            "resourceName": "工具箱_H5-Demo_批量导入-网络消息",
            "resourceUrl": "/toolCase/networkMsg/import",
          }, {
            "resourceName": "工具箱_H5-Demo_版本操作-删除",
            "resourceUrl": "/toolCase/version/delete",
          }, {
            "resourceName": "工具箱_H5-Demo_网络消息数据包-删除",
            "resourceUrl": "/toolCase/network/delete",
          }, {
            "resourceName": "工具箱_H5-Demo_智能短信数据包-删除",
            "resourceUrl": "/toolCase/msg/delete",
          }, {
            "resourceName": "工具箱_H5-Demo_网络消息数据包-导出",
            "resourceUrl": "/toolCase/networkMsg/export",
          }, {
            "resourceName": "工具箱_H5-Demo_智能短信数据包-导出",
            "resourceUrl": "/toolCase/msg/export",
          }, {
            "resourceName": "工具箱_H5-Demo_版本数据导出",
            "resourceUrl": "/toolCase/version/export",
          }
        ]
      }, {
        "resourceName": "VIVO-APP实时状态",
        'name': 'vivoApp',
        "resourceUrl": "/toolBox/vivoApp",
        "sonResources": [
          {
            "resourceName": "工具箱_VIVOAPP实时状态-导出",
            "resourceUrl": "/statistic/cpd/export",
          },
        ]
      }, {
        "resourceName": "广告竞价",
        'name': 'bidManagement',
        "resourceUrl": "/toolBox/bidManagement",
        "sonResources": [
          {
            "resourceName": "工具箱_广告竞价_发起竞价",
            "resourceUrl": "/adBid/addBidAd",
          },{
            "resourceName": "工具箱_广告竞价_查看详情",
            "resourceUrl": "/adBid/findCustomerBidRecord",
          },{
            "resourceName": "工具箱_广告竞价_编辑竞价",
            "resourceUrl": "/adBid/updateBidAd",
          },{
            "resourceName": "工具箱_广告竞价_取消竞价",
            "resourceUrl": "/adBid/cancel?id=",
          },
        ]
      }, {
        "resourceName": "小米加密短链表",
        'name': 'xiaomiShortUrl',
        "resourceUrl": "/toolBox/xiaomiShortUrl",
        "sonResources": [{
          "resourceName": "工具箱_小米加密短链表_导出",
          "resourceUrl": "",
        }]
      }
    ]
  },
  {
    "resourceName": "黑名单管理",
    'name': 'blacklistMangement',
    "resourceUrl": "/blacklistMangement",
    "sonResources": [
      {
        "resourceName": "黑名单",
        'name': 'blacklist',
        "resourceUrl": "/blacklistMangement/blacklist",
        "sonResources": [{
          "resourceName": "黑名单管理_黑名单_新增",
          "resourceUrl": "/ad/shops/black/add",
        }, {
          "resourceName": "黑名单管理_黑名单_删除",
          "resourceUrl": "/ad/shops/black/delete",
        }, {
          "resourceName": "黑名单管理_黑名单_导出",
          "resourceUrl": "/ad/shops/black/export",
        }, {
          "resourceName": "黑名单管理_黑名单_批量导入",
          "resourceUrl": "/ad/shops/black/import",
        }]
      }]
  }
]
const routerFilter = (allRouter, resRouter, access) => {
  let useRouter = resRouter.filter((item) => {//过滤掉没有子集的数据
    return item.sonResources && item.sonResources.length
  })
  let allRouters = allRouter;
  let btnAccess = []
  for (let i = 0; i < allRouters.length; i++) {
    for (let j = 0; j < useRouter.length; j++) {
      if (allRouters[i].meta && allRouters[i].meta.resourceUrl == useRouter[j].resourceUrl) {
        allRouters[i].meta.access = access;
        for (let n = 0; n < allRouters[i].children.length; n++) {
          for (let m = 0; m < useRouter[j].sonResources.length; m++) {
            if (allRouters[i].children[n].meta.resourceUrl == useRouter[j].sonResources[m].resourceUrl) {
              allRouters[i].children[n].meta.access = access;
              // let btnAccess = []
              if (useRouter[j].sonResources[m].sonResources && useRouter[j].sonResources[m].sonResources.length) {
                useRouter[j].sonResources[m].sonResources.forEach((item) => {
                  btnAccess.push(item.resourceName)
                })
              }
              // allRouters[i].children[n].meta.btnAccess = btnAccess;
              break;
            }
          }
        }
        break;
      }
    }
  }
  addNoAccess(allRouters)
  return { allRouters, btnAccess }
}
const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}
const addNoAccess = (routes) => {
  routes.forEach((item) => {
    if ((!item.meta.access || !item.meta.access.length) && !item.meta.noControl) {
      item.meta.access = ['noAccess'];
    }
    if (item.children && item.children.length) {
      addNoAccess(item.children)
    }
  })
}
import {
  getUserPermission
} from '@/api/user'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    menuListFormat: [],
    btnAccess: [],
    getPermissionFinish: false,
    permissionModal: false,
    haveHome: false
  },
  getters: {
    menuList: state => state.menuListFormat,
    errorCount: state => state.errorList.length
  },
  mutations: {
    openPermissionModal(state) {
      state.permissionModal = true;
    },
    closePermissionModal(state) {
      state.permissionModal = false;
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag(state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        let flag = false
        state.tagNavList.forEach((item) => {
          if (item.name == router.name) {
            item.params = JSON.parse(JSON.stringify(router.params));
            item.query = JSON.parse(JSON.stringify(router.query));
            flag = true;
          }
        })
        if (!flag) {
          if (type === 'push') state.tagNavList.push(router)
          else {
            if (router.name === homeName) state.tagNavList.unshift(router)
            else state.tagNavList.splice(1, 0, router)
          }
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    },
    setMenuByRouter(state, { routers, arr, access }) {
      //resourceData
      let envArr = PROCESS_ENV ? arr : resourceData;
      state.haveHome = envArr.some((item) => {
        return item.resourceDesc === "_home"
      })
      let routersFormat = routerFilter(routers, envArr, access).allRouters;
      state.menuListFormat = getMenuByRouter(routersFormat, access);
      state.btnAccess = routerFilter(routers, envArr, access).btnAccess
    },
    permissionFinish(state) {
      state.getPermissionFinish = true;
    },
  },
  actions: {
    addErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
    },
    getMenuRouterAccess({ commit, rootState }, routers) {
      return new Promise((resolve, reject) => {
        let envCode = PROCESS_ENV ? 0 : 0; // 调接口时改成0
        // let envCode = 0;
        try {
          getUserPermission().then(res => {
            const { user: { access } } = rootState
            if (res.data.code == envCode) {
              let arr = (res.data.data && res.data.data.permissionTree) ? res.data.data.permissionTree : [];
              commit('setMenuByRouter', { routers, arr, access })
              let userBasicInfo = (res.data.data && res.data.data.userBasicInfo) ? res.data.data.userBasicInfo : {};
              commit('setUserBasicInfo', {userBasicInfo: userBasicInfo})
              resolve(res)
            } else {
              reject()
              commit("permissionFinish")
            }
            commit("permissionFinish")
          }).catch(err => {
            reject(err)
            commit("permissionFinish")
          })
        } catch (error) {
          commit("permissionFinish")
          reject(error)
        }
      })
    },
    hasShowAccess({ commit, rootState }, { el, path }) {
      return true
    },
  }
}
