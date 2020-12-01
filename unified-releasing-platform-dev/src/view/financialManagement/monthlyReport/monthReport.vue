<template>
  <div>
    <Form :model="formItem" :label-width="100" :inline="true" style="margin-top: 20px">
      <FormItem label="月报时间:">
        <Date-picker 
            type="month" 
            placeholder="选择月"
            v-model="formItem.yyyymm"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customerName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="公司名称:">
        <Input
          v-model="formItem.enterpriseName"
          placeholder="公司名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="downloadReport" style="margin-left: 10px" v-if="showAccess('财务管理_月度客户报表_包月月度客户报表导出')">导出</Button>
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
        <template slot-scope="{ row, index }" slot="initTotalLeftFee">
          <span v-html="parseNumber(row.initTotalLeftFee)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="rechargeTotalFee">
          <span v-html="parseNumber(row.rechargeTotalFee)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="consumeTotalFee">
          <span v-html="parseNumber(row.consumeTotalFee)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="endTotalLeftFee">
          <span v-html="parseNumber(row.endTotalLeftFee)"></span>
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
  name: "monthReport",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      formItem: {
        yyyymm: this.getLastMonth(),
        // submitTime: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()],
        customerName: "",
        enterpriseName: "",
        pageSize: 10,
        pageIndex: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.monthColumns, // 自定义列配置
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
      this.searchData(true)
    },
    getLastMonth(d) { //获取上个月日期
      let date = d ? d : new Date; 
      let year = date.getFullYear();
      let month = date.getMonth();
      if(month == 0){
           year = year -1;
           month = 12; 
      }
      return year + "-" + (month.toString().length == 1 ? "0" + month : month);
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
      let yyyymm = typeof(this.formItem.yyyymm) == "string" ? this.formItem.yyyymm.split("-").join("") 
        :  this.formatDate(this.formItem.yyyymm).split("-").join("")
      let postData = {
        yyyymm: yyyymm,
        customerUsername: this.formItem.customerName,
        companyName: this.formItem.enterpriseName,
        pageSize: this.formItem.pageSize,
        pageNumber: this.formItem.pageIndex
      };
      let _this = this;
      axios
        .request({
          url: "finance/customerMonthlyCptMonth",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.rowData = d.data.data.info
            _this.total_count = d.data.data.page.totalSize
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    downloadReport() {
      let _this = this
      let yyyymm = typeof(this.formItem.yyyymm) == "string" ? this.formItem.yyyymm.split("-").join("") 
        :  this.formatDate(this.formItem.yyyymm).split("-").join("")
      let postData = {
        yyyymm: yyyymm,
        customerUsername: this.formItem.customerName,
        companyName: this.formItem.enterpriseName
      };
      axios
        .request({
          url: "finance/customerMonthlyCptMonth/export",
          method: "post",
          data: postData,
          responseType: 'blob'
        }).then(res => {
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "包月月度客户报表导出-" + yyyymm + ".xls";
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

