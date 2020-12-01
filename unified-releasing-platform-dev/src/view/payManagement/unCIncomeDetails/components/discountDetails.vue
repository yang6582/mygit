<template>
  <div>
    <Modal
      :value="switchModal"
      width="800"
      title="核减"
      :mask-closable="false"
      @on-visible-change="closeModal"
    >
        <Form ref="form-inline" :model="formItem" inline :label-width="80" @submit.native.prevent>
            <FormItem label="公司名称:" prop="customName">
                <Input
                    v-model="formItem.customName"
                    placeholder="竞价客户"
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
        @on-selection-change="onSelChange"
        style="overflow-x:scroll;">
        <template slot-scope="{row, index}" slot="createTime">
          <span>{{formatDate(row.createTime)}}</span>
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
        style="margin-top:10px;display: flex;flex-flow: row-reverse;"
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
  props: ['switchModal', 'id'],
  data() {
    return {
        formItem: {
            customName: '',
            pageSize: 10,
            page: 1
        },
        listLoading: false,
        columns: config.detailsFields,
        rowData: [],
        total_count: 0,
        batchSelected: []
    }
        
  },
  created() {
    this.searchData(true)
  },
  computed: {
    
  },
  watch: {
      id(newVal, oldVal) {
          if (newVal) {
              this.searchData(true)
          }
      }
  },
  methods: {
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return "";
        }
      },
      closeModal(flag) {
          if (!flag) {
          this.$refs['form-inline'].resetFields();
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
            "bidAdId": this.id,
            "pageIndex": this.formItem.page,
            "pageSize": this.formItem.pageSize,
            "customerName": this.formItem.customName
        }
        let _this = this;
        axios
          .request({
            url: "/adBid/findCustomerBidRecord",
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
      onSelChange(sel) {
        this.batchSelected = sel
      },
      submitHandler() {
        //   提交数据
          this.$emit('close')
      }
  }
     
};
</script>
<style scoped lang="less">

</style>