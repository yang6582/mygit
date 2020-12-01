<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
      <FormItem label="广告类型:">
        <Select v-model="formItem.adType" style="width: 150px">
          <Option v-for="(item,key) in adTypes" :value="item.type" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="用户名:">
        <Input
          v-model="formItem.userName"
          placeholder="用户名"
          @on-enter="searchData(true)"
          style="width:150px;"
        />
      </FormItem> -->
<!--      <FormItem label="广告名称:">-->
<!--        <Input-->
<!--          v-model="formItem.adName"-->
<!--          placeholder="广告名称"-->
<!--          @on-enter="searchData(true)"-->
<!--          style="width:150px;"-->
<!--        />-->
<!--      </FormItem>-->
      <FormItem label="计划名称:">
        <Input
          v-model="formItem.planName"
          placeholder="计划名称"
          @on-enter="searchData(true)"
          style="width:150px;"
          clearable
        />
      </FormItem>
      <FormItem label="厂商:">
        <Select v-model="formItem.vendor" style="width: 150px">
          <Option value="-1">全部</Option>
          <Option
            v-for="item in vendorList"
            :value="item.status"
            :key="item.status_str"
          >{{ item.status_str }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商户名称:">
        <Input
          v-model="formItem.shopName"
          placeholder="商户名称"
          @on-enter="searchData(true)"
          style="width:150px;"
          clearable
        />
      </FormItem>
<!--      <FormItem label="限制条件:">-->
<!--        <Input-->
<!--          v-model="formItem.menus"-->
<!--          placeholder="限制条件"-->
<!--          @on-enter="searchData(true)"-->
<!--          style="width:150px;"-->
<!--        />-->
<!--      </FormItem>-->
      <FormItem label="上线状态:">
        <Select v-model="formItem.adStyle" style="width: 150px">
          <Option
            v-for="item in styleList"
            :value="item.status"
            :key="item.status_str"
          >{{ item.status_str }}</Option>
        </Select>
      </FormItem>
      <FormItem label="提交时间:">
        <Date-picker
          :value="formItem.submitTime"
          @on-change="dateChange"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          style="width: 180px"
        ></Date-picker>
      </FormItem>
      <FormItem :label-width="40">
        <Button type="primary" shape="circle" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" shape="circle" @click="reset" style="margin-left: 20px">重置</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <!-- 自定义列 -->
      <columnsSelect
        :columns="selectColumns"
        :columnsNum="formItem.adType"
        @columns-change="columnsChange"
      ></columnsSelect>
      <br />
      <Table border :columns="columnsSelection" :data="rowData" align="center" key="rowData">
        <!-- 厂商 -->
        <template slot-scope="{ row, index }" slot="partnerName" width="200px">
          <template v-for="(pitem,pindex) in row.partners">
            <div
              class="subCol menus space2"
              :style="{height:getHieght(pitem),borderBottom: row.partners.length == 1 ? 'none':''}"
            >{{pitem.partnerName}}</div>
          </template>
        </template>
        <!-- 用户名 -->
        <!-- <template slot-scope="{ row, index }" slot="customerName" width="200px">
          <template v-for="(pitem,pindex) in row.partners">
            <div
              class="subCol menus space2"
              :style="{height:getHieght(pitem),borderBottom: row.partners.length == 1 ? 'none':''}"
            >{{pitem.customerName}}</div>
          </template>
        </template>-->
        <!-- 菜单名称 -->
        <template slot-scope="{ row, index }" slot="formular" width="200px">
          <template v-for="(pitem,pindex) in row.partners">
            <template v-for="fitem in pitem.formularToMenus">
              <div class="subCol menus space2" :style="{height:getHieght2(fitem)}">
                <Tooltip :content="fitem.ruleInfo" placement="top" transfer>{{fitem.ruleInfo}}</Tooltip>
              </div>
            </template>
          </template>
        </template>
        <!-- 一二菜单名称 -->
        <template slot-scope="{ row, index }" slot="firstMenu" width="200px">
          <template v-for="(pitem,pindex) in row.partners">
            <template v-for="(fitem,findex) in pitem.formularToMenus">
              <div class="subCol menus">
                <ul v-if="fitem.menus && fitem.menus.length">
                  <li
                    v-for="(item,iindex) in fitem.menus"
                    :key="iindex"
                    v-if="item.subMenus"
                    :style="{height: item.subMenus.length ? item.subMenus.length* 40 +'px' : '40px','line-height': item.subMenus.length ? item.subMenus.length* 40 +'px':'40px'}"
                  >
                    <Tooltip :content="item.menuName" placement="top" transfer>{{item.menuName}}</Tooltip>
                  </li>
                </ul>
                <ul v-else class="space"></ul>
              </div>
            </template>
          </template>
        </template>
        <template slot-scope="{ row, index }" slot="secondMenu" width="200px">
          <div class="subCol menus" v-if="row.partners">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul v-if="fitem.menus && fitem.menus.length">
                  <template v-for="(item,iindex) in fitem.menus">
                    <li
                      v-if="item.subMenus.length"
                      style="height: 40px;line-height: 40px"
                      v-for="(j,jindex) in item.subMenus"
                      :key="pindex+''+findex+''+iindex+''+''+jindex+j.menuName"
                    >
                      <Tooltip :content="j.menuName" placement="top" transfer>{{j.menuName}}</Tooltip>
                    </li>
                    <li
                      v-show="!item.subMenus.length"
                      v-if="item.subMenus"
                      :style="{height:'40px','line-height':'40px'}"
                    ></li>
                  </template>
                </ul>
                <ul v-else class="space"></ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 计划名称 -->
        <template slot-scope="{ row, index }" slot="planName">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template v-if="item.plan && item.plan.planName">
                      <li>
                        <Tooltip
                        transfer
                          :content="item.plan.planName"
                          placement="top"
                        >{{item.plan.planName}}</Tooltip>
                      </li>
                    </template>
                    <template v-else>
                      <template
                        v-for="(j,i) in item.subMenus"
                        v-if="item.subMenus && item.subMenus.length"
                      >
                        <li v-if="j.plan && j.plan.planName">
                          <Tooltip :content="j.plan.planName" placement="top" transfer>{{j.plan.planName}}</Tooltip>
                        </li>
                        <li v-else></li>
                      </template>
                      <template v-if="!item.subMenus || !item.subMenus.length">
                        <li></li>
                      </template>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 单价 -->
        <template slot-scope="{ row, index }" slot="adPrice">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template v-if="item.ads && item.ads.adPrice">
                      <li>{{item.ads.adPrice}}</li>
                    </template>
                    <template v-else>
                      <template
                        v-for="(j,i) in item.subMenus"
                        v-if="item.subMenus && item.subMenus.length"
                      >
                        <li v-if="j.ads && j.ads.adPrice">{{j.ads.adPrice}}</li>
                        <li v-else></li>
                      </template>
                      <template v-if="!item.subMenus || !item.subMenus.length">
                        <li></li>
                      </template>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 结算方式 -->
        <template slot-scope="{ row, index }" slot="adChargedName">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template v-if="item.ads && item.ads.adChargedName">
                      <li>{{item.ads.adChargedName}}</li>
                    </template>
                    <template v-else>
                      <template
                        v-for="(j,i) in item.subMenus"
                        v-if="item.subMenus && item.subMenus.length"
                      >
                        <li v-if="j.ads && j.ads.adChargedName">{{j.ads.adChargedName}}</li>
                        <li v-else></li>
                      </template>
                      <template v-if="!item.subMenus || !item.subMenus.length">
                        <li></li>
                      </template>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 预算 -->
        <template slot-scope="{ row, index }" slot="adBudget">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template v-if="item.adsPrepare && item.adsPrepare.adBudget">
                      <li>{{item.adsPrepare.adBudget}}</li>
                    </template>
                    <template v-else>
                      <template
                        v-for="(j,i) in item.subMenus"
                        v-if="item.subMenus && item.subMenus.length"
                      >
                        <li v-if="j.adsPrepare && j.adsPrepare.adBudget">{{j.adsPrepare.adBudget}}</li>
                        <li v-else></li>
                      </template>
                      <template v-if="!item.subMenus || !item.subMenus.length">
                        <li></li>
                      </template>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 花费 -->
        <template slot-scope="{ row, index }" slot="adBudgetUsed">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template v-if="item.adsPrepare && item.adsPrepare.adBudgetUsed">
                      <li>{{item.adsPrepare.adBudgetUsed}}</li>
                    </template>
                    <template v-else>
                      <template
                        v-for="(j,i) in item.subMenus"
                        v-if="item.subMenus && item.subMenus.length"
                      >
                        <li
                          v-if="j.adsPrepare && j.adsPrepare.adBudgetUsed"
                        >{{j.adsPrepare.adBudgetUsed}}</li>
                        <li v-else></li>
                      </template>
                      <template v-if="!item.subMenus || !item.subMenus.length">
                        <li></li>
                      </template>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <!-- 上线状态 -->
        <template slot-scope="{ row, index }" slot="onlineStatusName">
          <div class="subCol menus3 otherTitle">
            <template v-for="(pitem,pindex) in row.partners">
              <template v-for="(fitem,findex) in pitem.formularToMenus">
                <ul>
                  <template v-for="(item,indexm) in fitem.menus">
                    <template
                      v-for="(j,i) in item.subMenus"
                      v-if="item.subMenus && item.subMenus.length"
                    >
                      <li>{{j.onlineStatusName}}</li>
                    </template>
                    <template v-if="!item.subMenus || !item.subMenus.length">
                      <li>{{item.onlineStatusName}}</li>
                    </template>
                  </template>
                </ul>
              </template>
            </template>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <template v-for="(pitem,pindex) in row.partners">
            <template v-for="(fitem,findex) in pitem.formularToMenus">
              <div class="subCol munus space2" :style="{height:getHieght2(fitem)}">
                <Button
                  type="error"
                  size="small"
                  style="margin-right: 5px"
                  @click="delMenus(row.shopId,pitem.partnerId,fitem.ruleInfo)"
                  v-if="false"
                >删除</Button>
                <Button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="editMenus(row.shopId, row.shopName, pitem.partnerId)"
                >编辑</Button>

                <!-- <Button :type="row.status==98?'success':'warning'"
                    size="small"
                    >{{row.status == 98 ? '恢复' : '暂停'}}
                </Button>-->
              </div>
            </template>
          </template>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="pageIndex"
        @on-change="pageChange"
        :page-size="pageSize"
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import http from "@/utils/http";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
Date.prototype.td_formate1 = function() {
  return this.getFullYear() + '-' + (this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1) : this.getMonth() + 1) + '-' + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate());
};
export default {
  name: "adTypeList",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      formItem: {
        adType: 1,
        submitTime: [
          // new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).td_formate1(),
          // new Date().td_formate1()
        ],
        userName: "",
        adName: "",
        planName: "",
        //manufacturer: "",
        shopName: "",
        menus: "",
        adStyle: -1,
        vendor: "-1"
      },
      styleList: [
        {
          status: -1,
          status_str: "全部状态"
        },
        {
          status: 0,
          status_str: "已下线"
        },
        {
          status: 1,
          status_str: "已上线"
        }
      ],
      vendorList: [],
      total_count: 0,
      pageIndex: 1,
      pageSize: 10,
      adTypes: [
        // 暂时只有菜单广告
        {
          type: 1,
          value: "菜单广告"
        }
      ],
      columnsSelection: [],
      columns: config.adTypeMenuColumns, // 菜单的自定义列配置
      rowData: []
    };
  },
  computed: {
    selectColumns() {
      switch (this.formItem.adType) {
        case 1:
          return this.columns;
      }
    }
  },
  methods: {
    editMenus(shopId, shopName, partnerId) {
      this.$router.push({
        name: "menuSet",
        params: {
          shopId: shopId,
          shopName: shopName,
          partnerId: partnerId + "",
          isBack: true
        }
      });
    },
    delMenus(shopId, partnerId, ruleInfo) {
      let postData = {
        shopId,
        partnerId,
        ruleInfo
      };
      axios
        .request({
          url: "/ad/menus/deleteByPartnerIdAndRuleInfo",
          method: "post",
          data: postData
        })
        .then(d => {
          this.searchData();
        })
        .catch(() => {});
    },
    getHieght(item) {
      let count = 0;
      item.formularToMenus.forEach(fitem => {
        if (fitem.menus.length) {
          fitem.menus.forEach(i => {
            if (i.subMenus.length) {
              i.subMenus.forEach(j => {
                count++;
              });
            } else {
              count++;
            }
          });
        } else {
          count++;
        }
      });

      return count ? count * 40 + "px" : "40px";
    },
    getHieght2(item) {
      let count = 0;
      if (item.menus.length) {
        item.menus.forEach(i => {
          if (i.subMenus.length) {
            i.subMenus.forEach(j => {
              count++;
            });
          } else {
            count++;
          }
        });
      }
      return count ? count * 40 + "px" : "40px";
    },
    searchData(isfirst) {
      if (isfirst) {
        this.pageIndex = 1;
      }
      var postData = {
        pageIndex: this.pageIndex,
        pageSize: 10,
        createTimeBegin: this.formItem.submitTime[0],
        createTimeEnd: this.formItem.submitTime[1],
        shopName: this.formItem.shopName,
        adName: this.formItem.adName,
        planName: this.formItem.planName,
        menuName: this.formItem.menus,
        onlineStatus: this.formItem.adStyle,
        partnerId: this.formItem.vendor
      };
      axios
        .request({
          url: "/ad/menus/findShopWithMenuAndPlan",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowData = d.data.data == null ? [] : d.data.data.data;
            this.total_count = d.data.data == null ? 0 : d.data.data.total;
          }
        })
        .catch(() => {});
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    reset() {
      this.formItem = Object.assign(
        {},
        {
          adType: 1,
          submitTime: [
            // new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
            // new Date()
          ],
          userName: "",
          adName: "",
          planName: "",
          manufacturer: "",
          shopName: "",
          menus: "",
          adStyle: -1
        }
      );
      this.searchData(true);
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.searchData();
    },
    getVendor() {
      axios
        .request({
          url: "/sys/utils/all",
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            d.data.data.sysConfig.partnerName.forEach(item => {
              let obj = {};
              obj.status = item.key;
              obj.status_str = item.value;
              this.vendorList.push(obj);
            });
          }
        });
    },
    dateChange(date) {
      this.formItem.submitTime = date;
    }
  },
  created() {
    this.searchData(true);
    this.getVendor();
  }
};
</script>
<style scoped lang="less">
.menus {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul {
    box-sizing: border-box;
    //width: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.space {
  height: 40px;
  border-bottom: 1px solid #e8eaec;
  line-height: 40px;
}
.space2 {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e8eaec;
  justify-content: center;
  white-space: nowrap;
  &:last-child {
    border-bottom: none;
  }
}
.menus3 {
  display: flex;
  flex-direction: column;
  ul {
    box-sizing: border-box;
    //width: 50%;
    display: flex;
    flex-direction: column;
    li {
      height: 40px;
      line-height: 40px;
    }
  }
}
.otherTitle {
  ul {
    width: 100%;
  }
}

.subCol ul li {
  list-style: none;
  text-align: center;
  border-bottom: 1px solid #e8eaec;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  //padding: 0 10px;
}

// /deep/ .subCol ul li:last-child {
//   border-bottom: none
// }

/deep/ .ivu-table-cell {
  padding: 0px;
}

.layout-table {
  padding-right: 10px;
  // padding-top: 20px;
}
</style>
