<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
      <FormItem label="月份:">
        <Date-picker
          type="month"
          format="yyyy-MM"
          placeholder="请选择月份"
          v-model="formItem.yyyymm"
          @on-change="searchData(true)"
        ></Date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customName"
          placeholder="客户名称"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="商户名称:">
        <Input
          v-model="formItem.shopName"
          placeholder="商户名称"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="searchData(true)">查询</Button>
        <Button type="primary" style="margin-left: 10px" @click="exportData" v-if="showAccess('数据统计_包月计费表_月度计费明细表_导出')">导出</Button>
      </FormItem>
    </Form>
    <div>
      <Table
        border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
      >
        <!-- <template slot-scope="{ row, index }" slot="reportTime">
          <span v-html="formatDateComputed(row.createTime)"></span>
        </template>-->
      </Table>
      <Page
        :total="totalCount"
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
// import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "../options/columns";
moment.locale("zh-cn");
export default {
  name: "monthDetailForm",
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rowData: [],
      listLoading: false,
      totalCount: 0,
      columns: config.monthDetailColumns,
      formItem: {
        yyyymm: "",
        customName: "",
        shopName: "",
        pageIndex: 1,
        pageSize: 10
      }
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
  mounted() {
    this.searchData(true);
  },
  methods: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM");
      } else {
        return "";
      }
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let yyyymm =
        typeof this.formItem.yyyymm == "string"
          ? this.formItem.yyyymm.split("-").join("")
          : this.formatDate(this.formItem.yyyymm)
              .split("-")
              .join("");
      let postData = {
        reportTime: yyyymm,
        customName: this.formItem.customName,
        shopName: this.formItem.shopName,
        pageSize: this.formItem.pageSize,
        pageIndex: this.formItem.pageIndex - 1
      };
      axios
        .request({
          url: "/adMonthly/monthConsumeList",
          method: "post",
          data: postData
        })
        .then(d => {
          console.log(d);
          if (d.data.code == 0) {
            this.rowData = d.data.data.data;
            console.log(this.rowData);
            this.totalCount = d.data.data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
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
    exportData() {
      let yyyymm =
        typeof this.formItem.yyyymm == "string"
          ? this.formItem.yyyymm.split("-").join("")
          : this.formatDate(this.formItem.yyyymm)
              .split("-")
              .join("");
      let postData = {
        onlineTime: yyyymm,
        customName: this.formItem.customName,
        shopName: this.formItem.shopName
      };
      axios
        .request({
          url: "/adMonthly/monthConsumeList/export",
          method: "post",
          responseType: "blob",
          data: postData
        })
        .then(res => {
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download = "月度计费明细表" + yyyymm + ".xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    }
  }
};
</script>
<style scoped lang="less">
</style>

