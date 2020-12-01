<template>
  <div>
    <Card :bordered="false" style="margin-bottom:20px;">
    <p slot="title" style="font-size:20px;">CPC月度汇总</p>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
        <FormItem label="客户名称:">
          <Input
            v-model="formItem.customName"
            placeholder="客户名称"
            @on-enter="searchAllData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="月份:">
          <el-date-picker
            style="width:380px"
            v-model="formItem.yyyymm"
            size="small"
            type="monthrange"
            format="yyyy-MM"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            @change="changeReportTime">
          </el-date-picker>
        </FormItem>
        <FormItem :label-width="30">
          <Button type="primary" @click="searchAllData(true)" style="margin-left:10px">查询</Button>
          <Button
            type="primary"
            @click="downloadReport"
            style="margin-left: 10px"
            v-if="showAccess('对账管理_CPC月度报表_导出')"
          >导出</Button>
        </FormItem>
      </Form>
      <div style="position: relative;">
        <Table border :columns="columns6" :data="rowDataTotal" :loading="listLoadingTotal">
          <template slot-scope="{ row }" slot="vendor">
            <span>{{row.vendor}}</span>
          </template>
          <template slot-scope="{ row }" slot="costTotal">
            <span>{{row.costTotal | parseNumber}}</span>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;margin-top:10px;">
          <Page
            :total="total_count_Total"
            size="small"
            :current="formItem.pageIndexTotal"
            @on-change="(val)=>{pageChange(val, 'Total')}"
            :page-size="formItem.pageSizeTotal"
            @on-page-size-change="(val) => {pageSizeChange(val, 'Total')}"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
    </Card>

    <Card :bordered="false">
      <p slot="title" style="font-size:20px;">CPC月度明细</p>
      <div class="layout-table">
        <Table
          border
          :columns="columns"
          :data="rowDataDetail"
          :loading="listLoadingDetail"
          style="overflow-x:scroll;"
        >
          <template slot-scope="{ row }" slot="fullUrl">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{row.fullUrl}}</div>
              <a :href="row.fullUrl" target="_blank">
                <Button size="small" style="color:#59afed">查看</Button>
              </a>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="costTotal">
            <span>{{row.costTotal | parseNumber}}</span>
          </template>
          <template slot-scope="{ row }" slot="costClickCount">
            <span>{{row.costClickCount | parseNumber}}</span>
          </template>
          <template slot-scope="{ row }" slot="price">
            <span>{{row.price | parseNumber}}</span>
          </template>
        </Table>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:10px;">
        <Page
          :total="total_count_Detail"
          size="small"
          :current="formItem.pageIndexDetail"
          @on-change="(val)=>{pageChange(val, 'Detail')}"
          :page-size="formItem.pageSizeDetail"
          @on-page-size-change="(val) => {pageSizeChange(val, 'Detail')}"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
    </Card>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
// import DatePickers from "../../../components/date-pickers"

moment.locale("zh-cn");

export default {
  name: "cpcMonthList",
  components: {
    // DatePickers,
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      optionss: [],
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      listLoadingTotal: false,
      formItem: {
        yyyymm: [ moment()
            .subtract(1, "months")
            .format("YYYY-MM"),  moment().format("YYYY-MM"),],
        customName: "",
        pageSizeTotal: 10,
        pageIndexTotal: 1,
        pageSizeDetail: 10,
        pageIndexDetail: 1
      },
      total_count_Total: 0,
      total_count_Detail: 0,
      dialogVisible: false,
      columns: config.enterpriseMenuColumns, // 自定义列配置
      rowDataTotal: [],
      rowDataDetail: [],
      listLoadingTotal: false,
      listLoadingDetail: false,
      columns6: config.cpcMonthFields,
    };
  },
  watch: {},
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  filters: {
    parseNumber(str) {
        return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
  },
  created() {
    this.searchAllData(true)
  },
  methods: {
    changeReportTime(data) {
      this.formItem.yyyymm = data;
      this.searchAllData(true);
    },
    formatDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      return year + "-" + (month.toString().length == 1 ? "0" + month : month);
    },
    searchAllData(isfirst) {
      this.searchTotalData(isfirst, 'Total');
      this.searchDetailData(isfirst, 'Detail');
    },
    searchTotalData(isfirst) {
      this.searchData(isfirst, 'Total')
    },
    searchDetailData(isfirst) {
      this.searchData(isfirst, 'Detail')
    },
    searchData(isfirst, type) {
      this['listLoading' + type] = true;
      if (isfirst) {
        this.formItem['pageIndex' + type] = 1;
      }
      let postData = {
        date1: moment(this.formItem.yyyymm[1]).format("YYYYMM"),
        date0: moment(this.formItem.yyyymm[0]).format("YYYYMM"),
        customName: this.formItem.customName,
        pageSize: this.formItem['pageSize' + type],
        pageIndex: this.formItem['pageIndex' + type] -1
      };
      let _this = this
      axios
        .request({
          url: type == 'Total' ? "/finance/queryCpcMonthlyStatisticTotal" : "/finance/queryCpcMonthlyStatistic",
          method: "post", 
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this['rowData' + type] = d.data.data.data;
            _this['total_count_' + type] = Number(d.data.data.total);
          } else {
            _this.$Message.error(d.data.msg);
          }
          _this['listLoading' + type] = false;
        })
        .catch(err => {
          _this['listLoading' + type] = false;
          _this.$Message.error("网络错误" + err);
        });
    },
    downloadReport() {
      let postData = {
        date1: moment(this.formItem.yyyymm[1]).format("YYYYMM"),
        date0: moment(this.formItem.yyyymm[0]).format("YYYYMM"),
        customName: this.formItem.customName,
      };
      axios
        .request({
          url: "/finance/exportCpcMonthlyStatistic",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "CPC月度报表" + ".xls";
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
            this.$Message.error("导出失败,请刷新重试");
          }
        })
        .catch(() => {
          this.$Message.error("导出失败");
        });
    },
    pageChange(val, type) {
      this.formItem['pageIndex' + type] = val;
      type == 'Total' ? this.searchTotalData() : this.searchDetailData()
    },
    pageSizeChange(val, type) {
      this.formItem['pageIndex' + type] = 1;
      this.formItem['pageSize' + type] = val;
      type == 'Total' ? this.searchTotalData() : this.searchDetailData()
    }
  }
};
</script>
<style scoped lang="less">
@import 'https://unpkg.com/element-ui@2.3.7/lib/theme-chalk/index.css';
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

