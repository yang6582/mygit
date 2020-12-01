<template>
  <div>
    <Form :model="formItem" :label-width="100" :inline="true" style="margin-top: 20px">
      <!--      <FormItem label="用户名:">-->
      <!--        <Input v-model="formItem.userName" placeholder="用户名" @on-enter="searchData(true)"/>-->
      <!--      </FormItem>-->
      <!--      <FormItem label="广告名称:">-->
      <!--        <Input v-model="formItem.adName" placeholder="广告名称" @on-enter="searchData(true)"/>-->
      <!--      </FormItem>-->
      <FormItem label="计划名称:">
        <Input
          v-model="formItem.planName"
          placeholder="计划名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customerName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="推广目的">
        <Select
          v-model="formItem.newPlanExt"
          style="width:150px"
          @on-change="searchData(true)"
          clearable
        >
          <Option value="1">应用下载</Option>
          <Option value="2">应用唤起</Option>
          <Option value="3">落地页访问</Option>
          <Option value="4">按条投放</Option>
        </Select>
      </FormItem>
      <FormItem label="创建人:">
        <Input v-model="formItem.creator" placeholder="创建人" @on-enter="searchData(true)" clearable />
      </FormItem>
      <!--      <FormItem label="提交时间:">-->
      <!--        <Date-picker-->
      <!--            :value="formItem.submitTime"-->
      <!--            format="yyyy-MM-dd"-->
      <!--            type="daterange"-->
      <!--            placement="bottom-end"-->
      <!--            placeholder="选择日期"-->
      <!--            style="width:180px;"-->
      <!--        ></Date-picker>-->
      <!--      </FormItem>-->
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="reset" style="margin-left: 10px">重置</Button>
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
      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="listLoading"
      >
        <template slot-scope="{ row, index }" slot="action">
          <div style="display: flex">
            <div style="margin: 10px 10px 10px 15px">
              <Button
                type="primary"
                size="small"
                @click="editPlan(row)"
                v-if="showAccess('广告管理_计划列表_编辑')"
              >编辑</Button>
            </div>
            <div style="margin: 10px 10px 10px 0px">
              <Button
                type="primary"
                size="small"
                @click="checkAdList(row)"
                v-if="showAccess('广告管理_计划列表_查看')"
              >查看</Button>
            </div>
            <div style="margin: 10px 0">
              <Button
                type="success"
                size="small"
                @click="createAd(row)"
                v-if="showAccess('广告管理_计划列表_新建广告')"
              >新建广告</Button>
            </div>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="launchTime">
          <span>{{row.beginTime | formatDateShort}}</span>
          <br />
          <span>{{row.endTime | formatDateShort}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="createTime">
          <span v-html="formatDateComputed(row.createTime)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="planExt">
          <span>{{row.planExt == 1 ? '应用下载' : row.planExt == 2 ? '应用唤起' : row.planExt == 3 ? '落地页访问' :row.planExt == 4 ? '按条投放' : ''}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="updateTime">
          <span v-html="formatDateComputed(row.updateTime)"></span>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="formItem.pageIndex"
        @on-change="pageChange"
        :page-size="formItem.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal title="编辑推广计划" v-model="dialogVisible" @on-ok="savePlan" @on-cancel="cancel">
      <div style="display: flex; align-items: center">
        <div style="min-width: 30%; text-align: right">
          <span style="color: red">*</span>推广计划名称：
        </div>
        <div class="value">
          <i-input v-model="adPostData.planName" style="width:200px;" disabled></i-input>
        </div>
      </div>
      <div style="display: flex; margin-top: 20px; align-items: center">
        <div style="min-width: 30%; text-align: right">
          <span style="color: red">*</span>客户名称：
        </div>
        <div class="value">
          <i-input v-model="adPostData.customerName" style="width:200px;" disabled></i-input>
        </div>
      </div>
      <div style="display: flex; margin-top: 20px; align-items: center">
        <span style="min-width: 30%; text-align: right">预算：</span>
        <div class="value">
          <i-input v-model="adPostData.planBudget" style="width:200px;"></i-input>
        </div>
      </div>
      <div style="display: flex; margin-top: 20px; align-items: center">
        <div style="min-width: 30%; text-align: right">
          <span style="color: red">*</span>推广目的：
        </div>
        <div class="value">
          <Select v-model="adPostData.planExt" style="width:200px">
            <Option value="1">应用下载</Option>
            <Option value="2">应用唤起</Option>
            <Option value="3">落地页访问</Option>
            <Option value="4">按条投放</Option>
          </Select>
        </div>
      </div>
      <div style="display: flex; margin-top: 20px; align-items: center">
        <div style="min-width: 30%; text-align: right">投放日期：</div>
        <div class="value">
          <DatePicker
            :options="disabledDate"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择日期范围"
            v-model="adPostData.dateRange"
            style="width: 200px"
          ></DatePicker>
        </div>
      </div>
    </Modal>
    <Modal
      title="广告列表"
      v-model="adListModal"
      width="800"
      :mask-closable="false"
      @on-visible-change="closeAdListModal"
    >
      <div>
        <Form ref="adListForm" :model="adListForm" :label-width="80" :inline="true">
          <FormItem label="广告渠道：">
            <RadioGroup
              v-model="adListForm.adPositionType"
              type="button"
              @on-change="searchAdData(true)"
            >
              <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
            </RadioGroup>
          </FormItem>
          <br />
        </Form>
        <Table
          border
          :columns="adListColumns"
          :data="adRowData"
          :loading="adListLoading"
          style="overflow-x:scroll;"
        >
          <template slot-scope="{row, index}" slot="adName">
            <span style="cursor: pointer;" @click="clickAdName(row)">{{row.adName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="positionNames">
            <span>{{row.adPositionTypeName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="approvalStatusName">
            <span :style="{'color':row.approvalStatus ==2 ? '#42c565' : row.approvalStatus ==99 ? 'red' : row.approvalStatus == 98 ?'#fea135':'black'}">{{row.approvalStatusName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="createTime">
              <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
              <span v-else></span>
            </template>
          <template slot-scope="{row, index}" slot="adUrl">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{row.adUrl}}</div>
              <Button
                size="small"
                style="color:#59afed"
                @click="open(row.adUrl)"
                v-if="row.adUrl"
              >查看</Button>
            </Tooltip>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;">
        <Page
          :total="adListForm.total_count"
          size="small"
          :current="adListForm.pageIndex"
          @on-change="adPageChange"
          :page-size="adListForm.pageSize"
          @on-page-size-change="adPageSizeChange"
          show-sizer
          show-total
          show-elevator
          style="margin-top:10px;"
        ></Page>
        </div>
       
      </div>
      <div slot="footer">
        <!-- <Button type="primary" style="margin-left:10px;" @click="copyAdSubmit">确定</Button> -->
        <Button @click="cancelCopyHandler">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import { getToken, uuid } from "@/libs/util";

import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");

export default {
  name: "adTypeList",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      formItem: {
        adType: 1,
        // submitTime: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()],
        userName: "",
        customerId: "",
        customerName: "",
        planId: "",
        planName: "",
        pageSize: 10,
        pageIndex: 1,
        creator: "",
        newPlanExt: ""
      },
      adListModal: false,
      adListForm: {
        adPositionType: 1,
        pageSize: 10,
        pageIndex: 1,
        total_count: 0,
        planId: ''
      },
      adTypes: [
        {
          type: 1,
          value: "菜单广告"
        },
        {
          type: 2,
          value: "下一步广告"
        },
        {
          type: 3,
          value: "中间页广告"
        }
      ],
      adListColumns: config.adListColumns,
      adRowData: [],
      adListLoading: false,
      total_count: 0,
      dialogVisible: false,
      columnsSelection: [],
      columns: config.adPlanMenuColumns, // 菜单的自定义列配置
      rowData: [],
      listLoading: false,
      adPostData: {
        customerId: "",
        planName: "",
        planBudget: "",
        rules: [],
        planId: "",
        planBudgetUsed: "",
        planExt: "",
        dateRange: []
      }
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    selectColumns() {
      switch (this.formItem.adType) {
        case 1:
          return this.columns;
      }
    },
    formatDateComputed() {
      return value => {
        if (value) {
          let time = moment(value)
            .format("YYYY-MM-DD HH:mm:ss")
            .split(" ");
          return time[0] + "<br>" + time[1];
        } else {
          return "";
        }
      };
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    }
  },
  methods: {
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      var postData = {
        customerId: this.formItem.customerId,
        customerName: this.formItem.customerName,
        planId: this.formItem.planId,
        planName: this.formItem.planName,
        pageSize: this.formItem.pageSize,
        pageIndex: this.formItem.pageIndex - 1,
        creator: this.formItem.creator,
        planExt: this.formItem.newPlanExt ? this.formItem.newPlanExt : -1
      };
      let _this = this;
      axios
        .request({
          url: "ad/management/plan/all",
          method: "post",
          data: postData
        })
        .then(d => {
          let dataArr = d.data.data;
          _this.rowData = dataArr.data;
          this.listLoading = false;
          _this.total_count = d.data.data.total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    reset() {
      this.formItem = Object.assign(
        {},
        {
          adType: 1,
          customerId: "",
          customerName: "",
          planId: "",
          planName: "",
          pageSize: 10,
          pageIndex: 1
        }
      );
      this.searchData(true);
    },
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageIndex = 1;
      this.formItem.pageSize = val;
      this.searchData();
    },
    editPlan(row) {
      this.dialogVisible = true;
      this.adPostData.planName = row.planName;
      this.adPostData.planBudget = row.planBudget;
      this.adPostData.customerId = row.customerId;
      this.adPostData.planId = row.planId;
      this.adPostData.customerName = row.customerName;
      this.adPostData.planBudgetUsed = row.planBudgetUsed;
      this.adPostData.planExt = row.planExt;
      this.adPostData.dateRange = [
        moment.unix(row.beginTime) / 1000,
        moment.unix(row.beginTime) / 1000
      ];
    },
    checkAdList(row) {
      this.adListForm.planId = row.planId
      this.searchAdData(true);
    },
    closeAdListModal() {

    },
    searchAdData(isfirst, row) {
      this.adListLoading = true;
      //this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.adListForm.pageIndex = 1;
      }
      var postData = {
        adPositionType: this.adListForm.adPositionType,
        pageIndex: this.adListForm.pageIndex,
        pageSize: this.adListForm.pageSize,
        planId: this.adListForm.planId
      };
      let _this = this;
      axios
        .request({
          url: "/ad/management/ads/findAdsPrepareWithPlan",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            let dataArr = d.data.data.data;
            _this.adRowData = dataArr;
            _this.adListForm.total_count = d.data.data.total;
            _this.adListModal = true;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.adListLoading = false;
        })
        .catch(err => {
          this.adListLoading = false;
          this.$Message.error("网络错误");
        });
    },
    /** 点击原链链接跳转 */
    open(url) {
      window.open(url);
    },
    adPageChange(val) {
      this.adListForm.pageIndex = val;
      this.searchAdData();
    },
    adPageSizeChange(val) {
      this.adListForm.pageIndex = 1;
      this.adListForm.pageSize = val;
      this.searchAdData();
    },
    cancelCopyHandler() {
      this.adListForm.adPositionType = 1;
      this.adListForm.pageSize = 10;
      this.adListForm.pageIndex = 1;
      this.adListModal = false;
    },
    clickAdName(row) {
      this.Observer.$emit("refreshAdList", {adName: row.adName, adPositionType: this.adListForm.adPositionType});
      this.$router.push({
        name: 'AdAllList',
        params: {adName: row.adName, adPositionType: this.adListForm.adPositionType}
      })
    },
    cancel() {
      this.dialogVisible = false;
    },
    savePlan() {
      if (this.adPostData.planBudget) {
        if (isNaN(this.adPostData.planBudget)) {
          this.$Modal.warning({
            title: "注意",
            content: "预算必须为数字"
          });
          return;
        }
        if (
          0 > this.adPostData.planBudget ||
          this.adPostData.planBudget > 100000000
        ) {
          this.$Modal.warning({
            title: "注意",
            content: "预算范围0-100000000"
          });
          return;
        }
        if (!/^\d{0,8}(\.\d{0,4})?$/.test(this.adPostData.planBudget)) {
          this.$Modal.warning({
            title: "注意",
            content: "预算只支持小数点前最多8位，小数点后最多4位"
          });
          return;
        }
      }
      if (!this.adPostData.planExt) {
        this.$Modal.warning({
          title: "注意",
          content: "请选择推广目的"
        });
        return;
      }
      var beginTime =
        this.adPostData.dateRange[0] !== 0
          ? moment(
              moment(this.adPostData.dateRange[0]).format("YYYY-MM-DD 00:00:00")
            ).valueOf()
          : "";
      var endTime =
        this.adPostData.dateRange[1] !== 0
          ? moment(
              moment(this.adPostData.dateRange[1]).format("YYYY-MM-DD 23:59:59")
            ).valueOf()
          : "";
      var postData = {
        customerId: this.adPostData.customerId,
        planName: this.adPostData.planName,
        beginTime: beginTime,
        endTime: endTime,
        planBudget: parseFloat(this.adPostData.planBudget),
        planExt: this.adPostData.planExt,
        rules: [],
        planId: this.adPostData.planId
      };
      axios
        .request({
          url: "ad/management/plan/edit",
          method: "post",
          data: postData
        })
        .then(
          d => {
            if (d.data.code === 0) {
              this.searchData(true);
            } else {
              this.$Message.error(d.data.msg);
            }
          },
          err => {
            this.$Message.error("请求失败，" + err + "，请稍后再试！");
          }
        );
    },
    createAd(row) {
      this.$router.push({
        path: "/AdManagement/promotionPlan",
        query: { customId: row.customerId, planid: row.planId, Current: 1 }
      });
    }
  },
  created() {
    // http.get('ad/management/plan/all').then(d => {
    //   this.partner_list = (function () {
    //     var arr = []
    //     for (var x in d.data.data.result.partner_list) {
    //       arr.push(d.data.data.result.partner_list[x])
    //     }
    //     return arr
    //   })()
    //   this.searchData(true)
    // })
    this.searchData(true);
  }
};
</script>
<style scoped lang="less">
.ivu-btn-primary .margin-15 {
  margin: 0 10px;
}

/deep/ .menuName {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ul {
    box-sizing: border-box;
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 1px solid #e8eaec;
    &:last-child {
      border-right: none;
    }
  }
}

/deep/ .otherTitle {
  ul {
    width: 100%;
  }
}

/deep/ .subCol ul li {
  list-style: none;
  text-align: center;
  border-bottom: 1px solid #e8eaec;
  overflow: hidden;
}

/deep/ .subCol ul li:last-child {
  border-bottom: none;
}

/deep/ .ivu-table-cell {
  padding: 0px;
}

.layout-table {
  padding-right: 10px;
  //padding-top: 20px;
}

</style>
