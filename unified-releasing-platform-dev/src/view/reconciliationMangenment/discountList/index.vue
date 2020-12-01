<template>
  <div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="月份 :" >
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
      <FormItem label="客户名称 :">
        <Input v-model.trim="formItem.customName" placeholder="客户名称" style="width: 200px" clearable @on-enter='searchData(true)'>
        </Input>
      </FormItem>
      <FormItem label="公司名称 :">
        <Input v-model.trim="formItem.companyName" placeholder="公司名称" style="width: 200px" clearable @on-enter='searchData(true)'>
        </Input>
      </FormItem>
      <FormItem label="推广链接 :">
        <Input v-model.trim="formItem.fullUrl" placeholder="推广链接" style="width: 200px" clearable @on-enter='searchData(true)'>
        </Input>
      </FormItem>
      <!-- <FormItem label="销售员:">
        <Select
          v-model="formItem.salesId"
          style="width:200px"
          @on-change="searchData(true)"
          filterable
          clearable
        >
          <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem> -->
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="dataExport" v-if="showAccess('对账管理_核减记录_导出')">导出</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">
      <template slot-scope="{ row }" slot="costTotal">
        <span>{{numberFormat(row.costTotal)}}</span>
      </template>
      <template slot-scope="{ row }" slot="benefitTotal">
        <span>{{numberFormat(row.benefitTotal)}}</span>
      </template>
      <template slot-scope="{ row }" slot="realTotal">
        <span>{{numberFormat(row.realTotal)}}</span>
      </template>
      <template slot-scope="{ row }" slot="fullUrl">
        <Tooltip placement="top" transfer>
          <div 
            slot="content" 
            style="width: 220px; white-space: normal;word-break: break-all;"
          >{{row.fullUrl}}</div>
          <div class="textOverFlow" v-if="row.fullUrl"
          >{{row.fullUrl}}</div>
        </Tooltip>
      </template>
      <template slot-scope="{ row }" slot="optTime">
        <span>{{formatDate(row.optTime)}}</span>
      </template>
      <template slot-scope="{ row }" slot="overdueDay">
        <span>{{row.overdueDay + '天'}}</span>
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
</template>
<script>
  import axios from "@/libs/api.request";
  import config from "./config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";
  import numberFormat from '@/utils/numberFormat'

  export default {
    name: "discountList",
    data(){
      const dateNow = new Date()
      return {
        formItem: {
            // yyyymm: [ moment()
            // .subtract(2, "months")
            // .format("YYYY-MM"),  moment().subtract(1, "months").format("YYYY-MM"),],
          yyyymm: ['2020-01', moment().subtract(1, "months").format("YYYY-MM")],
          pageSize: 10,
          pageIndex: 1,
          customName: '',
          companyName: '',
          fullUrl: '',
          salesId: ''
        },
        columns: config.tableFields,
        rowData: [],
        listLoading: false,
        total_count: 0,
        marketList: [],
      }
    },
    computed: {
      showAccess() {
          return el => {
              return hasShowAccess(el);
          };
      },
      formatDateRange(){
        return (begin, end) => {
          if (begin && end) {
            let beginTime = moment(begin).format('YYYY-MM-DD HH:mm:ss')
            let endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
            return beginTime + '<br>'+ endTime;
          }else {
            return ""
          }
        }
      },
    },
    created() {
      this.searchData(true)
    },
    methods: {
      numberFormat: numberFormat.milliFormat,
      changeReportTime(data) {
          this.formItem.yyyymm = data;
          this.searchData(true);
      },
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return "";
        }
      },
      pick(obj, arr) {
        return arr.reduce((iter, val) => {
          val in obj && (iter[val] = obj[val])
          return iter
        }, {})
      },
      searchData(isfirst) {
        this.listLoading = true;
        if (isfirst) {
          this.formItem.pageIndex = 1;
        }
        let postData = {
          'customName': this.formItem.customName,
          'companyName': this.formItem.companyName,
          'date0': this.formItem.yyyymm ? this.formItem.yyyymm[0].split('-').join('') : '',
          'date1': this.formItem.yyyymm ? this.formItem.yyyymm[1].split('-').join('') : '',
          'fullUrl': this.formItem.fullUrl,
          'pageIndex': this.formItem.pageIndex,
          'pageSize': this.formItem.pageSize
        }
        let _this = this;
        axios
          .request({
            url: "/finance/findConsumeTotalBenefitModifyRecord",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              _this.rowData = d.data.data.data
              _this.total_count = d.data.data.total
            } else {
              this.$Message.error(d.data.msg);
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
            this.$Message.error("操作失败，请刷新重试")
          });
      },
      dataExport(){
      let postData = {
          'customName': this.formItem.customName,
          'companyName': this.formItem.companyName,
          'date0': this.formItem.yyyymm ? this.formItem.yyyymm[0].split('-').join('') : '',
          'date1': this.formItem.yyyymm ? this.formItem.yyyymm[1].split('-').join('') : '',
          'fullUrl': this.formItem.fullUrl,
          // 'pageIndex': this.formItem.pageIndex -1,
          // 'pageSize': this.formItem.pageSize
      }
        axios
          .request({
            url: "/finance/findConsumeTotalBenefitModifyRecordExport",
            method: "post",
            data: postData,
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "核减记录表导出" + ".xls";
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
      pageChange(page){
        this.formItem.pageIndex = page
        this.formItem.pageSize = 10
        this.searchData()
      },
      pageSizeChange(size){
        this.formItem.pageIndex = 1
        this.formItem.pageSize = size
        this.searchData()
      }
    }
  }
</script>

<style scoped lang="less">
.textOverFlow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
