<template>
  <div>
    <div class="summaryTables">
        <Card class="summaryBox">
            <div class="summaryTitle">总逾期金额</div>
            <div class="summaryContent">
                <Icon type="logo-yen" style="margin-top: -4px;"/>
                <span style="color:#DD2222;font-weight: bold;">
                  {{numberFormat(overdueInfo.totalOverdue)}}
                </span>
            </div>
        </Card>
        <Card class="summaryBox">
            <div class="summaryTitle">逾期个数</div>
            <div class="summaryContent">
                <span style="color:#c77e10;font-weight: bold;">
                  {{overdueInfo.overduleTotalCount}}个
                </span>
            </div>
        </Card>
        <Card class="summaryBox">
            <div class="summaryTitle">逾期范围个数</div>
            <div style ="font-size: 14px;">
              <div class="summaryContentCount"><span>逾期<=30天</span><span>{{overdueInfo.overduleIn30DaysCount}}个</span></div>
              <div class="summaryContentCount" style="color:#c77e10"> <span>30天<逾期<=60天</span><span>{{overdueInfo.overduleIn60DaysCount}}个</span></div>
              <div class="summaryContentCount" style="color:#DD2222"><span>逾期>60天</span><span>{{overdueInfo.overduleMoreThan60DaysCount}}个</span></div>
            </div>
        </Card>
    </div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="账期月度 :" >
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
      <FormItem label="销售员:">
        <Select
          v-model="formItem.salesId"
          style="width:200px"
          @on-change="searchData(true)"
          filterable
          clearable
        >
          <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="dataExport" v-if="showAccess('应收管理_逾期管理_导出')">导出</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="collectionHandler" v-if="showAccess('应收管理_逾期管理_催收')">催收</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
        @on-selection-change="onSelChange">
      <template slot-scope="{ row }" slot="overdueMoney">
        <span>{{numberFormat(row.overdueMoney)}}</span>
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
      <Modal
      title="催收信息"
      v-model="collectionModal"
      :mask-closable="false"
      width="580"
      :styles="{top: '100px'}"
    >
      <div style="padding:0 80px 0 20px" class="collectionForm">
        <Form
          ref="collectionForm"
          :model="collectionForm"
          :label-width="80"
          style="margin-top: 20px"
          :rules="ruleValidate"
        >
          <FormItem label="催收姓名:" prop="mailReceiptName">
            <Input v-model="collectionForm.mailReceiptName" placeholder="催收姓名"/>
          </FormItem>
          <FormItem label="催收邮箱:" prop="mail">
            <!-- <Input
                v-model="collectionForm.mail"
                type="textarea"
                :rows="1"
                placeholder="请填写正确邮箱地址"
                clearable
              ></Input> -->
              <EmailInput :value="collectionForm.mail" @input="onInputEmail" splitString=";" @save="saveValidateHandler"></EmailInput>
          </FormItem>
          <FormItem label="备注:" prop="memo">
            <Input
              v-model="collectionForm.memo"
              placeholder="请填写备注(30字内)"
              maxlength="30"
              show-word-limit
              type="textarea"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="collectionModal = false">取消</Button>
        <Button @click="collectionSubmit" style="margin-left:20px" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import axios from "@/libs/api.request";
  import config from "./config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";
  import numberFormat from '@/utils/numberFormat'
  // import MultiItemsInput from './components/MultiItemsInput'

  export default {
    name: "overdue",
    components: {
      EmailInput: () => import('./emailInput')
    },
    data(){
      const validateEmail = (rule, value, callback) => {
        let emails = value.split(";");
        let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if(emails.length == 0) {
          callback(new Error("邮箱为必填项！"));
        }
        if (emails.length > 10) {
          callback(new Error("多邮箱最大限制为10个"));
        }
        if (emails.length && value != "") {
          emails.some((email, index) => {
            if (!reg.test(email) && index != emails.length - 1) {
              callback(
                new Error("邮箱格式错误，多邮箱地址填写时，用英文分号隔开!")
              );
              return true;
            }
          });
        }
        callback();
      };
      const dateNow = new Date()
      return{
        overdueInfo: {
          "overduleIn30DaysCount": '',
          "overduleIn60DaysCount": '',
          "overduleMoreThan60DaysCount": '',
          "overduleTotalCount": '',
          "totalOverdue": ''
        },
        formItem: {
            yyyymm: [ moment()
            .subtract(2, "months")
            .format("YYYY-MM"),  moment().subtract(1, "months").format("YYYY-MM"),],
          pageSize: 10,
          pageIndex: 1,
          customName: '',
          salesId: ''
        },
        columns: config.tradingInquiry,
        rowData: [],
        listLoading: false,
        total_count: 0,
        marketList: [],
        collectionModal: false,
        loadingEmails: false,
        ruleValidate: {
          mailReceiptName: [
            {
              required: true,
              message: "催收姓名为必填项",
              trigger: "change"
            }
          ],
          mail: [
            {
              trigger: "blur",
              required: true,
              validator: validateEmail
            }
          ],
        },
        collectionForm: {
          mailReceiptName: '',
          mail: '',
          memo: ''
        },
        receiptCustoms: [],
        restaurants: [],
        state: '',
        aaa: '',
        timeout:  null,
        batchSelected: []
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
      this.getAllSaleInfo()
      this.getStaticsData()
    },
    methods: {
      numberFormat: numberFormat.milliFormat,
      changeReportTime(data) {
          this.formItem.yyyymm = data;
          this.searchData(true);
      },
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
      getStaticsData() {
        axios
          .request({
            url: "/finance/queryCpcStatementOverdueInfo",
            method: "post"
          })
          .then(d => {
            if (d.data.code == 0) {
              this.overdueInfo = d.data.data
            } else {
              this.$Message.error(d.data.msg);
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.$Message.error("操作失败，请刷新重试")
          });
      },
      searchData(isfirst) {
        this.listLoading = true;
        if (isfirst) {
          this.formItem.pageIndex = 1;
        }
        let postData = {
          'customName': this.formItem.customName,
          'salesId': this.formItem.salesId,
          'date0': this.formItem.yyyymm ? this.formItem.yyyymm[0].split('-').join('') : '',
          'date1': this.formItem.yyyymm ? this.formItem.yyyymm[1].split('-').join('') : '',
          'pageIndex': this.formItem.pageIndex,
          'pageSize': this.formItem.pageSize
        }
        let _this = this;
        axios
          .request({
            url: "/finance/queryCpcBillOverdue",
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
      getAllSaleInfo() {
        axios
          .request({
            url: "/ad/management/ads/getAllSaleInfo",
            method: "post"
          })
          .then(res => {
            if (res.data.code === 0) {
              this.marketList = res.data.data;
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
          });
      },
      dataExport(){
      let postData = {
        'customName': this.formItem.customName,
        'salesId': this.formItem.salesId,
        'date0': this.formItem.yyyymm ? this.formItem.yyyymm[0].split('-').join('') : '',
        'date1': this.formItem.yyyymm ? this.formItem.yyyymm[1].split('-').join('') : '',
      }
        axios
          .request({
            url: "/finance/queryCpcBillOverdueExport",
            method: "post",
            data: postData,
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "逾期报表导出" + ".xls";
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
      },
      onSelChange(sel) {
        this.batchSelected = sel
      },
      /** 催收 */
      collectionHandler() {
        if (!this.batchSelected.length) {
          this.$Message.warning('请选择逾期账单！')
          return
        }
        this.$refs.collectionForm.resetFields();
        // this.collectionForm.memo = "";
        // this.collectionForm.name = row.customName;
        this.collectionModal = true;
      },
      onInputEmail(val) {
        this.collectionForm.mail = val
      },
      saveValidateHandler(val, cab) {
        this.collectionForm.mail = val
        this.$refs['collectionForm'].validateField('mail', (error) => {
            cab(!error)
        })
      },
      collectionSubmit() {
        this.$refs["collectionForm"].validate(valid => {
          if (valid) {
            const ids = this.batchSelected.map(item => {return item.id})
            let postData = {
              ids: ids,
              mailReceiptName: this.collectionForm.mailReceiptName,
              mail: this.collectionForm.mail,
              memo: this.collectionForm.memo,
            };
            axios
              .request({
                url: "/finance/chaseDebt",
                method: "post",
                data: postData
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$Message.success("操作成功");
                  this.collectionModal = false;
                  // this.searchData();
                } else {
                  this.$Message.error(res.data.msg);
                }
              })
              .catch(err => {
                this.$Message.error("网络错误" + err);
              });
          }
        });
      },
    },
  }
</script>

<style scoped lang="less">
.summaryTables {
    display: flex;
    padding: 30px 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    .summaryBox {
        width: 30%;
        min-width: 200px;
        /deep/ .ivu-card-body {
          padding: 10px;
        }
        .summaryTitle {
            font-size: 20px;
        }
        .summaryContent {
            text-align: center;
            font-size: 20px;
            margin: 20px 0px;
        }
        .summaryContentCount {
          display: flex;
          justify-content: space-between;
          margin: 6px 12px;
        }
    }
}
.collectionForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.collectionForm /deep/ .ivu-input-word-count {
  text-align: center;
  position: absolute;
  right: 7px;
  top: 1px;
  bottom: 1px;
  padding-left: 7px;
  background: #fff;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  color: #808695;
  font-size: 12px;
}
</style>
