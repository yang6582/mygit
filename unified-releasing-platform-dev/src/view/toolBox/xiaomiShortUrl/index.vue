<template>
  <div>
    <Form :model="formItem" :label-width="100" :inline="true" style="margin-top: 20px">
      <FormItem label="广告渠道:">
          <RadioGroup
            v-model="formItem.adPositionType"
            type="button"
            @on-change="searchData(true)"
          >
            <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
          </RadioGroup>
        </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customerName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="计划名称:">
        <Input
          v-model="formItem.planName"
          placeholder="计划名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="广告名称:">
        <Input
          v-model="formItem.adName"
          placeholder="广告名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="日期:">
        <Date-picker 
            :value="formItem.time"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 180px"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="downloadReport" style="margin-left: 10px" v-if="showAccess('工具箱_小米加密短链表_导出')">导出</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <Table
        border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
      >
        <template slot-scope="{ row, index }" slot="createTime">
          <span>{{row.createTime | formatDateShort}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="adShortUrl">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.adShortUrl}}</div>
            <div class="textOverFlow" v-if="row.adShortUrl"
            >{{row.adShortUrl}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row, index }" slot="miShortUrl">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.miShortUrl}}</div>
            <div class="textOverFlow" v-if="row.miShortUrl"
            >{{row.miShortUrl}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row, index }" slot="adUrl">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.adUrl}}</div>
            <div class="textOverFlow" v-if="row.adUrl"
            >{{row.adUrl}}</div>
          </Tooltip>
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
  name: "xiaomiShortUrl",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
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
      formItem: {
        adPositionType: 1,
        customerName: "",
        planName: '',
        adName: "",
        pageSize: 10,
        pageIndex: 1,
        time: [moment().subtract(6, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.tableColumns, // 自定义列配置
      rowData: [],
      listLoading: false
    };
  },
  computed: {
    showAccess() {
        return el => {
            return hasShowAccess(el);
        };
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
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    }
  },
  created() {
    this.searchData(true)
  },
  methods: {
    parseNumber(str) {
        return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
    changeReportTime (data) {
      this.formItem.time = data
      this.searchData(true)
    },
    formatDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      return year + "-" + (month.toString().length == 1 ? "0" + month : month);
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let _this = this;
      let postData = {
          ...this.formItem, 
          createTimeBegin: this.formItem.time.length ? this.formItem.time[0] : '',
          createTimeEnd: this.formItem.time.length ? this.formItem.time[1] : ''
      }
      delete postData.time
      axios
        .request({
          url: "/toolCase/miShortUrl/list",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.rowData = d.data.data.data
            _this.total_count = d.data.data.total
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    downloadReport() {
      let _this = this
      axios
        .request({
          url: "/toolCase/miShortUrl/export",
          method: "post",
          data: _this.formItem,
          responseType: 'blob'
        }).then(res => {
          debugger
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "小米加密短链报表导出.xls";
              if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
            // } else {
              // let _this = this;
            //   let errorMessage = new Blob([res.data]);
            //   let errorFileReader = new FileReader();
            //   errorFileReader.readAsText(errorMessage, "utf-8");
            //   errorFileReader.onload = function() {
            //     _this.$Message.error(JSON.parse(errorFileReader.result).message);
            //   };
            // }
          } else {
            this.$Message.error("导出失败,请刷新重试")
          }
        })
        .catch(() => {
          this.$Message.error("导出失败")
        });
    },
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageIndex = 1;
      this.formItem.pageSize = val;
      this.searchData();
    }
  }
};
</script>
<style scoped lang="less">
.textOverFlow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ivu-btn-primary .margin-15 {
  margin: 0 10px;
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

