<template>
  <div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="审批时间 :" >
        <Date-picker
          v-model="formItem.time"
          @on-change="handleChange"
          format="yyyy-MM-dd"
          type="daterange"
          placement="bottom-start"
          placeholder="选择日期"
          style="width: 200px"></Date-picker>
      </FormItem>
      <FormItem label="用户名称 :">
        <Input v-model="formItem.customUsername" placeholder="用户名称" style="width: 200px" clearable @on-enter='searchData(true)'>
        </Input>
      </FormItem>
      <FormItem label="公司名称 :">
        <i-input v-model="formItem.companyName" placeholder="公司名称" style="width: 200px" clearable @on-enter='searchData(true)'>
        </i-input>
      </FormItem>
      <FormItem label="充值类型 :">
        <Select v-model="formItem.type" style="width:200px" @on-change='searchData(true)'>
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="dataExport" v-if="showAccess('财务管理_充值_流水查询导出')">导出</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">
        <template slot-scope="{row, index}" slot="receipt_date">
          <span v-if="row.receipt_date">{{row.receipt_date}}</span>
        </template>
    </Table>
    <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
        @on-change="pageChange"
        :page-size="formItem.limit"
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
  import config from "../config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";

  export default {
    name: "tradingInquiry",
    data(){
      const dateNow = new Date()
      return{
        formItem: {
          startDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8),
          endDate: this.formatDate(dateNow),
          type: 0,
          status: 2,
          time: [this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8), this.formatDate(dateNow)],
          limit: 10,
          page: 1,
          customUsername: '',
          companyName: ''
        },
        typeList: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '现金充值'
          },
          // {
          //   value: 2,
          //   label: '信用充值'
          // },
          {
            value: 128,
            label: '退款'
          }
        ],
        columns: config.tradingInquiry,
        rowData: [],
        listLoading: false,
        total_count: 0,
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
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD");
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
      dataExport(){
      let postData = this.pick(this.formItem, 
        ['startDate', 'endDate', 'status', 'type', 'page', 'limit', 'customUsername', 'companyName'])
      postData.cols = ['制单时间','客户名称','公司名称','充值类型','充值金额','制单人','备注']
        axios
          .request({
            url: "finance/rechargeExport",
            method: "post",
            data: postData,
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "流水报表导出" + ".xls";
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
      searchData(isfirst) {
        this.listLoading = true;
        if (isfirst) {
          this.formItem.page = 1;
        }
        let postData = this.pick(this.formItem, ['customUsername', 'companyName', 'startDate', 'endDate', 'status', 'type', 'page', 'limit'])
        let _this = this;
        axios
          .request({
            url: "finance/rechargeList",
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
      handleChange(data){
        this.formItem.startDate = data[0]
        this.formItem.endDate = data[1]
      },
      pageChange(page){
        this.formItem.page = page
        this.formItem.limit = 10
        this.searchData()
      },
      pageSizeChange(size){
        this.formItem.page = 1
        this.formItem.limit = size
        this.searchData()
      }
    }
  }
</script>

<style scoped>

</style>
