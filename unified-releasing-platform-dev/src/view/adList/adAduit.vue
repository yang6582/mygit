<template>
  <div>
    <!-- 测试用style -->
    <div class="layout-search">
      <Form :model="searchForm" inline :label-width="100">
        <FormItem label="广告渠道:">
          <!-- <Select
            v-model="searchForm.adPositionType"
            style="width:149px"
            @on-change="searchData(true)"
          >
            <Option v-for="(item,key) in adTypes" :value="item.type" :key="key">{{ item.value }}</Option>
          </Select>-->
          <RadioGroup
            v-model="searchForm.adPositionType"
            type="button"
            @on-change="searchData(true)"
          >
            <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="厂商:">
          <Select v-model="searchForm.partnerId" style="width:180px" @on-change="searchData(true)">
            <Option :value="-1">全部</Option>
            <Option
              v-for="(item,key) in partnerNames"
              :value="item.index"
              :key="key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="提交时间:">
          <Date-picker
            :value="searchForm.submitTime"
            format="yyyy-MM-dd"
            transfer
            @on-change="submitTimeChange"
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 180px"
          ></Date-picker>
        </FormItem>
        <br />
        <FormItem label="广告名称:">
          <Input
            v-model="searchForm.adName"
            placeholder="广告名称"
            style="width:262px"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="广告状态:">
          <Select
            v-model="searchForm.approvalStatus"
            style="width:180px"
            @on-change="searchData(true)"
          >
            <Option
              v-for="(item,key) in approvalStatus"
              :value="item.status"
              :key="key"
            >{{ item.status_str }}</Option>
          </Select>
        </FormItem>
        <FormItem label="客户名:">
          <Input
            v-model="searchForm.customerName"
            placeholder="用户名"
            style="width:180px"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>

        <FormItem :label-width="50">
          <Button
            type="primary"
            @click="searchData(true)"
            icon="ios-search"
            style="margin-left:10px"
          >查询</Button>
          <Button type="primary" @click="reset" style="margin-left:10px">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="layout-table">
      <!-- 自定义列 -->
      <div style="display:flex;">
        <Button
          type="primary"
          @click="batchPass"
          style="margin-right:10px;"
          v-if="showAccess('广告管理_广告审核_批量通过')"
        >批量通过</Button>
        <columnsSelect
          :columns="adTypeSearch== 3 ? middleColumns : columns"
          :columnsNum="adTypeSearch"
          @columns-change="columnsChange"
          btnSize="default"
        ></columnsSelect>
      </div>

      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        style="min-width:1100px;overflow-x:scroll;margin-top: 20px;"
        :loading="listLoading"
        @on-selection-change="onSelChange"
      >
        <template slot-scope="{row, index}" slot="adUrl">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.adUrl}}</div>
            <Button size="small" style="color:#59afed" @click="open(row.adUrl)" v-if="row.adUrl">查看</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row}" slot="imgUrl">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.imgUrl}}</div>
            <viewer :images="imgUrlComputed(row.imgUrl)">
              <img
                v-for="(src,index) in imgUrlComputed(row.imgUrl)"
                :src="src"
                :key="index"
                style="max-width:40px;margin:10px 0 5px;cursor:pointer;"
              />
            </viewer>
          </Tooltip>
          <!-- <Button
                  size="small"
                  style="color:#59afed"
                  @click="open(row.imgUrl)"
                  v-if="row.imgUrl"
          >查看</Button>-->
        </template>
        <template slot-scope="{row}" slot="positionNames">
          <span>{{row.adChargedTypeName}}</span>
        </template>
        <template slot-scope="{row}" slot="partnerId">
          <span>{{partnerIdComputed(row.partnerId)}}</span>
        </template>
        <template slot-scope="{row}" slot="createTime">
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{row}" slot="adOnlineStatus">
          <span>{{adOnlineStatusOptions[row.adOnlineStatus]}}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <div style="padding:10px 0;display:flex;">
            <Button
              v-if="row.approvalStatus == 1 && showAccess('广告管理_广告审核_通过')"
              type="primary"
              size="small"
              @click="editCurrentAd(row.adId, 1, row.adPositionType)"
            >通过</Button>
            <Button
              v-if="row.approvalStatus == 1 && showAccess('广告管理_广告审核_拒绝')"
              style="margin-left: 10px"
              type="error"
              size="small"
              @click="editCurrentAd(row.adId, 2, row.adPositionType)"
            >拒绝</Button>
          </div>
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
      <Modal
        v-model="batchModel"
        title="批量审核通过"
        :mask-closable="false"
        @on-visible-change="closeBatchModal"
      >
        <p style="color:red;text-align: center;">确定该{{batchPassIds.length}}条广告全部审核通过么？</p>
        <Form
          :model="batchAuditForm"
          inline
          :label-width="100"
          ref="batchAuditForm"
          :rules="batchRuleValidate"
          style="text-align: center;margin-top:10px;"
        >
          <FormItem label="理由：" prop="reason">
            <Input
              v-model="batchAuditForm.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入理由"
              clearable
            ></Input>
          </FormItem>
        </Form>
        <div
          v-if="importResult"
          style="color:red;text-align: center;"
        >成功审核{{batchPassIds.length - importResultFail}}条数据，失败{{importResultFail}}条数据</div>
        <div slot="footer">
          <Button
            type="primary"
            style="margin-left:10px;"
            @click="submitBatchHandler"
            :disabled="importResult"
            :loading="batchLoading"
          >确定</Button>
          <Button @click="batchModel=false">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
