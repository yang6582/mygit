<template>
  <div>
    <div class="layout-search">
      <Form :model="searchForm" inline :label-width="100" @submit.native.prevent>
        <FormItem label="广告渠道:">
          <RadioGroup
            v-model="searchForm.adPositionType"
            type="button"
            @on-change="searchData(true)"
          >
            <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="广告名称:">
          <Input
            v-model="searchForm.adName"
            placeholder="广告名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="上线时间:">
          <Date-picker
            :value="searchForm.submitTime"
            format="yyyy-MM-dd"
            @on-change="submitTimeChange"
            type="date"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 180px"
          ></Date-picker>
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
        <!-- <template slot-scope="{row, index}" slot="createTime">
          <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
          <span v-else></span>
        </template>-->
        <template slot-scope="{row, index}" slot="updateTime">
          <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
          <span v-else></span>
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

moment.locale("zh-cn");
export default {
  name: "onlineDocumentary",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      searchForm: {
        adPositionType: 1,
        adName: "",
        // submitTime: moment(Date.now() - 1000 * 60 * 60 * 24).format(
        //   "YYYY-MM-DD"
        // )
        submitTime:''
      },
      columnsSelection: [],
      rowData: [],
      tableLoading: false,
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
      total_count: 0,
      columns: config.onlineDocumentaryColumns,
      adTypeSearch: "onlineDocumentary"
    };
  },
  created() {
    this.searchData(true);
  },
  computed: {
    selectColumns() {
      // return this.adTypeSearch === 3 ? this.middleColumns : this.columns;
      return this.columns;
    },
    shortUrlSplit(urlStr) {
      return urlStr => {
        return urlStr.split(";");
      };
    }
  },
  methods: {
    open(url) {
      window.open(url);
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
    pageChange(page) {
      this.pageIndex = page;
      this.searchData();
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    submitTimeChange(data) {
      this.searchForm.submitTime = data;
    },
    searchData(isfirst) {
      this.tableLoading = true;
      if (isfirst) {
        this.pageIndex = 1;
      }
      let postData = {
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize,
        adPositionType: this.searchForm.adPositionType,
        adName: this.searchForm.adName,
        time: this.searchForm.submitTime.split("-").join("")
      };
      axios
        .request({
          url: "/ad/management/ads/online/history",
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.rowData = res.data.data.data;
            this.total_count = res.data.data.total;
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
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>