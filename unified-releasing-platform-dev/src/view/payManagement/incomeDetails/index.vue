<template>
  <div class="expendTableClass">
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top:20px;">
      <FormItem label="账期月度:">
        <el-date-picker
          style="width:200px"
          v-model="formItem.time"
          size="small"
          type="monthrange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="dateTimeChange"
          :clearable="false"
        ></el-date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customName"
          placeholder="客户名称"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="状态:">
        <Select v-model="formItem.type" style="width:180px" @on-change="searchData(true)">
          <Option :value="-1">全部</Option>
          <Option :value="4">全部回款</Option>
          <Option :value="1">未回款</Option>
          <Option :value="2">逾期</Option>
          <Option :value="3">部分回款</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="结算方式:">
        <Select v-model="formItem.optType" style="width:180px" @on-change="searchData(true)">
          <Option :value="-1">全部</Option>
          <Option :value="4">CPC</Option>
          <Option :value="1">CPS</Option>
          <Option :value="2">CPA</Option>
        </Select>
      </FormItem> -->
      <FormItem label="账单编号:">
        <Input
          style="width:190px"
          v-model="formItem.statementNo"
          placeholder="账单编号"
          clearable
          @on-change="changeStatementNo"
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="exportData" style="margin-left: 10px" v-if="showAccess('应收管理_应收管理明细表_导出')">导出</Button>
        <Button type="primary" @click="combineReceipt" style="margin-left: 10px" v-if="showAccess('应收管理_应收管理明细表_开票')">合并开票</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <!-- 自定义列 -->
      <columnsSelect
        :columns="columns"
        columnsNum="1"
        @columns-change="columnsChange"
      ></columnsSelect>
      <br>
      <Table
        border
        :columns="columnsSelection"
        :data="tableData"
        align="center"
        key="tableData"
        :loading="tableDataLoading"
        @on-selection-change="onSelChange"
        style="overflow-x:scroll;"
      >
        <template slot-scope="{row}" slot="invoiceStatus">
          <span>{{invoiceStatus[row.invoiceStatus]}}</span>
        </template>
        <template slot-scope="{row}" slot="collectionDate">
          <span v-if="row.collectionDate">{{row.collectionDate | formatDate2}}</span>
          <span v-else></span>
        </template>
        <template slot-scope="{ row }" slot="operator">
          <Button
            type="success" size='small'
            @click="openMaintain(row)"
            v-if="showAccess('应收管理_应收管理明细表_回款维护')"
          >回款维护</Button>
          <Button style="margin-left:10px"
            type="primary" size='small'
            @click="openReceipt(row)"
            v-if="showAccess('应收管理_应收管理明细表_开票') && row.invoiceStatus != 2"
          >开票</Button>
          <Button style="margin-left:10px"
            type="primary" size='small'
            @click="openDiscountDetails(row)"
            v-if="showAccess('应收管理_应收管理明细表_回款')"
          >回款</Button>
        </template>
      </Table>
      <Page
        :total="page.totalCount"
        :current="page.pageIndex"
        @on-change="pageChange"
        :page-size="page.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal
      title="回款维护"
      v-model="maintainModal"
      :mask-closable="false"
      width="500"
      :styles="{top: '100px'}"
    >
      <div style="padding:0 40px 0 20px" class="maintainForm">
        <Form
          ref="maintainForm"
          :model="maintainForm"
          :label-width="80"
          style="margin-top: 20px"
          :rules="ruleValidate"
        >
          <FormItem label="客户名称:">
            <Input v-model="maintainForm.customName" placeholder="客户名称" disabled readonly />
          </FormItem>
          <FormItem label="公司名称:">
            <Input v-model="maintainForm.companyName" placeholder="公司名称" disabled readonly />
          </FormItem>
          <FormItem label="欠款金额:">
            <Input v-model="maintainForm.remainDebt" placeholder="欠款金额" disabled readonly>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="回款金额:" prop="returnTotal">
            <Input v-model="maintainForm.returnTotal" placeholder="回款金额" clearable>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="回款日期:" prop="returnMonyDate">
            <DatePicker
              v-model="maintainForm.returnMonyDate"
              type="date"
              placeholder="选择回款日期"
              style="width: 200px"
              format="yyyy年MM月dd日"
              @change="dateTimeChangeReturnMonyDate"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem label="回款凭证:" prop="voucherUploadedPath">
            <Upload
              action="/finance/uploadCpcStatementProofImage"
              ref="uploadVoucher"
              :on-remove="voucherRemove"
              accept="image/*"
              :before-upload="voucherBeforeUpload"
              :on-success="imgUploadSuccess"
              :on-error="imgUploadError"
              :headers="headers"
            >
              <div
                v-if="maintainForm.voucherUploadedPath"
                style="position:relative;border-raduis:4px;border: 2px dotted gray;line-height: 0;"
                class="mask-wrap"
              >
                <img
                  :src="maintainForm.voucherUploadedPath"
                  style="max-height:150px;max-width:400px;"
                />
                <div class="mask">重新上传</div>
              </div>
              <Icon
                v-else
                type="ios-cloud-upload-outline"
                size="60"
                style="border-radius:5px;border: 2px dotted gray;cursor:pointer;"
              />
            </Upload>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input
              v-model="maintainForm.remark"
              placeholder="请填写备注"
              maxlength="30"
              show-word-limit
              type="textarea"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="maintainModal = false">取消</Button>
        <Button @click="voucherSubmit" style="margin-left:20px" type="primary">确定</Button>
      </div>
    </Modal>
    <makeReceipt :addModal="addModal" :formData="currentRowData" :addType="addType" @close="closeModalHandler" from="CPC" :ids="deDuplication"/>
    <DiscountDetails :switchModal="showDetails" :companyName="currentCompanyName" :id="bidId" @close="closeBidDetails"></DiscountDetails>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import { datefmt } from "@/utils/dateFormat";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import expandRow from "./components/expandRow";