moment.locale("zh-cn");
export default {
  name: "adList",
  components: {
    columnsSelect: () => import("@/components/columns-select")
    // MenuTable: () => import('./components/MenuTable.vue')
  },
  data() {
    return {
      partnerNames: [
        {
          index: 5,
          key: "5",
          value: "VIVO"
        },
        {
          index: 1,
          key: "1",
          value: "OPPO"
        },
        {
          index: 2,
          key: "2",
          value: "金立"
        },
        {
          index: 3,
          key: "3",
          value: "乐视"
        },
        {
          index: 4,
          key: "4",
          value: "ZUK"
        },
        {
          index: 9,
          key: "9",
          value: "NEX3"
        },
        {
          index: 6,
          key: "6",
          value: "一加"
        }
      ],
      listLoading: false,
      searchForm: {
        adPositionType: 1,
        approvalStatus: -1,
        submitTime: [],
        customerName: "",
        adName: "",
        partnerId: -1
      },
      approvalStatus: [
        {
          status: -1,
          status_str: "所有状态"
        },
        {
          status: 1,
          status_str: "待审核"
        },
        {
          status: 3,
          status_str: "已拒绝"
        }
      ],
      total_count: 0,
      pageIndex: 1,
      pageSize: 10,
      adTypes: [
        //暂时只有菜单广告
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
      columnsSelection: [],
      columns: config.adAduitMenuColumns, // 菜单的自定义列配置
      middleColumns: config.middleColumnsAudit, // 中间页的自定义列配置 adTypeSearch === 3
      rowData: [],
      adChargedTypes: [],
      adPositionTypes: [],
      vendorOptions: [
        { value: 5, label: "VIVO" },
        { value: 1, label: "OPPO" },
        { value: 2, label: "金立" },
        { value: 3, label: "乐视" },
        { value: 4, label: "ZUK" },
        { value: 9, label: "NEX3" },
        { value: 6, label: "一加" }
      ],
      batchModel: false,
      batchshopIds: [],
      batchAuditForm: {
        reason: ""
      },
      batchRuleValidate: {
        reason: [
          {
            required: true,
            message: "理由为必填项",
            trigger: "blur"
          }
        ]
      },
      importResult: false,
      importResultFail: 0,
      batchPassIds: [],
      batchLoading: false
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    imgUrlComputed() {
      return url => {
        if (!url || url == "http://apsaras-static.teddymobile.cn/") {
          return [];
        } else {
          let arr = [url];
          return arr;
        }
      };
    },
    partnerIdComputed() {
      return partnerId => {
        for (let i = 0; i < this.vendorOptions.length; i++) {
          if (this.vendorOptions[i].value == partnerId) {
            return this.vendorOptions[i].label;
          }
        }
      };
    }
  },
  methods: {
    copyShortUrl(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success("复制成功");
      oInput.remove();
    },
    searchData(isfirst) {
      // 广告审核 查询
      this.listLoading = true;
      this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.pageIndex = 1;
      }
      // this.toOppoSelection = "";
      // this.current_ad_type = this.searchForm.adPositionType;
      var postData = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        customerName: this.searchForm.customerName.trim(),
        createTimeBegin: this.searchForm.submitTime[0],
        createTimeEnd: this.searchForm.submitTime[1],
        adName: this.searchForm.adName.trim(),
        approvalStatus: this.searchForm.approvalStatus,
        adPositionType: this.searchForm.adPositionType,
        partnerId: this.searchForm.partnerId
      };
      axios
        .request({
          url: "/ad/management/ads/searchAllByApprovalStatus",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            let dataArr = d.data.data.data;

            this.rowData = dataArr;

            this.total_count = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }

          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.$Message.error("网络异常,查询失败");
        });
    },
    columnsChange(columns) {
      columns.unshift({
        type: "selection",
        width: 60,
        align: "center",
        fixed: "left"
      });
      this.columnsSelection = columns;
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        adPositionType: 1,
        approvalStatus: -1,
        submitTime: [],
        customerName: "",
        adName: ""
      });
      this.searchData(true);
    },
    submitBatchHandler() {
      let _this = this;
      this.$refs.batchAuditForm.validate(valid => {
        if (valid) {
          let postData = {
            positionType: _this.searchForm.adPositionType,
            adIds: _this.batchshopIds,
            reason: _this.batchAuditForm.reason
          };
          _this.batchLoading = true;
          axios
            .request({
              url: "/ad/management/ads/approvalAgreeBatch",
              method: "post",
              data: postData
            })
            .then(
              d => {
                if (d.data.code === 0) {
                  _this.importResult = true;
                  _this.importResultFail = d.data.data.length;
                  _this.batchshopIds = [];
                  _this.searchData(true);
                } else {
                  _this.$Message.error(d.data.msg);
                }
                _this.batchLoading = false;
              },
              err => {
                _this.batchLoading = false;
                _this.$Message.error("请求失败，" + err + "，请稍后再试!");
              }
            );
        }
      });
    },
    closeBatchModal(flag) {
      if (!flag) {
        this.$refs.batchAuditForm.resetFields();
        this.importResult = false;
      }
    },
    batchPass() {
      if (!this.batchshopIds.length) {
        this.$Message.warning("未选择操作项");
      } else {
        this.batchModel = true;
      }
    },
    onSelChange(sel) {
      this.batchshopIds = sel.map(item => {
        return item.adId;
      });
      this.batchPassIds = this.batchshopIds;
    },
    submitTimeChange(data) {
      this.searchForm.submitTime = data;
    },
    open(url) {
      window.open(url);
    },
    pageChange(page) {
      this.pageIndex = page;
      this.searchData();
    },
    editCurrentAd(id, status, postion) {
      var postData = {
        adId: id,
        approvalStatus: status,
        adPositionType: postion
      };
      var _this = this;
      axios
        .request({
          url: "/ad/management/ads/approval",
          method: "post",
          data: postData
        })
        .then(
          d => {
            if (d.data.code === 0) {
              _this.$Message.success("操作成功");
              _this.searchData(true);
            } else {
              _this.$Message.error(d.data.msg);
            }
          },
          err => {
            _this.$Message.error("请求失败，" + err + "，请稍后再试!");
          }
        );
    }
  },
  created() {
    this.searchData(true);
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
<style scoped lang="less">
.layout-table {
  padding-right: 10px;
}

.layout-search {
  width: 100%;
  margin-top: 10px;
  .label-type,
  .label-submitTime,
  .autograph,
  .usernamelabel {
    margin-left: 10px;
    margin-right: 10px;
  }
  .layout-datepicker {
    width: 180px;
    display: inline-block;
  }
  .layout-select {
    display: inline-block;
  }
}

.custom_table > table {
  margin: auto;
  &:nth-child(1) {
    padding-bottom: 15px;
  }
  td {
    word-break: break-all;
    padding: 5px;
  }
}

.custom_table > table > tr > td:nth-child(odd) {
  width: 120px;
  text-align: right;
}

.custom_table > table > tr > td:nth-child(even) {
  width: 210px;
}
</style>
