<template>
  <div>
    <Form :model="formItem" :label-width="40" :inline="true">
      <FormItem label="日期:">
        <Date-picker
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="请选择日期"
          v-model="formItem.yyyymm"
          style="width:200px;"
          @on-change="dateTimeChange"
          :options="pickerOptions"
        ></Date-picker>
      </FormItem>
      <FormItem label="厂商:">
        <Select v-model="formItem.partnerId" style="width:180px" @on-change="searchData(true)">
          <Option :value="0">全部</Option>
          <Option v-for="(item,key) in partnerNames" :value="item.index" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="searchData(true)">查询</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="exportData"
          v-if="showAccess('数据统计_CPD计费表_导出')"
        >导出</Button>
      </FormItem>
    </Form>
    <Card style="width:100%;margin-bottom:20px;">
      <div class="echart">
        <Echart :loading="echartLoading" :options="echartsOption"></Echart>
      </div>
    </Card>
    <div>
      <Table
        border
        :columns="columns"
        :data="showRowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
        :span-method="handleSpan"
      >
        <template slot-scope="{ row, index}" slot="index">
          <span>{{index === 0 ? '总计': index}}</span>
        </template>
        <template slot-scope="{ row }" slot="firm">
          <span>{{row.firm === '' ? '' : (row.firm === 5 ? 'VIVO' : 'OPPO')}}</span>
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
// import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "./options/columns";
import Echart from "@/components/Echart";
import { echartsOption } from "./options/echartsOption";
moment.locale("zh-cn");
export default {
  name: "CpdBilling",
  components: {
    Echart
  },
  data() {
    return {
      rowData: [],
      listLoading: false,
      total_count: 0,
      columns: config.columns,
      echartLoading: false,
      echartsOption: {},
      showRowData: [],
      totalData: [],
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
        }
      ],
      formItem: {
        yyyymm: [
          moment()
            .subtract(7, "days")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD")
        ],
        partnerId: 0,
        pageIndex: 1,
        pageSize: 10
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1000 * 60 * 60 * 24;
        }
      }
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
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
    exportData() {
      axios
        .request({
          url: "/ad/data/statistics/cpd/export/total",
          method: "post",
          data: {
            start_date: this.formItem.yyyymm[0].split("-").join(""),
            end_date: this.formItem.yyyymm[1].split("-").join(""),
            firm: this.formItem.partnerId
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) {
            return;
          }
          var elink = document.createElement("a");
          elink.download =
            "CPD计费表" +
            this.formItem.yyyymm[0].split("-").join("") +
            "-" +
            this.formItem.yyyymm[1].split("-").join("") +
            ".xlsx";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("导出失败" + err);
        });
    },
    dateTimeChange(date) {
      this.formItem.yyyymm = date;
      this.searchData(true);
    },
    searchData(isfirst) {
      this.formItem.yyyymm = [
        moment(this.formItem.yyyymm[0]).format("YYYY-MM-DD"),
        moment(this.formItem.yyyymm[1]).format("YYYY-MM-DD")
      ];
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let postData = {
        start_date: this.formItem.yyyymm[0].split("-").join(""),
        end_date: this.formItem.yyyymm[1].split("-").join(""),
        firm: this.formItem.partnerId
        // pageSize: this.formItem.pageSize,
        // pageNumber: this.formItem.pageIndex
      };
      axios
        .request({
          url: "/ad/data/statistics/cpd/total",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowData = d.data.data.message;
            let rowDataReverse = JSON.parse(JSON.stringify(this.rowData));
            this.echartsDataFormat(
              rowDataReverse.reverse(),
              this.formItem.partnerId
            );
             this.rowData.forEach((item)=>{
              item.total_cost = this.formatNumber(item.total_cost)
              item.download_num = this.formatNumber(item.download_num)

            })
            this.total_count = this.rowData.length;
            this.showRowData = this.rowData.slice(
              (this.formItem.pageIndex - 1) * this.formItem.pageSize,
              this.formItem.pageIndex * this.formItem.pageSize
            );
            this.totalData = d.data.data.total
            this.fillTotalData()
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    fillTotalData() {
      // 表格第一行展示所有数据的总计，不是当前页的总计
      this.showRowData.unshift({
        'index': '总计',
        'total_cost': this.formatNumber(this.totalData.totalCost),
        'total_apps': this.formatNumber(this.totalData.totalApps),
        'download_num': this.formatNumber(this.totalData.downloadNum), 
        'price': '',
        'firm': '',
        _highlight: true
      })
    },
    formatNumber(num){
       var decimalPart = '';
  num = num.toString();
  if (num.indexOf('.') != -1) {
    decimalPart = '.' + num.split('.')[1];
    num = parseInt(num.split('.')[0]);
  }
  var array = num.toString().split('');
  var index = -3;
  while (array.length + index > 0) {
    array.splice(index, 0, ',');
    index -= 4;
  }
  return array.join('') + decimalPart;

    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      // if (rowIndex === 0 && columnIndex === 0) {
      //     return [1, 2];
      // }
    },
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.showRowData = this.rowData.slice(
        (this.formItem.pageIndex - 1) * this.formItem.pageSize,
        this.formItem.pageIndex * this.formItem.pageSize
      );
      this.fillTotalData()
    },
    pageSizeChange(val) {
      if (val) {
        this.formItem.pageIndex = 1;
        this.formItem.pageSize = val;
        this.showRowData = this.rowData.slice(
          (this.formItem.pageIndex - 1) * this.formItem.pageSize,
          this.formItem.pageIndex * this.formItem.pageSize
        );
        this.fillTotalData()
      }
    },
    echartsDataFormat(data, firm) {
      let oppoData = data.filter(item => {
        return item.firm === 1;
      });
      let vivoData = data.filter(item => {
        return item.firm === 5;
      });
      let echarts = JSON.parse(JSON.stringify(echartsOption));

      if (firm === 0) {
        let date = oppoData.map(item => {
          return item.date;
        });
        let oppoCost = oppoData.map(item => {
          return item.total_cost;
        });
        let oppoDownload = oppoData.map(item => {
          return item.download_num;
        });
        let vivoCost = vivoData.map(item => {
          return item.total_cost;
        });
        let vivoDownload = vivoData.map(item => {
          return item.download_num;
        });
        echarts.xAxis.data = date;
        echarts.series[0].data = oppoCost;
        echarts.series[1].data = oppoDownload;
        echarts.series[2].data = vivoCost;
        echarts.series[3].data = vivoDownload;
        this.echartsOption = echarts;
      } else if (firm === 5) {
        let date = vivoData.map(item => {
          return item.date;
        });
        let vivoCost = vivoData.map(item => {
          return item.total_cost;
        });
        let vivoDownload = vivoData.map(item => {
          return item.download_num;
        });
        echarts.xAxis.data = date;
        echarts.series[2].data = vivoCost;
        echarts.series[3].data = vivoDownload;
        echarts.series.splice(0, 2);
        echarts.legend.data.splice(0, 2);
        this.echartsOption = echarts;
      } else if (firm === 1) {
        let date = oppoData.map(item => {
          return item.date;
        });
        let oppoCost = oppoData.map(item => {
          return item.total_cost;
        });
        let oppoDownload = oppoData.map(item => {
          return item.download_num;
        });
        echarts.xAxis.data = date;
        echarts.series[0].data = oppoCost;
        echarts.series[1].data = oppoDownload;
        echarts.series.splice(2, 2);
        echarts.legend.data.splice(2, 2);
        this.echartsOption = echarts;
      }
    }
  }
};
</script>
<style scoped lang="less">
.echart {
  width: 100%;
  height: 300px;
}
</style>