moment.locale("zh-cn");
export default {
  name: "incomeDetails",
  components: {
    makeReceipt: () => import('@/view/financialManagement/receipt/components/makeReceipt.vue'),
    DiscountDetails: () => import('./components/discountDetails'),
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validPricePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写回款金额！"));
      } else if (isNaN(value)) {
        callback(new Error("回款金额必须为数字！"));
      }
      if (
        !/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(
          value
        )
      ) {
        callback(new Error("回款金额只支持小数点前最多8位，小数点后最多4位"));
      }
      callback();
    };
    const validateLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请上传回款凭证"));
      }
      callback();
    };
    const statementNo = this.$route.params.statementNo || ''
    return {
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg3Nzc5NjM3MDE1LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4Nzc3OTYzNzAxNSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      ruleValidate: {
        returnMonyDate: [
          {
            required: true,
            type: "date",
            message: "请选择回款日期",
            trigger: "change"
          }
        ],
        returnTotal: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        // voucherUploadedPath: [
        //   // { required: true, message: '营业执照未上传,请上传', trigger: 'blur' },
        //   { validator: validateLicense, trigger: "blur", required: true }
        // ],
        remark: [{
          required: true,
          message: "请填写备注",
          trigger: "change"
        }]
      },
      maintainForm: {
        customName: "",
        statementNo: "",
        companyName: '',
        remainDebt: "",
        returnTotal: "",
        remark: "",
        voucherUploadedPath: ""
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formItem: {
        time: [
          statementNo 
          ? statementNo.match(/[A-Za-z]*([0-9]{6})/)[1].replace(/(\d{4})/, '$1' + '-')
          : moment().subtract(2, "months").format("YYYY-MM"),
          statementNo 
          ? statementNo.match(/[A-Za-z]*([0-9]{6})/)[1].replace(/(\d{4})/, '$1' + '-')
          : moment().subtract(1, "months").format("YYYY-MM")
        ],
        customName: "",
        type: -1,
        statementNo: statementNo
      },
      invoiceStatus: {
        0: '未开',
        1: '部分开票', 
        2: '全部开票'
      },
      columnsSelection: [],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center",
          key: "index",
          fixed: 'left'
        },
        {
          title: "账期",
          align: "center",
          key: "statisticsMonth",
          width: 80
        },
        {
          title: "客户名称",
          align: "center",
          key: "customName",
          width: 120
        },
        {
          title: "公司名称",
          align: "center",
          key: "companyName",
          minWidth: 120
        },
        {
          title: "账单编号",
          align: "center",
          key: "statementNo",
          width: 150
        },
        {
          title: '期初余额',
          align: 'center',
          key: 'initTotalLeftFee',
          width: 100
        },
        {
          title: '期末余额',
          align: 'center',
          key: 'endTotalLeftFee',
          width: 100
        },
        {
          title: "应收金额",
          align: "center",
          key: "realTotal",
          width: 100
        },
        {
          title: "应收日期",
          align: "center",
          key: "shouldReceiveMoneyDate",
          width: 100
        },
        {
          title: "回款金额",
          align: "center",
          key: "collectionTotal",
          width: 100
        },
        {
          title: "回款日期",
          align: "center",
          key: "collectionDate",
          slot:'collectionDate',
          width: 100
        },
        {
          title: "欠款金额",
          align: "center",
          key: "remainDebt",
          width: 100
        },
        {
          title: "回款状态",
          align: "center",
          key: "collectionStatusName",
          width: 100
        },{
          title: "账龄",
          align: "center",
          key: "billAge",
          width: 80
        },
        // {
        //   title: '是否开票',
        //   align: 'center',
        //   key: 'invoiceStatus',
        //   slot: 'invoiceStatus',
        //   width: 100
        // },
        // {
        //   title: '开票金额',
        //   align: 'center',
        //   key: 'invoiceMoney',
        //   width: 100
        // },
        {
          title: "操作",
          align: "center",
          key: "operator",
          slot: "operator",
          width: 210
        }
      ],
      tableData: [],
      tableDataLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      maintainModal: false,
      addModal: false,
      addType: 'add',
      batchSelected: [],
      deDuplication: [],
      currentRowData: {},
      showDetails: false,
      bidId: '',
      currentCompanyName: ''
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  created() {
    this.searchData(true);
  },
  methods: {
    changeStatementNo(value) {
      this.$route.params.statementNo = ''
    },
    columnsChange(columns) {
      this.columnsSelection = Array.prototype.concat({
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left'
        },
        {
          type: "expand",
          width: 50,
          fixed: 'left',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        }, columns);
    },
    imgUploadError() {
      this.$Notice.error({
        title: "图片上传失败",
        desc: "图片上传失败请检查网络"
      });
    },
    imgUploadSuccess(res, file) {
      if (res.code === 0) {
        this.maintainForm.voucherUploadedPath = res.data;
        this.$Notice.success({
          title: "图片上传成功",
          desc: "图片上传成功"
        });
      }
    },
    voucherBeforeUpload(file) {
      if (file.size > 2048000) {
        this.$Message.error("图片大小限制为2M");
        return false;
      }
      this.$refs.uploadVoucher.clearFiles();
    },
    voucherRemove() {
      this.$refs.uploadVoucher.clearFiles();
      this.maintainForm.voucherUploadedPath = "";
    },
    datePickerChange(date) {
      this.formItem.time = date.split("-").join("");
      this.searchData(true);
    },
    getLastMonth(d) {
      //获取上个月日期
      let date = d ? d : new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      return year + (month.toString().length == 1 ? "0" + month : month);
    },
    searchData(flag) {
      this.tableDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let postData = {
        date0: this.formItem.time[0].split("-").join(""),
        date1: this.formItem.time[1].split("-").join(""),
        customName: this.formItem.customName.trim(),
        pageIndex: this.page.pageIndex - 1,
        pageSize: this.page.pageSize,
        status: this.formItem.type,
        statementNo: this.formItem.statementNo
        // optType: this.formItem.opyType
      };
      axios
        .request({
          url: "/finance/queryCpcStatementWithCollectionStatus",
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.page.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.tableDataLoading = false;
        })
        .catch(err => {
          this.tableDataLoading = false;
          this.$Message.error("网络错误" + err);
        });
    },
    exportData() {
      let postData = {
        date0: this.formItem.time[0].split("-").join(""),
        date1: this.formItem.time[1].split("-").join(""),
        customName: this.formItem.customName.trim(),
        status: this.formItem.type,
        statementNo: this.formItem.statementNo
      };
      axios
        .request({
          url: "/finance/exportCpcStatementWithCollectionStatus",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =
              "应收管理明细表" +
              this.formItem.time[0].split("-").join("") +
              "-" +
              this.formItem.time[1].split("-").join("") +
              ".xls";
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
          } else {
            this.$Message.error("导出失败,请刷新重试");
          }
        })
        .catch(() => {
          this.$Message.error("导出失败");
        });
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchData();
    },
    pageChange(index) {
      this.page.pageIndex = index;
      this.searchData();
    },
    dateTimeChange(date) {
      this.formItem.time = date;
      this.searchData();
    },
    openMaintain(row) {
      this.$refs.uploadVoucher.clearFiles();
      this.$refs.maintainForm.resetFields();
      this.maintainForm.remark = "";
      this.maintainForm.id = row.id;
      this.maintainForm.companyName = row.companyName;
      this.maintainForm.customName = row.customName;
      this.maintainForm.statementNo = row.statementNo;
      this.maintainForm.remainDebt = row.remainDebt;
      this.maintainModal = true;
    },
    openReceipt(row) {
      this.addModal = true
      this.currentRowData = row
      this.deDuplication = [row.id]
    },
    openDiscountDetails(row) {
      this.bidId = row.id
      this.currentCompanyName = row.companyName
      this.showDetails = true
    },
    closeBidDetails(data) {
      if (!data) {
        this.showDetails = false
        this.bidId = ''
        this.currentCompanyName = ''
        return
      }
      if (!data.collectionInfos.length) {
        this.$Message.error("请选择回款项");
        return
      }
      // let param = new FormData()
      // param.append('consumeMonthBillId', this.bidId)
      // param.append('collectionId', data.id)
      // param.append("collectionAmount", data.collectionAmount)
      axios.request({
        url: '/finance/batchSelectCollectionByCpcStatement',
        method: 'post',
        data: {
          consumeMonthBillId: this.bidId,
          collectionInfos: data.collectionInfos
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.$Message.success("操作成功");
          this.showDetails = false
          this.bidId = ''
          this.currentCompanyName = ''
          this.searchData()
        } else {
          this.$Message.error(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.error("网络错误" + err);
      });
    },
    dateTimeChangeReturnMonyDate(time) {
      this.maintainForm.returnMonyDate = time;
    },
    voucherSubmit() {
      this.$refs["maintainForm"].validate(valid => {
        if (valid) {
          let postData = {
            consumeMonthBillId: this.maintainForm.id,
            returnProof: this.maintainForm.voucherUploadedPath,
            returnDate: this.maintainForm.returnMonyDate,
            returnAmount: this.maintainForm.returnTotal,
            returnMemo: this.maintainForm.remark
          };
          axios
            .request({
              url: "/finance/addAdCpcConsumeBillReturnMoneyRecord",
              method: "post",
              data: postData
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success("操作成功");
                this.maintainModal = false;
                this.searchData();
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
    closeModalHandler(data) {
      this.addModal = false
      this.currentRowData = {}
      if (data && data.update) {
        this.searchData()
      }
    },
    onSelChange(sel) {
      this.batchSelected = sel
    },
    combineReceipt() {
      if (!this.batchSelected.length) {
        this.$Message.warning('请选择合并开票的账单！')
        return
      }
      let deDuplication = Array.from(new Set(this.batchSelected.map(item => {
        return item.customId;
      })))
      this.deDuplication = Array.from(new Set(this.batchSelected.map(item => {
        return item.id;
      })))
      if (deDuplication.length != 1) {
        this.$Message.warning('不同客户不能合并开票！')
        return
      }
      
      this.currentRowData = this.batchSelected.filter(item => {
        return item.customId == deDuplication[0]
      })[0]
      this.addModal = true
    }
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDate2(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>
<style lang="less" scoped>
.expendTableClass /deep/ td.ivu-table-expanded-cell {
  padding: 0;
}
.maintainForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.maintainForm /deep/ .ivu-input-word-count {
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
.mask-wrap:hover .mask {
  display: block;
}
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  overflow: hidden;
}
</style>