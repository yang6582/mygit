<template>
  <div>
    <Modal
      :value="switchModal"
      width="800"
      title="回款"
      :mask-closable="false"
      @on-visible-change="closeModal"
    >
        <Form ref="form-inline" :model="formItem" inline :label-width="80" @submit.native.prevent>
            <FormItem label="公司名称:" prop="companyName">
                <Input
                    v-model="formItem.companyName"
                    placeholder="公司名称"
                    maxlength="30"
                    type="text"
                    clearable
                    style="width: 200px"
                    @on-enter="searchData(true)"
                />
            </FormItem>
            <FormItem :label-width="10">
                <Button type="primary" @click="searchData(true)">查询</Button>
            </FormItem>
        </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">
        <template slot-scope="{row}" slot="id">
            <Checkbox v-model="row.selectedStatus" @on-change="(params)=>{tableData2Choice(params,row)}"></Checkbox>
        </template>
        <template slot-scope="{row, index}" slot="entryDate">
          <span>{{formatDate(row.entryDate)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="entryAmount">
          <div>{{parseNumber(row.entryAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="availableDeductionAmount">
          <div>{{parseNumber(row.availableDeductionAmount)}}</div>
        </template>
        <template slot-scope="{ row,index }" slot="collectionAmount">
          <Input v-model="row.collectionAmount" @on-change="(params)=>{changeCollectionAmount(params,row)}"/>
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
        style="margin-top:10px;display: flex;"
      ></Page>
      <div slot="footer">
        <Button @click="cancelHandler">取消</Button>
        <Button @click="submitHandler" style="margin-left:20px" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "../config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess";

export default {
  name: "discountDetails", //核减
  props: ['switchModal', 'id', 'companyName'],
  data() {
    return {
        formItem: {
            companyName: '',
            pageSize: 10,
            page: 1
        },
        listLoading: false,
        columns: config.detailsFields,
        rowData: [],
        total_count: 0,
    }
        
  },
  created() {
    // this.searchData(true)
  },
  computed: {
    
  },
  watch: {
      companyName(newVal, oldVal) {
         if (newVal) {
              this.formItem.companyName = newVal
              this.searchData(true)
          }
      }
  },
  methods: {
      changeCollectionAmount(event, row) {
        this.rowData[row._index].collectionAmount = event.currentTarget.value;
      },
      parseNumber(str) {
          // 只有整数部分有千位符
          return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
      },
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD");
        } else {
          return "";
        }
      },
      closeModal(flag) {
          if (!flag) {
          // this.$refs['form-inline'].resetFields();
          this.$emit('close')
        }
      },
      cancelHandler() {
          this.$emit('close')
      },
      searchData(isfirst) {
        if (this.id == '') {
            return
        }
        this.listLoading = true;
        if (isfirst) {
          this.formItem.page = 1;
        }
        let postData = {
            // "consumeMonthBillId": this.id,
            "pageIndex": this.formItem.page,
            "pageSize": this.formItem.pageSize,
            "companyName": this.formItem.companyName
        }
        let _this = this;
        axios
          .request({
            url: "/finance/canCollectionList",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              _this.rowData = d.data.data.data
              _this.total_count = Number(d.data.data.total)
              _this.rowData.forEach(item => {
                item.collectionAmount = '';
                item.selectedStatus = false
              });
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
      tableData2Choice(params, row) {
        this.rowData[row._index].selectedStatus = params;
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
      },
      submitHandler() {
        //   提交数据
        const needData = []
        this.rowData.map(item => {
          if (item.selectedStatus) {
            needData.push({collectionId: item.id, collectionAmount: item.collectionAmount});
          }
        })
        this.$emit('close', {collectionInfos: needData})
      }
  }
     
};
</script>
<style scoped lang="less">

</style>