<template>
  <div>
    <!-- <Card :bordered="false" style="margin-bottom:20px;">
      <p slot="title" style="font-size:20px;">金额汇总</p>
      <div style="position: relative;">
        <div style="position: absolute;z-index:999;left:100px;top:10px;">
          <DatePicker
            :open="open"
            :value="dateValue"
            format="yyyy-MM-dd"
            confirm
            :options="pickerOptions"
            type="daterange"
            @on-change="handleChange"
            @on-clear="handleClear"
            @on-ok="handleOk"
          >
            <a href="javascript:void(0)" @click="handleClick">
              <Icon type="ios-calendar-outline"></Icon>
            </a>
          </DatePicker>
        </div>
        <div style="position: absolute;z-index:999;left:238px;top:10px;">
          <Dropdown @on-click="clickDropdown">
            <a href="javascript:void(0)">
              <Icon type="ios-funnel" size="12"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="(item , index) in partnerNames1"
                :key="index"
                :name="item.value"
              >{{item.label}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Table border :columns="columns6" :data="costData" :loading="costDataLoading">
          <template slot-scope="{ row }" slot="vendor">
            <span>{{row.vendor}}</span>
          </template>
        </Table>
      </div>
    </Card> -->

    <Card :bordered="false">
      <p slot="title" style="font-size: 20px">
        金额明细
        <span style="font-size: 12px; color: #ccc"
          >备注：此表数据不准，仅供开发同学调试使用，其他职位同学慎用
        </span>
      </p>
      <Form
        :model="formItem"
        :label-width="80"
        :inline="true"
        style="margin-top: 20px"
      >
        <FormItem label="日期:">
          <Date-picker
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="请选择日期"
            style="width: 180px"
            v-model="formItem.yyyymm"
            :options="pickerOptions"
            @on-change="changeReportTime"
            :clearable="false"
          ></Date-picker>
        </FormItem>
        <FormItem label="客户名称:">
          <Input
            v-model="formItem.username"
            placeholder="客户名称"
            style="width: 150px"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="广告名称:">
          <Input
            v-model="formItem.adName"
            placeholder="广告名称"
            style="width: 150px"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="厂商:">
          <Select
            v-model="formItem.partnerName"
            style="width: 150px"
            @on-change="searchData(true)"
            clearable
          >
            <Option
              v-for="(item, key) in partnerNames"
              :value="item.value"
              :key="key"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="结算方式:">
          <Select
            v-model="formItem.balanceType"
            style="width: 150px"
            @on-change="searchData(true)"
            clearable
          >
            <Option
              v-for="(item, key) in balanceTypes"
              :value="item.value"
              :key="key"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem :label-width="30">
          <Button
            type="primary"
            @click="searchData(true)"
            style="margin-left: 10px"
            >查询</Button
          >
          <Button
            type="primary"
            @click="downloadReport"
            style="margin-left: 10px"
            v-if="showAccess('数据统计_CPC广告计费表_导出')"
            >导出</Button
          >
        </FormItem>
      </Form>
      <div class="layout-table">
        <!-- 自定义列 -->
        <columnsSelect
          :columns="selectColumns"
          :columnsNum="formItem.reportNum"
          @columns-change="columnsChange"
        ></columnsSelect>
        <br />
        <Table
          border
          :columns="columnsSelection"
          :data="rowData"
          :loading="listLoading"
          style="overflow-x: scroll"
        >
          <template slot-scope="{ row }" slot="menuUrlDes">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal; word-break: break-all"
              >
                {{ row.menuUrlDes }}
              </div>
              <a :href="row.menuUrlDes" target="_blank">
                <Button
                  size="small"
                  style="color: #59afed"
                  v-if="row.date != '总计'"
                  >查看</Button
                >
              </a>
            </Tooltip>
          </template>
        </Table>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px">
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
          ></Page>
        </div>
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

moment.locale("zh-cn");

export default {
  name: "adBilling2",
  components: {
    columnsSelect: () => import("@/components/columns-select"),
  },
  data() {
    return {
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      balanceTypes: [
        {
          label: "CPC",
          value: "1",
        },
        {
          label: "CPS",
          value: "2",
        },
        {
          label: "服务",
          value: "3",
        },
        {
          label: "厂商广告",
          value: "4",
        },
        {
          label: "CPT",
          value: "5",
        },
      ],
      costDataLoading: false,
      partnerChoice: "全部",
      partnerNames1: [
        {
          label: "全部",
          value: "全部",
        },
        ...config.partnerNames,
      ],
      partnerNames: config.partnerNames,
      formItem: {
        yyyymm: [
          moment().subtract(1, "days").format("YYYY-MM-DD"),
          moment().subtract(1, "days").format("YYYY-MM-DD"),
        ],
        partnerName: "",
        username: "",
        adName: "",
        pageSize: 10,
        pageIndex: 1,
        balanceType: "",
      },
      total_count: 0,
      dialogVisible: false,
      columnsSelection: [],
      columns: config.enterpriseMenuColumns, // 自定义列配置
      rowData: [],
      listLoading: false,
      columns6: [
        {
          title: "日期",
          key: "date",
          align: "center",
          width: 160,
        },
        {
          title: "厂商",
          slot: "vendor",
          align: "center",
          width: 120,
        },
        {
          title: "点击PV",
          key: "clickPVNum",
          align: "center",
        },
        {
          title: "计费点击数",
          key: "costClickNum",
          align: "center",
        },
        {
          title: "消费金额",
          key: "consumeMoney",
          align: "center",
        },
      ],
      costData: [],
      open: false,
      dateValue: [
        moment().subtract(1, "days").format("YYYY-MM-DD"),
        moment().subtract(1, "days").format("YYYY-MM-DD"),
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    };
  },
  watch: {},
  computed: {
    showAccess() {
      return (el) => {
        return hasShowAccess(el);
      };
    },
    selectColumns() {
      return this.columns;
    },
    formatDateComputed() {
      return (value) => {
        if (value) {
          let time = moment(value).format("YYYY-MM-DD HH:mm:ss").split(" ");
          return time[0] + "<br>" + time[1];
        } else {
          return "";
        }
      };
    },
  },
  filters: {
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
  },
  created() {
    this.searchData(true);
    // this.getCollectCost();
  },
  methods: {
    clickDropdown(name) {
      this.partnerChoice = name;
      this.getCollectCost();
    },
    // getCollectCost() {
    //   this.costDataLoading = true;
    //   axios
    //     .request({
    //       url:
    //         "/finance/queryCPCConsumptionStatisticTotal?startDate=" +
    //         this.dateValue[0].split("-").join("") +
    //         "&endDate=" +
    //         this.dateValue[1].split("-").join("") +
    //         "&vendor=" +
    //         (this.partnerChoice === "all" ? "" : this.partnerChoice),
    //       method: "get"
    //     })
    //     .then(d => {
    //       if (d.data.code == 0) {
    //         this.costData = d.data.data;
    //       } else {
    //         this.$Message.error(d.data.msg);
    //       }
    //       this.costDataLoading = false;
    //     })
    //     .catch(err => {
    //       this.$Message.error("网络错误" + err);
    //       this.costDataLoading = false;
    //     });
    // },
    handleClick() {
      this.open = !this.open;
    },
    handleChange(date) {
      this.dateValue = date;
    },
    handleClear() {
      this.open = false;
      this.dateValue = [
        moment().subtract(1, "days").format("YYYY-MM-DD"),
        moment().subtract(1, "days").format("YYYY-MM-DD"),
      ];
      this.getCollectCost();
    },
    handleOk() {
      this.open = false;
      this.getCollectCost();
    },

    changeReportTime(data) {
      this.formItem.yyyymm = data;
      this.searchData(true);
    },
    formatDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      return year + "-" + (month.toString().length == 1 ? "0" + month : month);
    },
    searchData(isfirst) {
      this.formItem.yyyymm = [
        moment(this.formItem.yyyymm[0]).format("YYYY-MM-DD"),
        moment(this.formItem.yyyymm[1]).format("YYYY-MM-DD"),
      ];
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let postData = {
        endDate: this.formItem.yyyymm[1].split("-").join(""),
        startDate: this.formItem.yyyymm[0].split("-").join(""),
        partnerName:
          this.formItem.partnerName === "其它"
            ? ""
            : this.formItem.partnerName === ""
            ? null
            : this.formItem.partnerName,
        num: this.formItem.pageSize,
        start: this.formItem.pageIndex,
      };
      this.formItem.username
        ? (postData.username = this.formItem.username)
        : false;
      this.formItem.adName ? (postData.adName = this.formItem.adName) : false;
      this.formItem.balanceType
        ? (postData.balanceType = this.formItem.balanceType)
        : false;
      axios
        .request({
          url: "/finance/queryCPCConsumptionStatisticTemp",
          method: "post",
          data: postData,
        })
        .then((d) => {
          if (d.data.code == 0) {
            this.rowData = d.data.data.adList;
            if (this.rowData.length) {
              let collect = {};
              collect.newuvtotalfee = d.data.data.total.newConsumeMoney;
              collect.uvbenefit = d.data.data.total.benefitMoney;
              collect.costClickCount = d.data.data.total.costClickNum;
              collect.pv = d.data.data.total.clickNum;
              collect.date = "总计";
              this.rowData.unshift(collect);
            }

            this.total_count = Number(d.data.data.adNum);
          } else {
            this.$Message.error(d.data.msg);
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$Message.error("网络错误" + err);
        });
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    downloadReport() {
      this.formItem.yyyymm = [
        moment(this.formItem.yyyymm[0]).format("YYYY-MM-DD"),
        moment(this.formItem.yyyymm[1]).format("YYYY-MM-DD"),
      ];
      let postData = {
        endDate: this.formItem.yyyymm[1].split("-").join(""),
        startDate: this.formItem.yyyymm[0].split("-").join(""),
        partnerName:
          this.formItem.partnerName === "其它"
            ? ""
            : this.formItem.partnerName === ""
            ? null
            : this.formItem.partnerName,
        num: 999999,
        start: 1,
      };
      this.formItem.username
        ? (postData.username = this.formItem.username)
        : false;
      this.formItem.adName ? (postData.adName = this.formItem.adName) : false;
      this.formItem.balanceType
        ? (postData.balanceType = this.formItem.balanceType)
        : false;
      axios
        .request({
          url: "/finance/exportCPCConsumptionStatisticTemp",
          method: "post",
          data: postData,
          responseType: "blob",
        })
        .then((res) => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "CPC广告计费表" + ".xls";
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
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageIndex = 1;
      this.formItem.pageSize = val;
      this.searchData();
    },
  },
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

