<template>
  <div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="日期 :" >
        <Date-picker
          v-model="formItem.time"
          @on-change="handleChange"
          format="yyyy-MM-dd"
          type="daterange"
          placement="bottom-start"
          placeholder="选择日期"
          style="width: 200px"></Date-picker>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="dataExport" v-if="showAccess('数据统计_CPD明细数据报表_VIVO-导出')">导出</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">

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
  import config from "./config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";

  export default {
    name: "vivoCpd",
    data(){
      const dateNow = new Date()
      return{
        formItem: {
          start_date: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8),
          end_date: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1),
          time: [this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8), this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1)],
          limit: 10,
          page: 1
        },
        columns: config.VIVOFields,
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
      let postData = this.pick(this.formItem, ['page', 'limit'])
      postData.start_date = this.formItem.start_date.split('-').join('')
      postData.end_date = this.formItem.end_date.split('-').join('')
        axios
          .request({
            url: "ad/data/statistics/cpd/export/vivo/detail",
            method: "post",
            data: postData,
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "VIVO-CPD报表导出" + ".xls";
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
        // let postData = this.pick(this.formItem, ['start_date', 'end_date', 'page', 'limit'])
        let postData = this.pick(this.formItem, ['page', 'limit'])
        postData.start_date = this.formItem.start_date.split('-').join('')
        postData.end_date = this.formItem.end_date.split('-').join('')
        let _this = this;
        axios
          .request({
            url: "ad/data/statistics/cpd/vivo/detail",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              _this.rowData = d.data.data.info
              _this.total_count = Number(d.data.data.total_count)
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
        this.formItem.start_date = data[0]
        this.formItem.end_date = data[1]
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

<style scoped lang="less">

</style>
