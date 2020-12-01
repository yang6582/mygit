<template>
  <div>
    <div class="layout-search">
      <Form :model="searchForm" ref="searchFormValidate" :rules="validateSearchForm" inline :label-width="100" style="margin-top:20px;">
        <FormItem label="厂商:">
          <Select v-model="searchForm.partnerId" style="width:140px" @on-change="searchData(true)">
            <Option
              v-for="(item,key) in partnerNames"
              :value="item.index"
              :key="key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商户名称:">
          <Input
            v-model="searchForm.shopName"
            placeholder="商户名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="创建时间:">
          <Date-picker
            :value="searchForm.createdTime"
            format="yyyy-MM-dd"
            @on-change="submitTimeChange"
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 180px"
          ></Date-picker>
        </FormItem>
        <FormItem label="包名:" prop="packageName">
          <Input
            v-model="searchForm.packageName"
            placeholder="包名"
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
          <!-- <Button type="primary" @click="reset" style="margin-left:10px">重置</Button> -->
        </FormItem>
      </Form>
    </div>
    <div class="layout-table">
      <!-- 自定义列 -->
      <columnsSelect
        :columns="selectColumns"
        :columnsNum="adTypeSearch"
        @columns-change="columnsChange"
      ></columnsSelect>
      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        :loading="tableLoading"
        style="min-width:1100px;overflow-x:scroll;margin-top: 20px;"
      >
        <template slot-scope="{row, index}" slot="company_id">
          <span>{{companyFormat(row.company_id)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="html_link">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.html_link}}</div>
            <Button
              size="small"
              style="color:#59afed"
              @click="open(row.html_link)"
              v-if="row.html_link"
            >查看</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="deep_link">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.deep_link}}</div>
            <Button
              size="small"
              style="color:#59afed"
              @click="copyShortUrl(row.deep_link)"
              v-if="row.deep_link"
            >复制</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="monitor_link_show">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.monitor_link_show}}</div>
            <Button
              size="small"
              style="color:#59afed"
              @click="copyShortUrl(row.monitor_link_show)"
              v-if="row.monitor_link_show"
            >复制</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="monitor_link_click">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.monitor_link_click}}</div>
            <Button
              size="small"
              style="color:#59afed"
              @click="copyShortUrl(row.monitor_link_click)"
              v-if="row.monitor_link_click"
            >复制</Button>
          </Tooltip>
        </template>
        <!-- <template slot-scope="{row, index}" slot="createTime">
          <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
          <span v-else></span>
        </template>
        <template slot-scope="{row, index}" slot="updateTime">
          <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
          <span v-else></span>
        </template>-->
        <template slot-scope="{row, index}" slot="action">
          <Poptip confirm title="确认删除当前商户?" width="200" class="poptipClass" @on-ok="delOk(row)" transfer>
            <Button type="error" size="small" v-if="showAccess('队列管理_历史关系表_删除')">删除</Button>
          </Poptip>
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
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");
export default {
  name: "historyRelation",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validatePackageName = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('包名不能输入汉字!'));
        } else {
          callback();
        }
      }
      callback();
    }
    return {
      searchForm: {
        partnerId: 5,
        shopName: "",
        createdTime: "",
        packageName: ''
      },
      columnsSelection: [],
      rowData: [],
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total_count: 0,
      columns: config.columns,
      adTypeSearch: "historyRelation",
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
      validateSearchForm: {
        packageName: [{ validator: validatePackageName, trigger: "change" }],
      }
    };
  },
  computed: {
    selectColumns() {
      return this.columns;
    },
    companyFormat() {
      return id => {
        for (let i = 0; i < this.partnerNames.length; i++) {
          if (this.partnerNames[i].key == id) {
            return this.partnerNames[i].value;
          }
        }
      };
    },
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  created() {
    this.searchData(true);
  },
  methods: {
    delOk(row) {
      axios
        .request({
          url: "/cpd/menus/relation/delete" ,
          method: "post",
          data:{
            id:row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success("删除成功!");
            this.searchData();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    },
    pageChange(page) {
      this.pageIndex = page;
      this.searchData();
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    submitTimeChange(data) {
      this.searchForm.createdTime = data;
      //console.log(data, "datachange ");
    },
    searchData(isfirst) {
      this.$refs["searchFormValidate"].validate(valid => {
        if (valid) {
          this.tableLoading = true;
          if (isfirst) {
            this.pageIndex = 1;
          }
          let postData = {
            pageIndex: this.pageIndex - 1,
            pageSize: this.pageSize,
            partnerId: this.searchForm.partnerId,
            shopName: this.searchForm.shopName.trim(),
            startTime: this.searchForm.createdTime[0] || "",
            endTime: this.searchForm.createdTime[1] || "",
            packageName: this.searchForm.packageName
          };
          axios
          .request({
            url: "/cpd/menus/relation/history/query",
            method: "post",
            data: postData
          })
          .then(res => {
            if (res.data.code == 0) {
              this.rowData = res.data.data.list_info;
              this.total_count = res.data.data.total_count;
            } else {
              this.$Message.error(res.data.msg);
            }
            this.tableLoading = false;
          })
          .catch(err => {
            this.$Message.error("网络错误");
            this.tableLoading = false;
          });
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.poptipClass /deep/ .ivu-icon {
  left: 40px;
}
/deep/.ivu-input {
  font-size: 12px !important;
}
</style>