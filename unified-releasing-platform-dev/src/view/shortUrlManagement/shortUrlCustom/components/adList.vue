<template>
  <div>
    <div class="layout-search">
      <Form :model="searchForm" inline :label-width="80">
        <FormItem label="广告渠道:">
          <RadioGroup
            v-model="searchForm.adPositionType"
            type="button"
            @on-change="searchData(true)"
          >
            <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
          </RadioGroup>
        </FormItem>
        <br />
        <FormItem label="广告名称:">
          <Input
            style="width:140px"
            v-model="searchForm.adName"
            placeholder="广告名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="客户名称:">
          <Input
            v-model="searchForm.customerName"
            placeholder="客户名称"
            @on-enter="searchData(true)"
            style="width:140px"
            clearable
          />
        </FormItem>
        <FormItem label="计划名称:">
          <Input
            v-model="searchForm.planName"
            placeholder="计划名称"
            style="width:140px"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="厂商:">
          <Select v-model="searchForm.partnerId" style="width:140px" @on-change="searchData(true)">
            <Option :value="-1">全部</Option>
            <Option
              v-for="(item,key) in partnerNames"
              :value="item.index"
              :key="key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="状态:">
          <Select
            v-model="searchForm.approvalStatus"
            style="width:180px"
            @on-change="searchData(true)"
          >
            <Option :value="-1">全部</Option>
            <Option :value="2">已上线</Option>
            <Option :value="98">已下线</Option>
            <Option :value="99">已删除</Option>
          </Select>
        </FormItem>-->
        <!-- <FormItem label="oppo状态:">
          <Select
            v-model="searchForm.oppoApprovalStatus"
            style="width:180px"
            @on-change="searchData(true)"
          >
            <Option :value="-99">全部</Option>
            <Option :value="-1">待推送</Option>
            <Option :value="0">审核拒绝</Option>
            <Option :value="1">审核通过</Option>
            <Option :value="90">待审核</Option>
            <Option :value="91">同步失败</Option>
          </Select>
        </FormItem>-->
        <!-- <FormItem label="提交时间:">
          <Date-picker
            :value="searchForm.submitTime"
            format="yyyy-MM-dd"
            @on-change="submitTimeChange"
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 180px"
          ></Date-picker>
        </FormItem>-->

        <FormItem :label-width="50">
          <Button
            type="primary"
            @click="searchData(true)"
            icon="ios-search"
            style="margin-left:10px"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table border :columns="columns" :data="rowData" :loading="tableLoading">
      <template slot-scope="{row, index}" slot="adShortUrl">
        <template>
          <Tooltip
            transfer
            placement="top"
            v-for="(item,sindex) in shortUrlSplit(row.adShortUrl)"
            style="margin:5px 0 ;"
            :key="sindex"
          >
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{item}}</div>
            <Button
              size="small"
              style="color:#59afed"
              @click="copyShortUrl(item)"
              v-if="row.adShortUrl"
            >复制</Button>
          </Tooltip>
        </template>
      </template>
      <template slot-scope="{row, index}" slot="adUrl">
        <Tooltip placement="top" transfer>
          <div
            slot="content"
            style="width: 220px; white-space: normal;word-break: break-all;"
          >{{row.adUrl}}</div>
          <Button size="small" style="color:#59afed" @click="open(row.adUrl)" v-if="row.adUrl">查看</Button>
        </Tooltip>
      </template>
      <template slot-scope="{row, index}" slot="positionNames">
        <span>{{row.adPositionTypeName}}</span>
      </template>
      <template slot-scope="{row, index}" slot="adChargedType">
        <span>{{row.adChargedTypeName}}</span>
      </template>
      <template slot-scope="{row, index}" slot="createTime">
        <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
        <span v-else></span>
      </template>
      <template slot-scope="{row, index}" slot="updateTime">
        <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
        <span v-else></span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div style="padding:10px 0;display:flex;">
          <Button type="primary" size="small" @click="relevanceClick(row)">关联广告</Button>
        </div>
      </template>
    </Table>
    <div style="overflow:hidden;">
      <Page
        :total="total_count"
        size="small"
        :current="pageIndex"
        @on-change="pageChange"
        :page-size="pageSize"
        show-total
        show-elevator
        style="float:right;margin-top:10px;"
      ></Page>
    </div>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";
// console.log(config.menuColumns,'config.menuColumns')
moment.locale("zh-cn");
export default {
  name: "adList",
  components: {},
  props: ["id"],
  data() {
    return {
      axisoUrl:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      uploadHeaders: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      columns: config.menuColumns,
      mapId: null,
      searchForm: {
        adName: "",
        planName: "",
        submitTime: [],
        adPositionType: 1,
        customerName: "",
        adShortUrl: "",
        adUrl: "",
        approvalStatus: -1,
        partnerId: -1,
        oppoApprovalStatus: -99
      },
      oppoApprovalStatus: [],
      operatorId: 0,
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
      tableLoading: false,
      total_count: 0,
      pageIndex: 1,
      pageSize: 10,
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
      rowData: []
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    shortUrlSplit(urlStr) {
      return urlStr => {
        return urlStr.split(";");
      };
    }
  },
  methods: {
    relevanceClick(row) {
      axios
        .request({
          url: "/ad/shorturl/setad",
          method: "post",
          data: {
            id: this.id,
            adId: row.adId,
            adName: row.adName,
            adUrl:row.adUrl
          }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("关联成功!");
            this.$emit("closeAdModal");
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("请求失败!");
        });
    },
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
      this.tableLoading = true;
      this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.pageIndex = 1;
      }
      this.toOppoSelection = "";
      this.current_ad_type = this.searchForm.adPositionType;
      var postData = {
        planName: this.searchForm.planName,
        adName: this.searchForm.adName,
        adPositionType: this.searchForm.adPositionType,
        oppoApprovalStatus: this.searchForm.oppoApprovalStatus,
        customerName: this.searchForm.customerName,
        createTimeBegin:
          typeof this.searchForm.submitTime[0] === "object"
            ? datefmt(this.searchForm.submitTime[0], "00:00:00")
            : this.searchForm.submitTime[0],
        createTimeEnd:
          typeof this.searchForm.submitTime[1] === "object"
            ? datefmt(this.searchForm.submitTime[1], "23:59:59")
            : this.searchForm.submitTime[1],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        adShortUrl: this.searchForm.adShortUrl,
        adUrl: this.searchForm.adUrl,
        // approvalStatus: this.searchForm.approvalStatus,
        approvalStatus: 2,
        partnerId: this.searchForm.partnerId
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
            _this.rowData = dataArr;
            _this.total_count = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.$Message.error("请求失败!");
          this.tableLoading = false;
        });
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
    uploadData() {
      this.rowData = [];
      this.searchForm = {
        adName: "",
        planName: "",
        submitTime: [],
        adPositionType: 1,
        customerName: "",
        adShortUrl: "",
        adUrl: "",
        approvalStatus: -1,
        partnerId: -1,
        oppoApprovalStatus: -99
      };
      this.searchData(true);
    }
  },
  created() {
    // this.getBasicInfo();
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
.mask-wrap:hover .mask {
  display: block;
}
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  overflow: hidden;
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
.showEditAd2 /deep/ .ivu-form-item-error-tip {
  white-space: nowrap;
}
</style>
