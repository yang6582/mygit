<template>
  <div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="应用名称:">
        <Input
          v-model.trim="formItem.appName"
          placeholder="应用名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="包名:">
        <Input
          v-model.trim="formItem.packageName"
          placeholder="包名"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="formItem.status"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option value="-1">全部</Option>
          <Option value="1">上线</Option>
          <Option value="0">下线</Option>
          <!-- <Option v-for="(item, index) in invoiceBussinessType" :key="item" :value="item">{{item}}</Option> -->
        </Select>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="dataExport" v-if="showAccess('工具箱_VIVOAPP实时状态-导出')">导出</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">
        <template slot-scope="{row, index}" slot="state">
          <div>
            <span class="statusLogo" :style="{backgroundColor: row.state == 1 ? '#79d640' : '#f55656'}"></span>
            {{row.state == 1 ? '上线' : '下线'}}
          </div>
        </template>
    </Table>
    <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
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

  export default {
    name: "vivoApp",
    data(){
      return{
        formItem: {
          appName: '',
          packageName: '',
          status: '-1',
          pageSize: 10,
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
      }
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
        ['appName', 'packageName', 'page', 'pageSize', 'status'])
        axios
          .request({
            url: "statistic/cpd/export",
            method: "post",
            data: postData,
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "VIVO-APP实时状态报表导出" + ".xls";
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
        let postData = this.pick(this.formItem, ['appName', 'packageName', 'page', 'pageSize', 'status'])
        let _this = this;
        axios
          .request({
            url: "/statistic/cpd/find",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              _this.rowData = d.data.data.data
              _this.total_count = Number(d.data.data.total)
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
        this.formItem.pageSize = 10
        this.searchData()
      },
      pageSizeChange(size){
        this.formItem.page = 1
        this.formItem.pageSize = size
        this.searchData()
      }
    }
  }
</script>

<style scoped lang="less">
.statusLogo {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 10px;
  vertical-align: text-bottom;
}
</style>
